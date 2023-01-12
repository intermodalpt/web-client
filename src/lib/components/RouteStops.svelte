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
	import { page } from '$app/stores';

	export let subrouteStops;

	let selectedId = 0;

	const dispatch = createEventDispatcher();

	function stopName(stop) {
		return stop.short_name || stop.name || stop.official_name || stop.osm_name;
	}

	function stopClicked(stop) {
		selectedId = stop.id;
		dispatch('stopClicked', { stop: stop });
	}

	if (subrouteStops === undefined) {
		console.log('no stops for');
		console.log($page);
	}
</script>

<ul class="overflow-y-scroll steps steps-vertical w-full">
	{#each subrouteStops as stop, i}
		<!-- <li
			on:mouseup={() => stopClicked(stop)}
			class="step hover:bg-base-200 rounded-xl cursor-pointer"
			class:step-primary={selectedId == stop.id}
		>
			{stopName(stop)}
		</li> -->

		<a href="/paragens/{stop.id}" target="_blank" rel="noopener noreferrer">
			<li
				class="step hover:bg-base-200 rounded-xl cursor-pointer"
				class:step-primary={selectedId == stop.id}
			>
				{stopName(stop)}
			</li>
		</a>
	{/each}
</ul>
