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
<script>
	let { subrouteStops, onclick } = $props();
	let selectedId = 0;

	function sensibleLengthStopName(stop) {
		return stop.short_name || stop.name || stop.official_name || stop.osm_name;
	}

	function stopClicked(stop) {
		selectedId = stop.id;
		onclick?.(stop);
		// dispatch('stopClicked', { stop: stop });
	}
</script>

<ul class="overflow-y-scroll steps steps-vertical w-full">
	{#each subrouteStops as stop, i}
		<a href="/paragens/{stop}" target="_blank" rel="noopener noreferrer" class="step">
			{sensibleLengthStopName(stop)}
		</a>
	{/each}
</ul>
