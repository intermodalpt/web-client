<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2024  Cláudio Pereira

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
	import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import polyline from '@mapbox/polyline';
	import { liveQuery } from 'dexie';
	import { apiServer, tileStyle } from '$lib/settings.js';
	import { operators } from '$lib/stores.js';
	import { stopScore, stopScoreClass, longStopName } from '$lib/utils.js';
	import {
		fetchRoutes,
		getRoutes,
		fetchStops,
		getStops,
		loadMissing,
		stopsLoaded,
		routesLoaded
	} from '$lib/db';

	/** @type {import('./$types').PageData} */
	export let data;

	const stopId = data.stopId;
	const stop = data.stop;

	const stops = liveQuery(() => getStops());
	const routes = liveQuery(() => getRoutes());
	const pictures = writable(null);
	const spider = writable(null);

	const score = stopScore(stop);

	const accessibleRoutes = derived([routes, spider], ([$routes, $spider]) => {
		if (!$routesLoaded || !$spider) return null;

		console.log($routes);

		return Object.keys($spider.routes)
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

	let map;
	let mapEl;
	let mapLoaded = false;

	async function loadData() {
		await Promise.all([
			fetchStops(),
			fetchRoutes(),
			fetch(`${apiServer}/v1/stops/${stopId}/pictures`)
				.then((r) => r.json())
				.then((data) => {
					pictures.set(data);
				}),
			fetch(`${apiServer}/v1/stops/${stopId}/spider`)
				.then((r) => r.json())
				.then((data) => {
					spider.set(data);
				})
		]);
	}
	loadData().then(async () => {
		console.log('data loaded');
		await loadMissing();
	});

	stops.subscribe(() => {
		addStopDataToMap();
	});

	spider.subscribe(() => {
		addSpiderDataToMap();
	});

	function addStopDataToMap() {
		if (!mapLoaded) {
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
		if (!$spider || !mapLoaded) {
			return;
		}
		let stops = $spider.stops;
		const features = Object.values($spider.subroutes).map((subroute) => {
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
		map = new Maplibre({
			container: mapEl,
			style: tileStyle,
			center: [stop.lon, stop.lat],
			zoom: 17,
			minZoom: 8,
			maxZoom: 20
		});

		map.addControl(new NavigationControl(), 'top-right');

		map.on('load', function () {
			addSourcesAndLayers();

			mapLoaded = true;
			addStopDataToMap();
			addSpiderDataToMap();
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map.remove();
	});
</script>

<div class="flex flex-col w-full gap-4 my-2 px-2">
	<div class="card w-full bg-base-100 shadow-md">
		<figure>
			{#if $pictures?.length}
				<div
					class="bg-cover bg-no-repeat bg-center transition-all hover:scale-110 h-32 lg:h-40 w-full"
					style="background-image: url('{$pictures[0].url_medium}')"
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
			<div class="flex flex-wrap gap-1 pl-2 pr-2 sm:pl-4 sm:pr-3 z-[10000]">
				{#if stop.has_crossing === true}
					<div class="tooltip" data-tip="Com atravessamento de via">
						<img class="h-12" src="/stopattrs/crossing.svg" alt="Atravessamento de via" />
					</div>
				{/if}
				{#if stop.has_accessibility === true}
					<div class="tooltip" data-tip="Adequada a mobilidade reduzida">
						<img class="h-12" src="/stopattrs/accessible.svg" alt="Mobilidade reduzida" />
					</div>
				{/if}
				{#if stop.is_illumination_working === false}
					<div class="tooltip" data-tip="Falta de iluminação">
						<img class="h-12" src="/stopattrs/light-none.svg" alt="Falta de iluminação" />
					</div>
				{:else if stop.is_illumination_working === true}
					{#if stop.illumination_strength || 0 > 3}
						<div class="tooltip" data-tip="Boa iluminação">
							<img class="h-12" src="/stopattrs/light-full.svg" alt="Boa iluminação" />
						</div>
					{:else if stop.illumination_strength || 0 > 0}
						<div class="tooltip" data-tip="Falta de iluminação">
							<img class="h-12" src="/stopattrs/light-half.svg" alt="Falta de iluminação" />
						</div>
					{/if}
				{/if}
				{#if stop.has_abusive_parking === true}
					<div class="tooltip" data-tip="Estacionamento abusivo">
						<img class="h-12" src="/stopattrs/abusive-parking.svg" alt="Estacionamento abusivo" />
					</div>
				{/if}
				{#if stop.has_accessibility === false}
					<div class="tooltip" data-tip="Inadequada a mobilidade reduzida">
						<img
							class="h-12"
							src="/stopattrs/accessible-not.svg"
							alt="Inadequada a mobilidade reduzida"
						/>
					</div>
				{/if}
				{#if stop.is_damaged === true}
					<div class="tooltip" data-tip="Danificada">
						<img class="h-12" src="/stopattrs/damaged.svg" alt="Danificada" />
					</div>
				{/if}
				{#if stop.has_flag === false || (stop.has_flag !== true && stop.has_outdated_info === true)}
					<div class="tooltip" data-tip="Sem identificação">
						<img class="h-12" src="/stopattrs/flag-not.svg" alt="Sem identificação" />
					</div>
				{/if}
				{#if stop.has_schedules === false || (stop.has_schedules !== true && stop.has_outdated_info === true)}
					<div class="tooltip" data-tip="Sem horários atualizados">
						<img class="h-12" src="/stopattrs/schedules-not.svg" alt="Sem horários atualizados" />
					</div>
				{/if}
				{#if stop.has_sidewalk === false}
					<div class="tooltip" data-tip="Sem passeio">
						<img class="h-12" src="/stopattrs/sidewalk-not.svg" alt="Sem passeio" />
					</div>
				{/if}
				{#if stop.has_shelter === false}
					<div class="tooltip" data-tip="Sem abrigo">
						<img class="h-12" src="/stopattrs/shelter-not.svg" alt="Sem abrigo" />
					</div>
				{/if}
				{#if stop.has_bench === false}
					<div class="tooltip" data-tip="Sem banco">
						<img class="h-12" src="/stopattrs/bench-not.svg" alt="Sem banco" />
					</div>
				{/if}
				{#if stop.has_trash_can === false}
					<div class="tooltip" data-tip="Sem balde do lixo">
						<img class="h-12" src="/stopattrs/garbage-not.svg" alt="Sem balde do lixo" />
					</div>
				{/if}
				{#if stop.has_visibility_from_area === false}
					<div class="tooltip" data-tip="Sem visibilidade">
						<img class="h-12" src="/stopattrs/visibility-not.svg" alt="Sem visibilidade" />
					</div>
				{/if}
				{#if stop.has_visibility_from_within === false}
					<div class="tooltip" data-tip="Sem visibilidade exterior">
						<img
							class="h-12"
							src="/stopattrs/visibility-within-not.svg"
							alt="Sem visibilidade exterior"
						/>
					</div>
				{/if}
				{#if stop.is_visible_from_outside === false}
					<div class="tooltip" data-tip="Difícil visibilidade para o motorista">
						<img
							class="h-12"
							src="/stopattrs/visible-not.svg"
							alt="Difícil visibilidade para o motorista"
						/>
					</div>
				{/if}
			</div>
			<table class="table table-zebra table-compact w-full">
				<thead>
					<tr>
						<th>Linhas</th>
					</tr>
				</thead>
				<tbody>
					{#each $accessibleRoutes || [] as route}
						<tr class="cursor-pointer hover">
							<a href="/servicos/{operators[route.operator]?.tag}/{route.id}/informacao">
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
							</a>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex flex-wrap gap-1">
				{#if stop.has_flag === true}
					<div class="tooltip z-[10000]" data-tip="Identificada">
						<img class="h-12" src="/stopattrs/flag.svg" alt="Identificada" />
					</div>
				{/if}
				{#if stop.has_schedules === true}
					<div class="tooltip z-[10000]" data-tip="Horários">
						<img class="h-12" src="/stopattrs/schedules.svg" alt="Horários" />
					</div>
				{/if}
				{#if stop.has_sidewalk === true}
					<div class="tooltip z-[10000]" data-tip="Passeio">
						<img class="h-12" src="/stopattrs/sidewalk.svg" alt="Passeio" />
					</div>
				{/if}
				{#if stop.has_shelter === true}
					<div class="tooltip z-[10000]" data-tip="Abrigo">
						<img class="h-12" src="/stopattrs/shelter.svg" alt="Abrigo" />
					</div>
				{/if}
				{#if stop.has_bench === true}
					<div class="tooltip z-[10000]" data-tip="Banco">
						<img class="h-12" src="/stopattrs/bench.svg" alt="Banco" />
					</div>
				{/if}
				{#if stop.has_trash_can === true}
					<div class="tooltip z-[10000]" data-tip="Balde do Lixo">
						<img class="h-12" src="/stopattrs/garbage.svg" alt="Balde do Lixo" />
					</div>
				{/if}
				{#if stop.has_visibility_from_area === true}
					<div class="tooltip z-[10000]" data-tip="Visibilidade">
						<img class="h-12" src="/stopattrs/visibility.svg" alt="Visibilidade" />
					</div>
				{/if}
				{#if stop.has_visibility_from_within === true}
					<div class="tooltip z-[10000]" data-tip="Visibilidade exterior">
						<img class="h-12" src="/stopattrs/visibility-within.svg" alt="Visibilidade exterior" />
					</div>
				{/if}
				{#if stop.is_visible_from_outside === true}
					<div class="tooltip z-[10000]" data-tip="Facilmente visível pelo motorista">
						<img
							class="h-12"
							src="/stopattrs/visible.svg"
							alt="Facilmente visível pelo motorista"
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="card card-compact w-full bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Fotografias</h2>
			{#if $pictures?.length}
				<div class="grid grid-cols-2">
					{#each $pictures as picture}
						{#if !picture.tagged}
							<div class="p-1 flex justify-center items-center cursor-pointer">
								<a
									href="https://intermodal-storage-worker.claudioap.workers.dev/medium/{picture.sha1}/preview"
								>
									<img
										src="https://intermodal-storage-worker.claudioap.workers.dev/medium/{picture.sha1}/preview"
										class="rounded-lg transition-all hover:scale-105"
										on:click={() => {
											openPic(picture.id);
										}}
										alt="Fotografia da paragem"
									/>
								</a>
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				Esta paragem não tem fotografias.
			{/if}
		</div>
	</div>
	<div class="card card-compact w-full bg-base-100 shadow-md">
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
