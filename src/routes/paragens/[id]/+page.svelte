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
	import L from 'leaflet?client';
	import { bigStopIcon } from '$lib/assets.js';
	import { operators } from '$lib/stores.js';
	import { stopScore, stopScoreClass } from '$lib/utils.js';

	/** @type {import('./$types').PageData} */
	export let data;

	const stop = data.stop;
	const routes = data.routes;

	const score = stopScore(stop);

	function stopName() {
		return stop.name || stop.official_name || stop.osm_name;
	}

	onMount(() => {
		if (!stop.lat || !stop.lon) {
			return;
		}

		const map = L.map('stop-map', {
			maxBounds: new L.LatLngBounds(new L.LatLng(38.3, -10.0), new L.LatLng(39.35, -8.0)),
			maxBoundsViscosity: 1.0,
			minZoom: 10
		}).setView([stop.lat, stop.lon], 16);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			subdomains: ['a', 'b'],
			attribution: '© OpenStreetMap e contribuidores'
		}).addTo(map);

		let marker = L.marker([stop.lat, stop.lon], { icon: bigStopIcon });
		marker.addTo(map);

		L.control.scale().addTo(map);
	});
</script>

<div class="flex flex-col w-full gap-4 my-2 px-2">
	<div class="card w-full bg-base-100 shadow-md">
		<figure><img src="https://placeimg.com/1200/200/arch" alt="Imagem da paragem" /></figure>
		<div class="card-body">
			<h2 class="card-title text-3xl">
				{stopName()}
				<span class="stopScore p-1 rounded-full border-2 {stopScoreClass(score)}">{score}</span>
			</h2>
			<table class="table table-zebra table-compact w-full">
				<thead>
					<tr>
						<th>Linhas</th>
					</tr>
				</thead>
				<tbody>
					{#each routes as route}
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
		</div>
	</div>
	<div class="card card-compact w-full bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Fotografias</h2>
			<span>Esta paragem não tem fotografias</span>
		</div>
	</div>
	<div class="card card-compact w-full bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Localização</h2>
			<div id="stop-map" class="w-full" style="height: max(60vh, 20rem)" />
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
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet.markercluster/dist/MarkerCluster.css';

	.line-number {
		padding: 0.2em 10px;
		border-radius: 1em;
		font-weight: 900;
		font-size: 1.2rem;
		display: inline-block;
	}
</style>
