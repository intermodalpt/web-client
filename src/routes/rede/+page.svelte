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
	import { onMount } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { browser } from '$app/environment';
	import L from 'leaflet?client';
	import 'leaflet.markercluster?client';
	import 'leaflet.locatecontrol?client';
	import 'leaflet-lasso?client';
	import { apiServer } from '$lib/settings.js';
	import { stopIcon } from '$lib/assets.js';
	import { calcRouteMultipoly, stopName, sensibleLengthStopName } from '$lib/utils.js';
	import WHeader from '$lib/components/map/WidgetHeader.svelte';
	import CompactSchedule from '$lib/components/map/CompactSchedule.svelte';
	import StopInfo from '$lib/components/map/StopInfo.svelte';
	import RouteStops from '$lib/components/RouteStops.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const stops = data.stops;
	const routes = data.routes;

	const stack = writable([]);
	const lastInStack = derived(stack, ($stack) => $stack[$stack.length - 1]);

	const selectedRouteId = derived([lastInStack], ([$lastInStack]) => {
		return $lastInStack?.routeId;
	});
	const selectedStopId = derived([lastInStack], ([$lastInStack]) => {
		return $lastInStack?.stopId;
	});
	const selectedStop = derived([selectedStopId], ([$selectedStopId]) => {
		if ($selectedStopId === undefined) {
			return;
		}
		return stops[$selectedStopId];
	});

	const selectedStopPictures = derived(selectedStopId, ($selectedStopId, set) => {
		if ($selectedStopId) {
			fetch(`${apiServer}/v1/stops/${$selectedStopId}/pictures`)
				.then((r) => r.json())
				.then((data) => {
					set(data);
				});
		} else {
			set([]);
		}
	});

	const selectedSubrouteId = writable(null);

	const selectedRoute = derived([selectedRouteId], ([$selectedRouteId]) => {
		if ($selectedRouteId === undefined) {
			return;
		}
		$selectedSubrouteId = routes[$selectedRouteId].subroutes[0]?.id
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

	let mode = writable(modes.learn);

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

	let showHelp = true;

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

				marker.on('click', stopClickHandler);
				mapLayers.stops.addLayer(marker);
				stopMarkers[stop.id] = marker;
			}
		});
	}

	function mapClickHandler(e) {
		console.log('mapClickHandler');
	}

	function stopClickHandler(e) {
		$stack = [
			{
				activity: 'stopPreselect',
				stopId: e.target.stopId
			}
		];
	}

	function stopInfoClickHandler(e) {
		$stack.push({
			activity: 'stopInfo',
			stopId: $selectedStopId
		});
		$stack = $stack;
		fetchSpiderMap($selectedStopId);
	}

	function navigationFromStopHandler(e) {
		// $stack = [
		// 	{
		// 		activity: 'stopInfo',
		// 		stopId: e.target.stopId
		// 	}
		// ];
	}

	async function openRouteStops(e) {
		const routeId = e.detail.routeId;
		$stack.push({
			activity: 'routeStops',
			routeId: routeId,
			stopId: $selectedStopId
		});
		$stack = $stack;
		// TODO el.scrollIntoView(true); the current stop
	}

	async function openRouteSchedule(e) {
		const routeId = e.detail.routeId;
		$stack.push({
			activity: 'routeSchedule',
			routeId: routeId,
			stopId: $selectedStopId
		});
		$stack = $stack;
		// TODO scrollIntoView(true); the current stop
	}

	async function openRouteInfo(e) {
		const routeId = e.detail.routeId;
		$stack.push({
			activity: 'routeInfo',
			routeId: routeId,
			stopId: $selectedStopId
		});
		$stack = $stack;
	}

	function showHelpHandler(e) {
		console.log('showHelpHandler');
		showHelp = true;
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

	function goBack() {
		$stack.pop();
		$stack = $stack;
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

		// if (newZoomLevel >= 12 || (newZoomLevel >= 10 && touchOriented)) {
		// 	mapLayers.legend.remove();
		// } else {
		// 	mapLayers.legend.addTo(map);
		// }
	}

	export function reset() {
		// selectedDay.set(new Date().toISOString().split('T')[0]);
		// selectedOperatorId.set(undefined);
		selectedRouteId.set(undefined);
		selectedSubrouteId.set(undefined);
	}

	function drawSpiderMap(spiderMap) {
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
					// TODO
					// selectStop(stop.id);
				});
				marker.addTo(mapLayers.subrouteLayer);
			}
		}
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
		map.on('click', mapClickHandler);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			subdomains: ['a', 'b'],
			attribution: '© OpenStreetMap e contribuidores'
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

		map.attributionControl.setPrefix(false);

		mapLayers.municipalities.addTo(map);
	});
</script>

<svelte:head>
	<title>Intermodal - Rede de transportes</title>
	<meta name="description" content="Rede de transportes disponíveis na AML" />
</svelte:head>

