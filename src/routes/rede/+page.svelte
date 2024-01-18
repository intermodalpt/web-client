<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2024 Cláudio Pereira

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
	import { onMount, onDestroy } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { browser } from '$app/environment';
	import { Map as Maplibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import polyline from '@mapbox/polyline';
	import { liveQuery } from 'dexie';
	import { apiServer, tileStyle } from '$lib/settings.js';
	import { fetchRoutes, getRoutes, fetchStops, getStops, loadMissing } from '$lib/db';
	import WHeader from '$lib/components/map/WidgetHeader.svelte';
	import CompactSchedule from '$lib/components/map/CompactSchedule.svelte';
	import StopInfo from '$lib/components/map/StopInfo.svelte';
	import RouteInfo from '$lib/components/map/RouteInfo.svelte';
	import RouteStops from '$lib/components/RouteStops.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let map;
	let mapEl;
	const touchOriented = browser ? window.matchMedia('(pointer: coarse)').matches : false;

	let mapLoaded = false;
	let stopsLoaded = false;
	let routesLoaded = false;
	$: loading = !mapLoaded || !stopsLoaded || !routesLoaded;

	let stops = liveQuery(() => getStops());
	let routes = liveQuery(() => getRoutes());

	async function loadData() {
		await Promise.all([
			fetchStops().then((r) => {
				stopsLoaded = true;
				return r;
			}),
			fetchRoutes().then((r) => {
				routesLoaded = true;
				return r;
			})
		]);
	}
	loadData().then(async () => {
		console.log('data loaded');
		await loadMissing();
	});

	const stack = writable([]);
	const lastInStack = derived(stack, ($stack) => $stack[$stack.length - 1]);
	stack.subscribe((stack) => {
		console.log('stack', stack);
	});
	lastInStack.subscribe((lastInStack) => {
		console.log('lastInStack', lastInStack);
	});

	const selectedRouteId = derived([lastInStack], ([$lastInStack]) => {
		return $lastInStack?.routeId;
	});
	const selectedStopId = derived([lastInStack], ([$lastInStack]) => {
		return $lastInStack?.stopId;
	});
	const selectedStop = derived([selectedStopId], ([$selectedStopId]) => {
		if (!$selectedStopId) {
			return;
		}
		return $stops[$selectedStopId];
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
		$selectedSubrouteId = $routes[$selectedRouteId].subroutes[0]?.id;
		return $routes[$selectedRouteId];
	});

	const selectedRouteStops = derived([selectedRouteId], ([$selectedRouteId], set) => {
		if ($selectedRouteId) {
			fetch(`${apiServer}/v1/routes/${$selectedRouteId}/stops`)
				.then((r) => r.json())
				.then((data) => {
					const stopsBySubroute = Object.fromEntries(
						data.map((subrouteStops) => {
							return [subrouteStops.subroute, subrouteStops.stops.map((stopId) => $stops[stopId])];
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

	selectedStopId.subscribe(($selectedStopId) => {
		if (!mapLoaded) {
			return;
		}
		if (!$selectedStopId) {
			map.getSource('highlighted-stops').setData({
				type: 'FeatureCollection',
				features: []
			});
			return;
		}
		console.log('selectedStopId', $selectedStopId);

		let selectedStop = $stops[$selectedStopId];
		map.getSource('highlighted-stops').setData({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [selectedStop.lon, selectedStop.lat]
					},
					id: $selectedStopId
				}
			]
		});
	});
	let stopDetailed = derived([selectedStopId], async ([$selectedStopId], set) => {
		console.log('stopSpider', $selectedStopId);
		if (!$selectedStopId) return;
		fetch(`${apiServer}/v1/stops/${$selectedStopId}`)
			.then((x) => x.json())
			.then((stop) => {
				console.log('fetched stop', stop);
				set(stop);
			});
	});

	let stopSpider = derived([selectedStopId], async ([$selectedStopId], set) => {
		console.log('stopSpider', $selectedStopId);
		if (!$selectedStopId) return;
		fetch(`${apiServer}/v1/stops/${$selectedStopId}/spider`)
			.then((x) => x.json())
			.then((spider) => {
				console.log('fetched spider', spider);
				set(spider);
			});
	});

	stopSpider.subscribe((spider) => {
		console.log('stopSpider.subscribe', spider);
		if (!spider) return;

		const selectedRoutes = Object.keys(spider.routes).map((id) => {
			return $routes[id];
		});
		drawSpiderMap(spider);
	});

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
		}
	});

	stops.subscribe(($stops) => {
		if (!mapLoaded || !$stops) return;
		updateData();
	});

	function updateData() {
		if (!mapLoaded || !$stops) return;
		drawStops($stops);
	}

	function drawStops(stops) {
		console.log('drawStops');
		map.getSource('stops').setData({
			type: 'FeatureCollection',
			features: Object.values(stops).map((stop) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [stop.lon, stop.lat]
				},
				properties: {
					id: stop.id,
					name: stop.name
				},
				id: stop.id
			}))
		});
	}

	function drawSubroutes(subroutes, stopSequences) {
		const features = subroutes.map((subroute) => {
			let coords = [];
			if (subroute.polyline && subroute.polyline.length > 0) {
				coords = polyline.decode(subroute.polyline, 6).map((p) => p.reverse());
			} else {
				coords =
					stopSequences[subroute.id]?.map((stopId) => [$stops[stopId].lon, $stops[stopId].lat]) ||
					[];
			}

			return {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: coords
				},
				properties: {}
			};
		});

		map.getSource('subroutes').setData({
			type: 'FeatureCollection',
			features: features
		});
	}

	function drawSpiderMap(spider) {
		let stops = spider.stops;

		const features = Object.values(spider.subroutes).map((subroute) => {
			return {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: subroute.stop_sequence.map((stopId) => [
						stops[stopId].lon,
						stops[stopId].lat
					])
				},
				properties: {}
			};
		});
		map.getSource('spider-segments').setData({
			type: 'FeatureCollection',
			features: features
		});
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
		// const routeId = e.detail.routeId;
		// $stack.push({
		// 	activity: 'routeInfo',
		// 	routeId: routeId,
		// 	stopId: $selectedStopId
		// });
		// $stack = $stack;
	}

	function hintRoute(e) {
		let routeId = e.detail.routeId;
		console.log(e.detail);
		if (routeId) {
			const subroutes = $routes[routeId].subroutes;
			const subrouteStopSequences = Object.fromEntries(
				Object.entries($stopSpider?.subroutes)
					.filter(([id, subroute]) => subroute.route === routeId)
					.map(([id, sr]) => [id, sr.stop_sequence]) || []
			);
			drawSubroutes(subroutes, subrouteStopSequences);
		} else {
			drawSubroutes([]);
		}
	}

	function dropRouteHint(e) {
		drawSubroutes([]);
	}

	function goBack() {
		$stack.pop();
		$stack = $stack;
	}

	function reset() {
		// selectedDay.set(new Date().toISOString().split('T')[0]);
		// selectedOperatorId.set(undefined);
		selectedRouteId.set(undefined);
		selectedSubrouteId.set(undefined);
	}

	function addSourcesAndLayers() {
		// Display the spider map of a stop
		map.addSource('spider-segments', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'spider-segments-outline',
			type: 'line',
			source: 'spider-segments',
			paint: {
				'line-color': 'rgb(0, 0, 0)',
				'line-width': 6,
				'line-opacity': 1
			}
		});
		map.addLayer({
			id: 'spider-segments',
			type: 'line',
			source: 'spider-segments',
			paint: {
				'line-color': 'rgb(255, 255, 255)',
				'line-width': 4,
				'line-opacity': 1
			}
		});
		// ################################
		// Display a set of subroutes
		map.addSource('subroutes', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'subroutes-outline',
			type: 'line',
			source: 'subroutes',
			paint: {
				'line-color': 'rgb(50, 150, 220)',
				'line-width': 8,
				'line-opacity': 1
			}
		});
		map.addLayer({
			id: 'subroutes-segments',
			type: 'line',
			source: 'subroutes',
			paint: {
				'line-color': 'rgb(255, 255, 255)',
				'line-width': 6,
				'line-opacity': 1
			}
		});
		// ################################
		// Display every stop
		map.addSource('stops', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'stops',
			type: 'circle',
			source: 'stops',
			paint: {
				'circle-color': 'rgb(50, 150, 220)',
				'circle-radius': {
					stops: [
						[12, 1.5],
						[14, 3],
						[16, 11],
						[17, 20],
						[20, 25]
					]
				},
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
		});
		// ################################
		// Highlight stops over the regular stops
		map.addSource('highlighted-stops', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'highlighted-stops',
			type: 'circle',
			source: 'highlighted-stops',
			paint: {
				'circle-color': 'rgb(255, 0, 0)',
				'circle-radius': {
					stops: [
						[12, 5],
						[14, 6],
						[16, 11],
						[17, 20],
						[20, 25]
					]
				},
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
		});
	}

	function addEvents() {
		map.on('click', 'stops', (e) => {
			$stack = [
				{
					activity: 'stopInfo',
					stopId: e.features[0].properties.id
				}
			];
		});
	}

	onMount(() => {
		map = new Maplibre({
			container: mapEl,
			style: tileStyle,
			center: [-9.0, 38.65],
			zoom: 10,
			minZoom: 8,
			maxZoom: 20
			// TODO bound to whatever the current region is
			// maxBounds: [
			// 	[-10.0, 38.3],
			// 	[-8.0, 39.35]
			// ]
		});

		map.addControl(new NavigationControl(), 'bottom-right');
		map.addControl(new GeolocateControl(), 'bottom-right');

		map.on('load', function () {
			addSourcesAndLayers();
			addEvents();

			mapLoaded = true;
			updateData();
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map.remove();
	});
</script>

<svelte:head>
	<title>Intermodal - Rede de transportes</title>
	<meta name="description" content="Rede de transportes" />
</svelte:head>

{#if loading}
	<div style="background-color: #33336699" class="z-[2000] absolute inset-0 backdrop-blur-sm" />
	<div class="absolute inset-x-0 m-auto w-full md:w-96 w z-[2001] top-32">
		<div class="m-2 p-4 bg-base-100 flex flex-col gap-4 rounded-2xl shadow-lg max-h-full">
			<span class="text-center -mt-2 -mb-1">A carregar...</span>
			<span
				>Paragens: <progress
					class="progress progress-primary w-full"
					value={stopsLoaded ? 100 : 0}
					max="100"
				/></span
			>
			<span
				>Linhas: <progress
					class="progress progress-primary w-full"
					value={routesLoaded ? 100 : 0}
					max="100"
				/></span
			>
			<span
				>Mapa: <progress
					class="progress progress-primary w-full"
					value={mapLoaded ? 100 : 0}
					max="100"
				/></span
			>
		</div>
	</div>
{/if}

<div bind:this={mapEl} class="relative h-full">
	{#if $lastInStack}
		{#if $lastInStack.activity === 'stopInfo'}
			<div
				class="absolute bottom-0 right-0 h-1/2 lg:h-4/5 lg:rounded-tl-xl shadow-lg w-full lg:w-[28rem] bg-base-100 z-10 overflow-hidden border"
				style="max-height: 50em;"
			>
				<StopInfo
					stop={$stopDetailed}
					spider={$stopSpider}
					routes={$routes}
					pictures={selectedStopPictures}
					on:openroute={openRouteStops}
					on:openschedule={openRouteSchedule}
					on:openinfo={openRouteInfo}
					on:hint={hintRoute}
					on:drophint={dropRouteHint}
					on:back={goBack}
				/>
			</div>
		{:else if $lastInStack.activity === 'routeInfo'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-auto bg-base-100 lg:rounded-tl-2xl z-[10000] overflow-hidden shadow-xl w-full lg:w-[28rem]"
			>
				<RouteInfo
					route={selectedRoute}
					on:openroute={openRouteStops}
					on:openschedule={openRouteSchedule}
					on:openinfo={openRouteInfo}
					on:back={goBack}
				/>
			</div>
		{:else if $lastInStack.activity === 'routeSchedule'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-auto bg-base-100 lg:rounded-tl-2xl z-[10000] shadow-xl w-full lg:w-[28rem]"
			>
				<div id="schedule" class="flex flex-col w-full">
					<WHeader
						backBtn="true"
						on:back={goBack}
						fg={$selectedRoute?.badge_text}
						bg={$selectedRoute?.badge_bg}
						>{$selectedRoute?.code}: {$selectedRoute?.name}
					</WHeader>
					<CompactSchedule {selectedRoute} />
				</div>
			</div>
		{:else if $lastInStack.activity === 'routeStops'}
			<div
				class="lg:fixed lg:right-0 lg:bottom-0 h-2/5 lg:h-4/5 bg-base-100 lg:rounded-tl-2xl z-[10000] overflow-hidden shadow-xl w-full lg:w-[28rem] flex flex-col"
			>
				<WHeader
					backBtn="true"
					on:back={goBack}
					fg={$selectedRoute?.badge_text}
					bg={$selectedRoute?.badge_bg}>{$selectedRoute?.code}: {$selectedRoute?.name}</WHeader
				>
				<div class="overflow-y-scroll overflow-x-hidden">
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
</div>
