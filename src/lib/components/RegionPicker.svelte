<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024  Cláudio Pereira

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
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import maplibre  from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { liveQuery } from 'dexie';
	import { fetchRegions, getRegions, regionsLoaded, setRegion } from '$lib/db';
	import { tileStyle } from '$lib/settings.js';

	const dispatch = createEventDispatcher();

	export let setsUserRegion = true;
	export let requestsConfirmation = true;

	let map;
	let mapElem;
	let regionConfirmationModal;
	let mapGeolocateControl;
	let isGeolocating = false;

	let mapLoaded = false;

	let hoveredRegionId = null;
	let explicitRegionChange = false;

	const DEFAULT_BOUNDS = [
		[-11, 36.5],
		[-5.5, 42.35]
	];

	const regions = liveQuery(() => getRegions());
	const pendingRegionId = writable();

	const pendingRegion = derived([regions, pendingRegionId], ([$regions, $pendingRegionId]) => {
		if (!$pendingRegionId || !$regions) {
			return null;
		}
		return $regions.find((r) => r.id == $pendingRegionId);
	});

	regions.subscribe((regs) => {
		drawRegions();
	});

	pendingRegion.subscribe((region) => {
		if (!region) return;

		regionConfirmationModal.showModal();
	});

	async function confirmPendingRegion() {
		if (setsUserRegion) {
			await setRegion($pendingRegionId);
		}
		dispatch('select', { id: $pendingRegionId });
		explicitRegionChange = false;
		$pendingRegionId = null;
	}

	function drawRegions() {
		if (!mapLoaded || !$regions) {
			return;
		}

		map.getSource('regions').setData({
			type: 'FeatureCollection',
			features: $regions.map((region) => ({
				type: 'Feature',
				id: region.id,
				properties: {
					id: region.id,
					name: region.name
				},
				geometry: region.geometry
			}))
		});
	}

	async function loadData() {
		await Promise.all([fetchRegions()]);
	}
	loadData().then(async () => {
		console.log('Region picker data loaded');
	});

	const regionTabs = {
		north: 1,
		center: 2,
		south: 3
	};
	let regionTab = writable();

	regionTab.subscribe((tab) => {
		switch (tab) {
			case regionTabs.north:
				// map.setMaxBounds([
				// 	[-9.14, 40.44],
				// 	[-7.95, 42.38]
				// ]);
				map.flyTo({
					center: [-8.62, 41.16],
					zoom: 7
				});
				break;
			case regionTabs.center:
				map.setMaxBounds(DEFAULT_BOUNDS);
				map.flyTo({
					center: [-9.12, 38.72],
					zoom: 7
				});
				break;
			case regionTabs.south:
				map.setMaxBounds(DEFAULT_BOUNDS);
				map.flyTo({
					center: [-8.0, 37.14],
					zoom: 8
				});
				break;
			default:
				if (map) {
					map.setMaxBounds(DEFAULT_BOUNDS);
				}
		}
	});

	function addSourcesAndLayers() {
		map.addSource('regions', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});

		map.addLayer({
			id: 'regions-fills',
			type: 'fill',
			source: 'regions',
			layout: {},
			paint: {
				'fill-color': '#627BC1',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, 0.1]
			}
		});

		map.addLayer({
			id: 'region-borders',
			type: 'line',
			source: 'regions',
			layout: {},
			paint: {
				'line-color': '#627BC1',
				'line-width': 0.5
			}
		});
	}

	function addEvents() {
		mapGeolocateControl.on('geolocate', (e) => {
			isGeolocating = false;
			$regionTab = -1;
		});

		mapGeolocateControl.on('outofmaxbounds', function () {
			alert('Aparenta estar fora de Portugal continental.');
			isGeolocating = false;
		});

		mapGeolocateControl.on('error', function () {
			alert('Incapaz de obter a sua localização.');
			isGeolocating = false;
		});

		map.on('click', 'regions-fills', (e) => {
			if (requestsConfirmation) {
				$pendingRegionId = e.features[0].id;
			} else {
				if (setsUserRegion) {
					setRegion(e.features[0].id);
				}
				dispatch('select', { id: e.features[0].id });
			}
		});

		map.on('mousemove', 'regions-fills', (e) => {
			if (e.features.length > 0) {
				if (hoveredRegionId) {
					map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: false });
				}
				hoveredRegionId = e.features[0].id;
				map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: true });
			}
		});

		map.on('mouseleave', 'regions-fills', () => {
			if (hoveredRegionId) {
				map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: false });
			}
			hoveredRegionId = null;
		});
	}

	onMount(() => {
		map = new maplibre.Map({
			container: mapElem,
			style: tileStyle,
			minZoom: 3,
			zoom: 3,
			maxZoom: 11,
			maxBounds: DEFAULT_BOUNDS,
			center: [-9.1333, 38.7167]
		});

		mapGeolocateControl = new maplibre.GeolocateControl();
		map.addControl(new maplibre.NavigationControl(), 'top-right');
		map.addControl(mapGeolocateControl, 'top-right');

		map.on('load', () => {
			addSourcesAndLayers();
			addEvents();
			mapLoaded = true;
			if ($regionsLoaded) {
				drawRegions();
			}
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map.remove();
	});
</script>

<div>
	<div role="tablist" class="tabs tabs-lg tabs-bordered justify-start" class:hidden={!$regionTab}>
		<button role="tab" class="tab" on:click={() => ($regionTab = null)}>Voltar</button>
	</div>
	<div role="tablist" class="tabs tabs-lg tabs-bordered" class:hidden={$regionTab}>
		<button
			role="tab"
			class="tab"
			class:tab-active={$regionTab == regionTabs.north}
			on:click={() => ($regionTab = regionTabs.north)}>Norte</button
		>
		<button
			role="tab"
			class="tab"
			class:tab-active={$regionTab == regionTabs.center}
			on:click={() => ($regionTab = regionTabs.center)}>Centro</button
		>
		<button
			role="tab"
			class="tab"
			class:tab-active={$regionTab == regionTabs.south}
			on:click={() => ($regionTab = regionTabs.south)}>Sul</button
		>
	</div>
	<div
		bind:this={mapElem}
		class="w-full h-[50vh] rounded-b-lg relative"
		class:rounded-tr-lg={$regionTab}
	>
		<div
			class="absolute top-0 w-full h-full z-10 flex flex-col gap-4 justify-center items-center backdrop-blur-md"
			class:hidden={$regionTab}
		>
			{#if isGeolocating}
				<span class="text-3xl text-neutral">A obter a sua localização</span>
				<span class="text-lg text-neutral">(pode ter de aceitar)</span>
				<progress class="progress w-56" />
			{:else}
				<span class="text-3xl text-neutral">Escolha a zona do país</span>
				<button
					class="btn btn-primary"
					class:hidden={isGeolocating}
					on:click={() => {
						isGeolocating = true;
						mapGeolocateControl.trigger();
					}}>Utilizar a minha localização</button
				>
			{/if}
		</div>
	</div>
</div>
<dialog bind:this={regionConfirmationModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		{#if setsUserRegion}
			<h3 class="font-bold text-lg">Escolher <b>{$pendingRegion?.name || ''}</b> como região?</h3>
			<p class="py-4">
				Esta definição serve para mostrar os serviços relevantes para a sua região. Pode alterar em
				qualquer momento a partir do menu.
			</p>
		{:else}
			<h3 class="font-bold text-lg">Seleccionar <b>{$pendingRegion?.name || ''}</b>?</h3>
		{/if}
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success" on:click={confirmPendingRegion}>Sim</button>
				<button class="btn" on:click={() => ($pendingRegionId = null)}>Não</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>
