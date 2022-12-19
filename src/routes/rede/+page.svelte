<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022  Cláudio Pereira

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>. -->
<script>
	import { apiServer } from '$lib/settings.js';
	import { stopIcon } from '$lib/assets.js';
	import { calcRouteMultipoly, stopName } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { browser } from '$app/environment';
	import L from 'leaflet?client';
	import 'leaflet.markercluster?client';
	import 'leaflet.locatecontrol?client';
	import 'leaflet-lasso?client';
	import WHeader from '$lib/components/map/WidgetHeader.svelte';
	import CompactSchedule from '$lib/components/map/CompactSchedule.svelte';
	import RouteListing from '$lib/components/map/RouteListing.svelte';
	import RouteStops from '$lib/components/RouteStops.svelte';
	import Instructions from '$lib/components/map/Instructions.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const stops = data.stops;
	const routes = data.routes;

	// $: routeDict = Object.fromEntries(routes.map((route) => [route.id, route]));

	const selectedRouteId = writable(null);
	const selectedSubrouteId = writable(null);

	const selectedRoute = derived([selectedRouteId], ([$selectedRouteId]) => {
		if ($selectedRouteId === undefined) {
			return;
		}
		return routes[$selectedRouteId];
	});

	export const selectedRouteStops = derived([selectedRouteId], ([$selectedRouteId], set) => {
		if ($selectedRouteId) {
			fetch(`${apiServer}/v1/routes/${$selectedRouteId}/stops`)
				.then((r) => r.json())
				.then((data) => {
					const stopsBySubroute = Object.fromEntries(
						data.map((subrouteStops) => {
							return [subrouteStops.subroute, subrouteStops.stops.map((stopId) => stops[stopId])];
						})
					);
					console.log(stopsBySubroute);
					set(stopsBySubroute);
				});
		} else {
			return {};
		}
	});

	const subrouteStops = derived(
		[selectedRouteStops, selectedSubrouteId],
		([$selectedRouteStops, $selectedSubrouteId]) => {
			if ($selectedRouteStops) {
				return $selectedRouteStops[$selectedSubrouteId];
			}
		}
	);

	subrouteStops.subscribe((val) => {
		console.log(val);
		if (val && map) {
			drawSubroute();
		}
	});

	let map;
	let amlgeo;
	let parishesgeo;
	const touchOriented = browser ? window.matchMedia('(pointer: coarse)').matches : false;

	const color = (b) => `hsl(${getComputedStyle(document.body).getPropertyValue('--' + b)})`;

	let info;

	let stopMarkers = {};
	let selectedPolylines = [];

	let currentSpider;
	let selectedRoutes;

	let mapLayers;

	const modes = {
		learn: 'learn',
		routing: 'routing'
	};

	let mode = writable(undefined);

	mode.subscribe(() => {
		if (!map) {
			return;
		}
		reset();
		selectedRoutes = undefined;
		mapLayers.spiderMap.removeFrom(map);
	});

	const phases = {
		selecting: 'selecting',
		presenting: 'presenting',
		route: 'route'
	};

	let phase = writable(phases.selecting);

	phase.subscribe((val) => {
		if (!map) {
			return;
		}

		if (val === phases.selecting) {
			reset();
			mapLayers.stops.addTo(map);
			selectedRoutes = undefined;
			matchFeaturesToZoomLevel();
		}

		if (val !== phases.selecting) {
			mapLayers.stops.removeFrom(map);
		}

		if (val !== phases.route) {
			mapLayers.subrouteLayer.removeFrom(map);
		}

		if (val !== phases.presenting) {
			mapLayers.spiderMap.removeFrom(map);
		}
	});

	const zoomLevel = writable(0);
	const isSelectableZoomLevel = derived(zoomLevel, ($zoomLevel) => {
		return $zoomLevel >= 14;
	});

	function zoneColor(zone) {
		switch (zone) {
			case 1:
				return { color: '#f59f00' };
			case 2:
				return { color: '#0ca678' };
			case 3:
				return { color: '#ff6b00' };
			case 4:
				return { color: '#228be6' };
			default:
				return { color: '#6f7479' };
		}
	}

	function onParishFeature(feature, layer) {
		layer.on({
			mouseover: (e) => {
				let layer = e.target;

				layer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});

				layer.bringToFront();

				info.update(layer.feature.properties);
			},
			mouseout: (e) => {
				parishesgeo.resetStyle(e.target);
				info.update();
			},
			click: (e) => {
				let bounds = e.target.getBounds();
				if (map.getBounds().contains(bounds)) {
					map.setView(bounds.getCenter(), map.getZoom() + 1);
				} else {
					map.zoomIn();
				}
			}
		});
	}

	function onMunicipalityFeature(feature, layer) {
		layer.on({
			mouseover: (e) => {
				let layer = e.target;

				layer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});

				layer.bringToFront();

				info.update(layer.feature.properties);
			},
			mouseout: (e) => {
				amlgeo.resetStyle(e.target);
				info.update();
			},
			click: (e) => {
				map.fitBounds(e.target.getBounds());
				mapLayers.municipalities.removeFrom(map);
				mapLayers.parishes.addTo(map);
			}
		});
	}

	if (browser) {
		fetch('/aml.min.geojson')
			.then((r) => r.json())
			.then((obj) => {
				amlgeo = L.geoJSON(obj, {
					style: (feature) => {
						return zoneColor(feature.properties.zone);
					},
					onEachFeature: onMunicipalityFeature
				}).addTo(mapLayers.municipalities);
				if (map) {
					map.fitBounds(amlgeo.getBounds());
				}
			});

		fetch('/freguesias.min.geojson')
			.then((x) => x.json())
			.then((obj) => {
				parishesgeo = L.geoJSON(obj, {
					onEachFeature: onParishFeature
				}).addTo(mapLayers.parishes);
			});
	}

	function applySpiderMap(spiderMap) {
		currentSpider = spiderMap;
		selectedRoutes = Object.keys(spiderMap.routes).map((id) => {
			return routes[id];
		});
		$phase = phases.presenting;
		drawSpiderMap(spiderMap);
	}

	function fetchSpiderMap(stopId) {
		fetch(`${apiServer}/v1/stops/${stopId}/spider`)
			.then((x) => x.json())
			.then(applySpiderMap);
	}

	function fetchAggregateMap(stopIds) {
		fetch(`${apiServer}/v1/stops/spider`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(stopIds)
		})
			.then((x) => x.json())
			.then(applySpiderMap);
	}

	function addStopLayer() {
		Object.values(stops).forEach((stop) => {
			if (stop.lat && stop.lon) {
				let marker = L.marker([stop.lat, stop.lon], { icon: stopIcon });
				marker.bindTooltip(`${stop.id} - ${stopName(stop)}`);
				marker.info = stop;
				marker.stopId = stop.id;

				marker.on('click', (e) => fetchSpiderMap(e.target.stopId));
				mapLayers.stops.addLayer(marker);
				stopMarkers[stop.id] = marker;
			}
		});
	}

	function drawSpiderMap(spiderMap) {
		console.log(spiderMap);
		let stops = spiderMap.stops;

		mapLayers.spiderMap.removeFrom(map);
		mapLayers.spiderMap = L.layerGroup();
		let bounds;

		// used to have a contour
		let innerPolyLines = [];
		Object.values(spiderMap.subroutes).forEach((subroute) => {
			let segments = calcRouteMultipoly(subroute.stop_sequence.map((stopId) => stops[stopId]));

			let innerPolyline = L.polyline(segments, {
				color: 'white',
				weight: 4
			});
			innerPolyline.routeId = subroute.route;
			innerPolyLines.push(innerPolyline);
			let outerPolyline = L.polyline(segments, {
				color: '#000',
				weight: 6
			}).addTo(mapLayers.spiderMap);
			bounds = bounds ? bounds.extend(outerPolyline.getBounds()) : outerPolyline.getBounds();
		});
		innerPolyLines.forEach((polyline) => {
			polyline.addTo(mapLayers.spiderMap);
		});
		mapLayers.spiderMap.addTo(map);
		if (bounds.isValid()) {
			map.fitBounds(bounds);
		}
		selectedPolylines = innerPolyLines;
	}

	function drawSubroute() {
		mapLayers.spiderMap.removeFrom(map);
		mapLayers.subrouteLayer.removeFrom(map);
		mapLayers.subrouteLayer = L.layerGroup();

		let segments = calcRouteMultipoly($subrouteStops);

		let outerPolyline = L.polyline(segments, {
			color: 'black',
			weight: 6
		}).addTo(mapLayers.subrouteLayer);
		let innerPolyline = L.polyline(segments, {
			color: 'white',
			weight: 4
		}).addTo(mapLayers.subrouteLayer);
		mapLayers.subrouteLayer.addTo(map);
		let bounds = outerPolyline.getBounds();
		if (bounds.isValid()) {
			map.fitBounds(bounds);
		}

		for (let i = 0; i < $subrouteStops.length; i++) {
			let stop = $subrouteStops[i];

			if (stop.lat && stop.lon) {
				let marker = L.marker([stop.lat, stop.lon], { icon: stopIcon });
				marker.on('click', () => {
					// selectStop(stop.id);
				});
				marker.addTo(mapLayers.subrouteLayer);
			}
		}
	}

	async function openRoute(e) {
		$selectedRouteId = e.detail.routeId;
		$phase = phases.route;
		await tick();
		let el = document.getElementById('stops');
		if (el) {
			el.scrollIntoView(true);
		}
	}

	async function openSchedule(e) {
		$phase = phases.route;
		$selectedRouteId = e.detail.routeId;
		await tick();
		let el = document.getElementById('schedule');
		if (el) {
			el.scrollIntoView(true);
		}
	}

	async function openInfo(e) {
		alert('Por fazer');
	}

	function hintRoute(e) {
		let routeId = e.detail.routeId;
		selectedPolylines
			.filter((line) => {
				return line.routeId === routeId;
			})
			.forEach((line) => {
				line.bringToFront();
				line.setStyle({ color: color('p') });
			});
	}

	function dropRouteHint(e) {
		let routeId = e.detail.routeId;
		selectedPolylines
			.filter((line) => {
				return line.routeId === routeId;
			})
			.forEach((line) => line.setStyle({ color: 'white' }));
	}

	function matchFeaturesToZoomLevel() {
		let newZoomLevel = map.getZoom();
		$zoomLevel = newZoomLevel;

		if (newZoomLevel >= 14) {
			mapLayers.stops.addTo(map);
		} else {
			mapLayers.stops.removeFrom(map);
		}

		if (newZoomLevel <= 11 && !selectedRoutes) {
			mapLayers.municipalities.addTo(map);
		} else {
			mapLayers.municipalities.removeFrom(map);
		}
		if (newZoomLevel > 11 && newZoomLevel <= 13 && !selectedRoutes) {
			mapLayers.parishes.addTo(map);
		} else {
			mapLayers.parishes.removeFrom(map);
		}

		if (newZoomLevel >= 12 || (newZoomLevel >= 10 && touchOriented)) {
			mapLayers.legend.remove();
		} else {
			mapLayers.legend.addTo(map);
		}
	}

	export function reset() {
		// selectedDay.set(new Date().toISOString().split('T')[0]);
		// selectedOperatorId.set(undefined);
		selectedRouteId.set(undefined);
		selectedSubrouteId.set(undefined);
	}

	onMount(() => {
		mapLayers = {
			parishes: L.layerGroup(),
			municipalities: L.layerGroup(),
			stops: L.markerClusterGroup({
				spiderfyOnMaxZoom: false,
				showCoverageOnHover: false,
				disableClusteringAtZoom: 15
			}),
			spiderMap: L.layerGroup(),
			selectionArea: L.layerGroup(),
			subrouteLayer: L.layerGroup(),
			legend: L.control({ position: 'bottomleft' })
		};

		addStopLayer();

		mapLayers.stops.on('mouseover', () => {
			mapLayers.selectionArea.removeFrom(map);
		});
		mapLayers.stops.on('mouseout', () => {
			mapLayers.selectionArea.addTo(map);
		});

		info = L.control();

		map = L.map('map', {
			maxBounds: new L.LatLngBounds(new L.LatLng(38.3, -10.0), new L.LatLng(39.35, -8.0)),
			maxBoundsViscosity: 1.0,
			minZoom: 10
		}).setView([38.71856, -9.1372], 10);

		map.on('zoomend', matchFeaturesToZoomLevel);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			subdomains: ['a', 'b'],
			attribution: '© OpenStreetMap'
		}).addTo(map);

		L.control.scale({ imperial: false }).addTo(map);
		L.control
			.locate({
				flyTo: true,
				strings: {
					title: 'Ir para a minha posição'
				}
			})
			.addTo(map);
		L.control.lasso({ position: 'topleft' }).addTo(map);
		map.on('lasso.finished', (event) => {
			let stopIds = event.layers
				.map((marker) => {
					return marker.stopId;
				})
				.filter((id) => {
					return id !== undefined;
				});
			if (stopIds.length === 0) {
				alert('A área escolhida não seleccionou nada');
			} else {
				fetchAggregateMap(stopIds);
			}
		});

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
			if (props) {
				this._div.innerHTML = '<b>' + props.name + '</b><br />';
			}
		};
		info.addTo(map);

		mapLayers.municipalities.addTo(map);

		mapLayers.legend.onAdd = function (map) {
			const div = L.DomUtil.create('div', 'info legend');
			div.innerHTML =
				'' +
				'<i style="background:#f59f00"></i>Área 1<br>' +
				'<i style="background:#0ca678"></i>Área 2<br>' +
				'<i style="background:#ff6b00"></i>Área 3<br>' +
				'<i style="background:#228be6"></i>Área 4<br>' +
				'<i style="background:#abb3bb"></i>Independente';

			return div;
		};

		if (!touchOriented) {
			mapLayers.legend.addTo(map);
		}
	});
