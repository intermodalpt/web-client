<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2025 Cláudio Pereira

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
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import polyline from '@mapbox/polyline';
	import { tileStyle } from '$lib/settings';
	import RouteBreadcrumbs from '../RouteBreadcrumbs.svelte';
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteMenu from '../RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';

	const { data } = $props();
	const { region, operator, route, routeStops, stops } = data;

	let map: maplibre.Map;
	let mapEl: HTMLDivElement;

	let mapLoaded = false;

	const selectedSubrouteId = writable(route.subroutes[0]?.id);
	const selectedSubrouteData = derived([selectedSubrouteId], ([$selectedSubrouteId]) => {
		if (!$selectedSubrouteId) {
			return null;
		}

		if (!route.subroutes) {
			return null;
		}
		let subroute = route.subroutes.find((sr) => sr.id === $selectedSubrouteId);

		return [subroute, routeStops ? routeStops[$selectedSubrouteId] : []];
	});

	selectedSubrouteData.subscribe(() => {
		updateData();
	});

	function updateData() {
		if (!mapLoaded || !$selectedSubrouteData) {
			return;
		}

		const [subroute, stopSequence] = $selectedSubrouteData;

		let coords = [];
		if (subroute.polyline && subroute.polyline.length > 0) {
			coords = polyline.decode(subroute.polyline, 6).map((p) => p.reverse());
		} else {
			coords = stopSequence.map((stop) => [stop.lon, stop.lat]);
		}

		map.getSource('highlighted-stops').setData({
			type: 'FeatureCollection',
			features: stopSequence.map((stop) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [stop.lon, stop.lat]
				},
				properties: {
					id: stop.id,
					name: stop.name
				}
			}))
		});

		map.getSource('subroutes').setData({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: coords
					},
					properties: {}
				}
			]
		});

		let bounds = new map.LngLatBounds(coords);
		coords.forEach((coord) => {
			bounds.extend(coord);
		});
		map.fitBounds(bounds, { padding: 20 });
	}

	function drawStops() {
		map.getSource('stops').setData({
			type: 'FeatureCollection',
			features: Object.values(stops).map((stop) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [stop.lon, stop.lat]
				},
				properties: {}
			}))
		});
	}

	function addSourcesAndLayers() {
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
				'line-width': 6,
				'line-opacity': 1
			}
		});
		map.addLayer({
			id: 'subroutes-segments',
			type: 'line',
			source: 'subroutes',
			paint: {
				'line-color': 'rgb(255, 255, 255)',
				'line-width': 4,
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
						[16, 4],
						[20, 5]
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
						[12, 3],
						[14, 4],
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

	onMount(() => {
		map = new maplibre.Map({
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

		map.addControl(new maplibre.NavigationControl(), 'top-right');
		map.addControl(new maplibre.GeolocateControl({}), 'top-right');

		map.on('load', function () {
			addSourcesAndLayers();

			mapLoaded = true;
			drawStops();
			updateData();
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map?.remove();
	});
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body -mt-6">
		<RouteBreadcrumbs {region} {operator} {route} />
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu {region} {operator} {route} />
			{#if $selectedSubrouteId}
				<h2 class="text-xl">Variante a consultar</h2>
				<select class="select select-primary select-sm w-full" bind:value={$selectedSubrouteId}>
					{#each route.subroutes as subroute}
						<option value={subroute.id}>{subroute.flag}</option>
					{/each}
				</select>
			{:else}
				<div class="alert alert-warning shadow-lg my-4">
					<div>
						<span>Serviço por definir</span>
					</div>
				</div>
			{/if}
			<div bind:this={mapEl} class="w-full" style="height: max(60vh, 20rem)"></div>
		</div>
	</div>
</div>
