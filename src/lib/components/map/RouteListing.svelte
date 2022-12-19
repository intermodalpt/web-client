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
	import { createEventDispatcher } from 'svelte';
	import RouteLine from '$lib/components/map/RouteLine.svelte';

	export let selectedRoutes = undefined;

	const dispatch = createEventDispatcher();
	let focusedRoute;
	let hintedRoute;

	function gotoRoute(routeId) {
		routeId = parseInt(routeId);
		dispatch('openroute', { routeId: routeId });
	}

	function gotoSchedule(routeId) {
		routeId = parseInt(routeId);
		dispatch('openschedule', { routeId: routeId });
	}

	function gotoInfo(routeId) {
		routeId = parseInt(routeId);
		dispatch('openinfo', { routeId: routeId });
	}

	function onEnter(routeId) {
		routeId = parseInt(routeId);
		if (focusedRoute) {
			dispatch('drophint', { routeId: focusedRoute });
		}
		hintedRoute = routeId;
		dispatch('hint', { routeId: routeId });
	}

	function onLeave(routeId) {
		routeId = parseInt(routeId);
		if (focusedRoute !== hintedRoute) {
			dispatch('drophint', { routeId: routeId });
			dispatch('hint', { routeId: focusedRoute });
		}
		hintedRoute = undefined;
	}

	function onFocus(routeId) {
		routeId = parseInt(routeId);
		focusedRoute = routeId;
		if (focusedRoute !== hintedRoute) {
			dispatch('drophint', { routeId: hintedRoute });
			dispatch('hint', { routeId: routeId });
		}
	}

	function onUnfocus(routeId) {
		dispatch('drophint', { routeId: routeId });
		focusedRoute = undefined;
	}
</script>

{#if selectedRoutes}
	<div class="flex flex-col sm:gap-1 sm:p-2">
		{#each selectedRoutes as route}
			<RouteLine
				{onUnfocus}
				{onFocus}
				{onLeave}
				{onEnter}
				{gotoSchedule}
				{gotoInfo}
				{gotoRoute}
				{route}
			/>
		{/each}
	</div>
{:else}
	<div class="p-4">Selecione uma região do mapa para visualizar as rotas existentes.</div>
{/if}

<link rel="stylesheet" href="https://unpkg.com/balloon-css/balloon.min.css" />
