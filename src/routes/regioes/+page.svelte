<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024 - 2025  Cláudio Pereira

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
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { selectedRegion, getLocalRegion } from '$lib/db';
	import { slugify } from '$lib/utils';
	import RegionPicker from '$lib/components/RegionPicker.svelte';
	import { regionUrl } from '$lib/urls.js';

	export let data;
	const regions = data.regions;

	let modes = {
		map: 'map',
		index: 'index'
	};
	let mode = browser ? modes.map : modes.index;
</script>

<div class="w-full">
	<div class="card card-sm bg-base-100 shadow-xs">
		<div class="card-body">
			<h2 class="text-lg font-bold text-center">
				Escolha uma região no
				<div class="join">
					<button
						class="join-item btn btn-sm btn-primary btn-outline"
						class:btn-active={mode == modes.map}
						on:click={() => (mode = modes.map)}>Mapa</button
					>
					<button
						class="join-item btn btn-sm btn-primary btn-outline"
						class:btn-active={mode == modes.index}
						on:click={() => (mode = modes.index)}>Índice</button
					>
				</div>
			</h2>
			<div class:hidden={mode != modes.map}>
				<RegionPicker
					onselect={(id) => {
						console.log('Selected region:', id);
						getLocalRegion(id).then((region) => {
							goto(regionUrl(region));
						});
					}}
					setsUserRegion={false}
					requestsConfirmation={false}
				/>
			</div>

			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:p-2"
				class:hidden={mode != modes.index}
			>
				{#each regions as region}
					<a class="btn btn-primary" href="/regioes/{region.id}-{slugify(region.name)}"
						>{region.name}</a
					>
				{/each}
			</div>
			{#if $selectedRegion}
				<a
					class="btn btn-secondary btn-lg"
					href="/regioes/{$selectedRegion?.id}-{slugify($selectedRegion?.name ?? '')}"
					>Continuar em {$selectedRegion?.name}</a
				>
			{/if}
		</div>
	</div>
</div>