</script>

<svelte:head>
	<title>Intermodal - Rede de transportes</title>
	<meta name="description" content="Rede de transportes disponíveis na AML" />
</svelte:head>

<div class="inset-0 fixed flex flex-col">
	{#if $mode === undefined}
		<div style="z-index: 2000; background-color: #33336699; position: absolute" class="inset-0" />
	{/if}
	<div id="map" class="w-full grow" />

	{#if $mode === undefined}
		<div class="fixed inset-x-0 m-auto  w-full lg:w-[28rem]">
			<div class="mx-3 p-4 flex flex-col gap-4 rounded-2xl shadow-xl bg-base-100">
				<span class="text-xl">Como é que podemos ajudar?</span>
				<div class="ml-4 flex flex-col gap-4">
					<div class="flex flex-col">
						<span class="text-lg">Conhecer uma zona</span>
						<input
							type="button"
							value="Consultar"
							class="btn btn-primary rounded-full"
							on:mouseup={() => {
								$mode = modes.learn;
							}}
						/>
					</div>
					<div class="flex flex-col">
						<span><span class="text-lg line-through">Alcançar um destino</span> (Futuramente)</span>
						<input type="button" value="Rotear" disabled class="btn btn-primary rounded-full" />
					</div>
				</div>
			</div>
		</div>
	{:else if $mode === modes.learn}
		{#if $selectedRouteId}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-3/5 bg-base-100 lg:rounded-tl-2xl z-[10000] shadow-xl w-full lg:w-[28rem] carousel"
			>
				<div id="stops" class="carousel-item flex flex-col gap-1 w-full">
					<WHeader
						backBtn="true"
						on:back={() => {
							$selectedRouteId = undefined;
						}}
						fg={$selectedRoute.badge_text}
						bg={$selectedRoute.badge_bg}>{$selectedRoute.code}: {$selectedRoute.name}</WHeader
					>
					<select class="select select-primary w-full mx-auto" bind:value={$selectedSubrouteId}>
						{#each $selectedRoute.subroutes as subroute}
							<option value={subroute.id}>{subroute.flag}</option>
						{/each}
					</select>
					{#if $subrouteStops}
						<RouteStops subrouteStops={$subrouteStops} />
					{/if}
				</div>
				<div id="schedule" class="carousel-item flex flex-col w-full">
					<WHeader
						backBtn="true"
						on:back={() => {
							$selectedRouteId = undefined;
						}}
						fg={$selectedRoute.badge_text}
						bg={$selectedRoute.badge_bg}>{$selectedRoute.code}: {$selectedRoute.name}</WHeader
					>
					<CompactSchedule />
				</div>
			</div>
		{:else if selectedRoutes}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-3/5 bg-base-100 lg:rounded-tl-2xl z-[10000] overflow-hidden shadow-xl w-full lg:w-[28rem] flex flex-col"
			>
				<WHeader backBtn="true" on:back={() => ($phase = phases.selecting)}
					>Rotas encontradas</WHeader
				>
				<div class="overflow-y-scroll w-full">
					<RouteListing
						bind:selectedRoutes
						on:openroute={openRoute}
						on:openschedule={openSchedule}
						on:openinfo={openInfo}
						on:hint={hintRoute}
						on:drophint={dropRouteHint}
					/>
				</div>
			</div>
		{:else}
			<div
				class="lg:fixed right-0 bottom-0 bg-base-100 rounded-t-2xl lg:rounded-t-none lg:rounded-tl-2xl z-[10000] shadow-xl w-full lg:w-[28rem]"
			>
				<Instructions {isSelectableZoomLevel} />
			</div>
		{/if}
	{/if}
</div>

{#if $mode === undefined}
	<div class="fixed inset-x-0 m-auto  w-full md:w-[28rem]">
		<div class="mx-3 p-4 flex flex-col gap-4 rounded-2xl shadow-xl bg-base-100">
			<span class="text-xl">Como é que podemos ajudar?</span>
			<div class="ml-4 flex flex-col gap-4">
				<div class="flex flex-col">
					<span class="text-lg">Conhecer uma zona</span>
					<input
						type="button"
						value="Consultar"
						class="btn btn-primary rounded-full"
						on:mouseup={() => {
							$mode = modes.learn;
						}}
					/>
				</div>
				<div class="flex flex-col">
					<span><span class="text-lg line-through">Alcançar um destino</span> (Futuramente)</span>
					<input type="button" value="Rotear" disabled class="btn btn-primary rounded-full" />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet.markercluster/dist/MarkerCluster.css';
	@import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
</style>