<div class="inset-0 fixed flex flex-col">
	<div id="map" class="w-full grow" />

	{#if $lastInStack}
		{#if $lastInStack.activity === 'stopPreselect'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 bg-base-100 lg:rounded-tl-2xl z-[10000] overflow-hidden shadow-xl w-full lg:w-[28rem] flex flex-col"
			>
				<WHeader backBtn="true" on:back={() => ($stack = [])}>
					{$selectedStop && sensibleLengthStopName($selectedStop)}
				</WHeader>
				<div class="overflow-y-scroll w-full">
					<div class="p-4 flex flex-col">
						<span class="text-2xl text-center">Eu quero...</span>
						<div class="flex flex-wrap justify-evenly ml-2 sm:gap-4">
							<span
								class="text-primary btn-ghost cursor-pointer rounded-l-lg sm:rounded-lg modal-button flex flex-col grow items-center shrink-0"
								on:click={navigationFromStopHandler}
								on:keypress={navigationFromStopHandler}
							>
								<img src="/icons/path2.svg" alt="Caminho" class="h-24" />
								<span class="text-lg">Obter direções</span>
							</span>
							<span
								class="text-primary btn-ghost cursor-pointer  rounded-r-lg sm:rounded-lg  modal-button flex flex-col grow items-center shrink-0"
								on:click={stopInfoClickHandler}
								on:keypress={stopInfoClickHandler}
							>
								<img src="/icons/stop-info.svg" alt="Informação" class="h-24" />
								<span class="text-lg">Consultar paragem</span>
							</span>
							<span
								class="text-primary btn-ghost cursor-pointer  rounded-r-lg sm:rounded-lg  modal-button flex flex-col grow items-center shrink-0"
								on:click={showHelpHandler}
								on:keypress={showHelpHandler}
							>
								<img src="/icons/help.svg" alt="Ajuda" class="h-24" />
								<span class="text-lg">Ajuda</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		{:else if $lastInStack.activity === 'stopInfo'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-4/5 bg-base-100 lg:rounded-tl-2xl z-[10000] overflow-hidden shadow-xl w-full lg:w-[28rem] flex flex-col"
			>
				<StopInfo
					stop={selectedStop}
					spider={currentSpider}
					{routes}
					pictures={selectedStopPictures}
					on:openroute={openRouteStops}
					on:openschedule={openRouteSchedule}
					on:openinfo={openRouteInfo}
					on:hint={hintRoute}
					on:drophint={dropRouteHint}
					on:back={goBack}
				/>
			</div>
		{:else if $lastInStack.activity === 'stopInfo'}
			TODO
		{:else if $lastInStack.activity === 'routeSchedule'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-3/5 bg-base-100 lg:rounded-tl-2xl z-[10000] shadow-xl w-full lg:w-[28rem] carousel"
			>
				<div id="schedule" class="carousel-item flex flex-col w-full">
					<WHeader
						backBtn="true"
						on:back={goBack}
						fg={$selectedRoute?.badge_text}
						bg={$selectedRoute?.badge_bg}>{$selectedRoute?.code}: {$selectedRoute?.name}</WHeader
					>
					<CompactSchedule {selectedRoute} />
				</div>
			</div>
		{:else if $lastInStack.activity === 'routeStops'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-3/5 bg-base-100 lg:rounded-tl-2xl z-[10000] shadow-xl w-full lg:w-[28rem] carousel"
			>
				<div id="stops" class="carousel-item flex flex-col gap-1 w-full">
					<WHeader
						backBtn="true"
						on:back={goBack}
						fg={$selectedRoute?.badge_text}
						bg={$selectedRoute?.badge_bg}>{$selectedRoute?.code}: {$selectedRoute?.name}</WHeader
					>
					<select class="select select-primary w-full mx-auto" bind:value={$selectedSubrouteId}>
						{#each $selectedRoute?.subroutes || [] as subroute}
							<option value={subroute.id}>{subroute.flag}</option>
						{/each}
					</select>
					<div class="ml-2 lg:ml-4">
						{#if $subrouteStops}
							<RouteStops subrouteStops={$subrouteStops} />
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
	{JSON.stringify($lastInStack)}
</div>

{#if showHelp}
	<div style="background-color: #33336699" class="z-[2000] absolute inset-0" />
	<div
		class="fixed inset-x-0 m-auto w-full md:w-full max-w-[970px] z-[2001]"
		style="max-height: calc(100vh - 120px);"
	>
		<div class="mx-2 p-4 bg-base-100 flex flex-col gap-4 rounded-2xl shadow-xl  max-h-full">
			<span class="text-xl">Como utilizar o visualizador</span>
			<span>Aqui estarão instruções, um dia</span>
			<div class="max-h-96 overflow-y-auto" />
			<input
				type="button"
				value="Compreendi"
				class="btn btn-primary rounded-full"
				on:click={() => (showHelp = false)}
				on:keypress={() => (showHelp = false)}
			/>
		</div>
	</div>
{/if}

<style>
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet.markercluster/dist/MarkerCluster.css';
	@import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
</style>
