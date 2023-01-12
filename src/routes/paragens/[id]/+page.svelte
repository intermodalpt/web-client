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
	const pictures = data.pictures;

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
		<figure>
			{#if pictures?.length}
				<div
					class="bg-cover bg-no-repeat bg-center transition-all hover:scale-110 h-32 lg:h-40 w-full"
					style="background-image: url('https://intermodal-storage-worker.claudioap.workers.dev/medium/{pictures[0]
						.sha1}/preview')"
				/>
			{:else}
				<img src="https://placeimg.com/1200/200/arch" alt="Imagem da paragem" />
			{/if}
		</figure>
		<div class="card-body">
			<h2 class="card-title text-3xl">
				{stopName()}
				<span class="stopScore p-1 rounded-full border-2 {stopScoreClass(score)}">{score}</span>
			</h2>
			<div class="flex flex-wrap gap-1 pl-2 pr-2 sm:pl-4 sm:pr-3 z-[10000]">
				{#if stop?.has_crossing === true}
					<div class="tooltip" data-tip="Com atravessamento de via">
						<img class="h-12" src="/stopattrs/crossing.svg" alt="Atravessamento de via" />
					</div>
				{/if}
				{#if stop?.has_accessibility === true}
					<div class="tooltip" data-tip="Adequada a mobilidade reduzida">
						<img class="h-12" src="/stopattrs/accessible.svg" alt="Mobilidade reduzida" />
					</div>
				{/if}
				{#if stop?.is_illumination_working === false}
					<div class="tooltip" data-tip="Falta de iluminação">
						<img class="h-12" src="/stopattrs/light-none.svg" alt="Falta de iluminação" />
					</div>
				{:else if stop?.is_illumination_working === true}
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
				{#if stop?.has_abusive_parking === true}
					<div class="tooltip" data-tip="Estacionamento abusivo">
						<img class="h-12" src="/stopattrs/abusive-parking.svg" alt="Estacionamento abusivo" />
					</div>
				{/if}
				{#if stop?.has_accessibility === false}
					<div class="tooltip" data-tip="Inadequada a mobilidade reduzida">
						<img
							class="h-12"
							src="/stopattrs/accessible-not.svg"
							alt="Inadequada a mobilidade reduzida"
						/>
					</div>
				{/if}
				{#if stop?.is_damaged === true}
					<div class="tooltip" data-tip="Danificada">
						<img class="h-12" src="/stopattrs/damaged.svg" alt="Danificada" />
					</div>
				{/if}
				{#if stop?.has_flag === false || (stop?.has_flag !== true && stop?.has_outdated_info === true)}
					<div class="tooltip" data-tip="Sem identificação">
						<img class="h-12" src="/stopattrs/flag-not.svg" alt="Sem identificação" />
					</div>
				{/if}
				{#if stop?.has_schedules === false || (stop?.has_schedules !== true && stop?.has_outdated_info === true)}
					<div class="tooltip" data-tip="Sem horários atualizados">
						<img class="h-12" src="/stopattrs/schedules-not.svg" alt="Sem horários atualizados" />
					</div>
				{/if}
				{#if stop?.has_sidewalk === false}
					<div class="tooltip" data-tip="Sem passeio">
						<img class="h-12" src="/stopattrs/sidewalk-not.svg" alt="Sem passeio" />
					</div>
				{/if}
				{#if stop?.has_shelter === false}
					<div class="tooltip" data-tip="Sem abrigo">
						<img class="h-12" src="/stopattrs/shelter-not.svg" alt="Sem abrigo" />
					</div>
				{/if}
				{#if stop?.has_bench === false}
					<div class="tooltip" data-tip="Sem banco">
						<img class="h-12" src="/stopattrs/bench-not.svg" alt="Sem banco" />
					</div>
				{/if}
				{#if stop?.has_trash_can === false}
					<div class="tooltip" data-tip="Sem balde do lixo">
						<img class="h-12" src="/stopattrs/garbage-not.svg" alt="Sem balde do lixo" />
					</div>
				{/if}
				{#if stop?.has_visibility_from_area === false}
					<div class="tooltip" data-tip="Sem visibilidade">
						<img class="h-12" src="/stopattrs/visibility-not.svg" alt="Sem visibilidade" />
					</div>
				{/if}
				{#if stop?.has_visibility_from_within === false}
					<div class="tooltip" data-tip="Sem visibilidade exterior">
						<img
							class="h-12"
							src="/stopattrs/visibility-within-not.svg"
							alt="Sem visibilidade exterior"
						/>
					</div>
				{/if}
				{#if stop?.is_visible_from_outside === false}
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
			<div class="flex flex-wrap gap-1">
				{#if stop?.has_flag === true}
					<div class="tooltip z-[10000]" data-tip="Identificada">
						<img class="h-12" src="/stopattrs/flag.svg" alt="Identificada" />
					</div>
				{/if}
				{#if stop?.has_schedules === true}
					<div class="tooltip z-[10000]" data-tip="Horários">
						<img class="h-12" src="/stopattrs/schedules.svg" alt="Horários" />
					</div>
				{/if}
				{#if stop?.has_sidewalk === true}
					<div class="tooltip z-[10000]" data-tip="Passeio">
						<img class="h-12" src="/stopattrs/sidewalk.svg" alt="Passeio" />
					</div>
				{/if}
				{#if stop?.has_shelter === true}
					<div class="tooltip z-[10000]" data-tip="Abrigo">
						<img class="h-12" src="/stopattrs/shelter.svg" alt="Abrigo" />
					</div>
				{/if}
				{#if stop?.has_bench === true}
					<div class="tooltip z-[10000]" data-tip="Banco">
						<img class="h-12" src="/stopattrs/bench.svg" alt="Banco" />
					</div>
				{/if}
				{#if stop?.has_trash_can === true}
					<div class="tooltip z-[10000]" data-tip="Balde do Lixo">
						<img class="h-12" src="/stopattrs/garbage.svg" alt="Balde do Lixo" />
					</div>
				{/if}
				{#if stop?.has_visibility_from_area === true}
					<div class="tooltip z-[10000]" data-tip="Visibilidade">
						<img class="h-12" src="/stopattrs/visibility.svg" alt="Visibilidade" />
					</div>
				{/if}
				{#if stop?.has_visibility_from_within === true}
					<div class="tooltip z-[10000]" data-tip="Visibilidade exterior">
						<img class="h-12" src="/stopattrs/visibility-within.svg" alt="Visibilidade exterior" />
					</div>
				{/if}
				{#if stop?.is_visible_from_outside === true}
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
			{#if pictures?.length}
				<div class="grid grid-cols-2">
					{#each pictures as picture}
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
