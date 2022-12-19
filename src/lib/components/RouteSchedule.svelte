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
	import { writable } from 'svelte/store';

	export let route;
	export let selectedSubrouteId;
	const selectedDay = writable(new Date().toISOString().split('T')[0]);
</script>

<div class="text-xl flex items-center mb-4 mt-4">
	<span
		class="rounded-full text-info bg-info-content w-8 h-8 flex justify-center items-center text-center shadow-xl mr-4"
	>
		1
	</span>
	Variante a consultar
</div>
<select class="select select-primary select-sm w-full" bind:value={$selectedSubrouteId}>
	{#each route.subroutes as subroute}
		<option value={subroute.id}>{subroute.flag}</option>
	{/each}
</select>
<hr class="mt-2 mb-2" />
<div class="text-xl flex items-center mb-4 mt-4">
	<span
		class="rounded-full text-info bg-info-content w-8 h-8 flex justify-center items-center text-center shadow-xl mr-4"
	>
		2
	</span>
	Dia a consultar
</div>
<input type="date" class="input input-lg text-lg -mt-4" bind:value={$selectedDay} />
<hr />
<div class="text-xl flex items-center mb-4 mt-4">
	<span
		class="rounded-full text-info bg-info-content w-8 h-8 flex justify-center items-center text-center shadow-xl mr-4"
	>
		3
	</span>
	Horário
</div>
{#if $subrouteSchedule}
	<div class="overflow-x-auto">
		<table class="table table-compact w-full">
			<thead>
				<tr>
					{#each $subrouteSchedule.schedule_hours as hour}
						<th>{hour}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each $subrouteSchedule.transposed as row}
					<tr>
						{#each row as departure}
							{#if departure !== undefined}
								<td>{departure}</td>
							{:else}
								<td />
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
