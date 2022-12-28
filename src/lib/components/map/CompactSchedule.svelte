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
	import { writable, derived } from 'svelte/store';
	import { buildSchedule } from '$lib/utils.js';
	import { apiServer } from '$lib/settings.js';

	export let selectedRoute;

	const today = new Date().toISOString().split('T')[0];
	const selectedDay = writable(today);
	const selectedSubrouteId = writable(null);

	let dateCalendars;

	const routeSchedule = derived(
		[selectedDay, selectedRoute],
		([$selectedDay, $selectedRoute], set) => {
			if ($selectedRoute) {
				$selectedSubrouteId = $selectedRoute.subroutes[0]?.id;
				Promise.all([
					fetch(`${apiServer}/v1/routes/${$selectedRoute.id}/schedule`).then((r) => r.json()),
					fetch(
						`${apiServer}/v1/operators/${$selectedRoute.operator}/calendars/date/${$selectedDay}`
					).then((r) => r.json())
				]).then(([schedule, operatorDateCalendars]) => {
					dateCalendars = operatorDateCalendars;
					set(schedule);
				});
			}
		}
	);

	const subrouteSchedule = derived(
		[routeSchedule, selectedSubrouteId],
		([$routeSchedule, $selectedSubrouteId]) => {
			return $routeSchedule
				? $routeSchedule.filter((departure) => departure.subroute === $selectedSubrouteId)
				: [];
		}
	);

	let departuresByCalendar = derived(subrouteSchedule, ($subrouteSchedule) => {
		if (dateCalendars) {
			return buildSchedule($subrouteSchedule, dateCalendars);
		}
	});
</script>

<div class="overflow-y-scroll w-full flex flex-col">
	<div>
		<select class="select select-primary select-md w-full" bind:value={$selectedSubrouteId}>
			{#each $selectedRoute.subroutes as subroute}
				<option value={subroute.id}>{subroute.flag}</option>
			{/each}
		</select>
		<input type="date" class="input input-bordered text-lg w-full" bind:value={$selectedDay} />
	</div>
	{#if $departuresByCalendar}
		{#if $departuresByCalendar.length === 0}
			<div class="flex flex-col border-error border-2 p-2 rounded-xl">
				<div class="flex flex-row font-bold items-center text-error-content">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Sem partidas
				</div>
				<div>
					Não existem partidas previstas para {new Date($selectedDay).toLocaleDateString('pt-PT', {
						month: 'long',
						day: 'numeric'
					})}. Por favor, selecione outro dia.
				</div>
			</div>
		{/if}

		<div class="flex flex-col border-error border-2 p-2 rounded-xl">
			<div class="flex flex-row font-bold items-center text-error-content">
				Informação potêncialmente incorreta
			</div>
			<div>Os horários podem estar (e provávelmente estão) errados.</div>
		</div>

		<div class="flex flex-col gap-2 p-2 overflow-y-scroll">
			{#each $departuresByCalendar as calendarDepartures}
				<h2 class="text-lg font-bold">{calendarDepartures.calendar.name}</h2>
				{#if calendarDepartures.departures.length === 0 || calendarDepartures.departures.length === 0}
					<span class="text-lg">Sem partidas no dia selecionado</span>
				{/if}
				{#each calendarDepartures.scheduleHours as hour, i}
					{#if calendarDepartures.departures[i].length > 0}
						<div class="flex flex-row flex-wrap items-center gap-2">
							{#each calendarDepartures.departures[i] as minutes}
								<span class="mr-2">
									<span class="text-base-content rounded-full text-lg font-bold text-right"
										>{hour}h</span
									>
									<span class="text-lg">{minutes}</span>
								</span>
							{/each}
						</div>
						<hr />
					{/if}
				{/each}
			{/each}
		</div>
	{/if}
</div>
