<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2025  Cláudio Pereira

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
	import { liveQuery } from 'dexie';
	import { apiServer, tileStyle } from '$lib/settings';
	import { operators } from '$lib/stores';
	import { stopScore, stopScoreClass, longStopName } from '$lib/utils';
	import StopAttrs from '$lib/components/StopAttrs.svelte';
	import { getLocalRoutes, getLocalStops } from '$lib/db';

	let { data } = $props();
	let { stop, pictures, spider } = data;

	const stops = liveQuery(() => getLocalStops());
	const routes = liveQuery(() => getLocalRoutes());

	const score = stopScore(stop);

	const accessibleRoutes = derived(routes, ($routes) => {
		if (!$routes) return null;

		return Object.keys(spider.routes)
			.map((routeId) => {
				return $routes[routeId];
			})
			.filter((r) => r)
			.sort((ra, rb) => {
				if (!ra.code) {
					return -1;
				} else if (!rb.code) {
					return 1;
				} else {
					return (parseInt(ra.code) || 10000) - (parseInt(rb.code) || 10000);
				}
			});
	});

	let map: maplibre.Map;
	let mapEl: HTMLDivElement;
	let mapLoaded = false;

	stops.subscribe(() => {
		addStopDataToMap();
	});

	function addStopDataToMap() {
		if (!mapLoaded || !$stops) {
			return;
		}

		map.getSource('stops').setData({
			type: 'FeatureCollection',
			features: Object.values($stops).map((stop) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [stop.lon, stop.lat]
				},
				properties: {}
			}))
		});

		map.getSource('current-stop').setData({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [stop.lon, stop.lat]
					},
					properties: {}
				}
			]
		});
	}

	function addSpiderDataToMap() {
		if (!spider || !mapLoaded) {
			return;
		}
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

		map.getSource('connected-stops').setData({
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
				}
			}))
		});
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
				'circle-color': 'rgb(40, 100, 150)',
				'circle-radius': {
					stops: [
						[12, 0],
						[14, 5]
					]
				}
			}
		});
		// ################################
		// Highlight stops over the regular stops
		map.addSource('connected-stops', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'connected-stops',
			type: 'circle',
			source: 'connected-stops',
			paint: {
				'circle-color': 'rgb(50, 150, 220)',
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
		// ################################
		// Highlight stops over the regular stops
		map.addSource('current-stop', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		map.addLayer({
			id: 'current-stop',
			type: 'circle',
			source: 'current-stop',
			paint: {
				'circle-color': '#ff0000',
				'circle-radius': {
					stops: [
						[14, 10],
						[16, 15],
						[20, 20]
					]
				},
				'circle-stroke-width': 2,
				'circle-stroke-color': '#fff'
			}
		});
	}

	onMount(() => {
		map = new maplibre.Map({
			container: mapEl,
			style: tileStyle,
			center: [stop.lon, stop.lat],
			zoom: 17,
			minZoom: 8,
			maxZoom: 20
		});

		map.addControl(new maplibre.NavigationControl(), 'top-right');

		map.on('load', function () {
			addSourcesAndLayers();

			mapLoaded = true;
			addStopDataToMap();
			addSpiderDataToMap();
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map?.remove();
	});
</script>

<div class="flex flex-col w-full gap-4 my-2 px-2">
	<div class="card w-full bg-base-100 shadow-md">
		<figure>
			{#if pictures?.length}
				<div
					class="bg-cover bg-no-repeat bg-center transition-all hover:scale-110 h-32 lg:h-40 w-full"
					style="background-image: url('{pictures[0].url_medium}')"
				/>
			{:else}
				<!-- TODO put some placeholder here-->
				<!-- <img src="/icons/picture.svg" alt="Imagem da paragem" /> -->
			{/if}
		</figure>
		<div class="card-body">
			<h2 class="card-title text-3xl">
				{longStopName(stop)}
				<span class="stopScore p-1 rounded-full border-2 {stopScoreClass(score)}">{score}</span>
			</h2>
			<StopAttrs {stop} showSecondary={false} />
			<table class="table table-zebra table-compact w-full">
				<thead>
					<tr>
						<th>Linhas</th>
					</tr>
				</thead>
				<tbody>
					{#each $accessibleRoutes || [] as route}
						<tr class="cursor-pointer hover">
							<th>
								{#if route.code}
									<span
										class="line-number"
										style="background-color: {route.badge_bg}; color: {route.badge_text}; border: 2px solid {route.badge_text};"
									>
										{route.code}
									</span>
								{/if}
							</th>
							<td class="w-full">{route.name}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<StopAttrs {stop} showPrimary={false} />
		</div>
	</div>
	<div class="card card-sm w-full bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Fotografias</h2>
			{#if pictures?.length}
				<div class="grid grid-cols-2">
					{#each pictures as picture}
						{#if !picture.tagged}
							<div class="p-1 flex justify-center items-center cursor-pointer">
								<button
									onclick={() => {
										// openPic(picture.id);
									}}
								>
									<img
										src="https://intermodal-storage-worker.claudioap.workers.dev/medium/{picture.sha1}/preview"
										class="rounded-lg transition-all hover:scale-105"
										alt="Fotografia da paragem"
									/>
								</button>
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				Esta paragem não tem fotografias.
			{/if}
		</div>
	</div>
	<div class="card card-sm w-full bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Localização</h2>
			<div id="stop-map" class="w-full" />
			<div bind:this={mapEl} class="" style="height: max(60vh, 20rem)" />
			<div class="flex flex-wrap gap-2">
				<label class="input-group overflow-auto">
					{#if stop.street}
						<span>Endereço</span>
						<span class="bg-base-200"
							>{stop.street}{#if stop.door}, {stop.door}{/if}</span
						>
					{/if}
					<span>Localidade</span>
					<input disabled type="text" value={stop.locality} class="input input-bordered" />
				</label>
				<label class="input-group overflow-auto">
					<span>Coordenadas</span>
					<span class="p-2">{stop.lat}</span>
					<span class="p-2">{stop.lon}</span>
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.line-number {
		padding: 0.2em 10px;
		border-radius: 1em;
		font-weight: 900;
		font-size: 1.2rem;
		display: inline-block;
	}
</style>
