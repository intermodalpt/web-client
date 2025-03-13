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
<script lang="ts">
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteMenu from '../RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';
	import { writable, derived } from 'svelte/store';
	import { buildSchedule } from '$lib/utils';
	import RouteBreadcrumbs from '../RouteBreadcrumbs.svelte';

	const { data } = $props();
	const { region, operator, route, date, routeSchedule, dateCalendars } = data;

	const selectedSubrouteId = writable(route.subroutes[0]?.id);
	const selectedDay = writable(date);

	const subrouteSchedule = derived([selectedSubrouteId], ([$selectedSubrouteId]) => {
		return routeSchedule.filter((departure) => departure.subroute === $selectedSubrouteId);
	});

	let departuresByCalendar = derived(subrouteSchedule, ($subrouteSchedule) => {
		return buildSchedule($subrouteSchedule, dateCalendars);
	});
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body -mt-6">
		<RouteBreadcrumbs {region} {operator} {route} />
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu {region} {operator} {route} />

			{#if $selectedSubrouteId}
				<div class="text-xl flex items-center mb-4 mt-4">
					<span
						class="rounded-full text-info bg-info-content w-8 h-8 flex justify-center items-center text-center shadow-xl mr-4"
					>
						1
					</span>
					Variante
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
					Dia
				</div>
				<input
					type="date"
					class="input input-lg text-lg font-bold p-2 input-bordered"
					bind:value={$selectedDay}
				/>
				<div class="text-xl flex items-center mb-4 mt-4">
					<span
						class="rounded-full text-info bg-info-content w-8 h-8 flex justify-center items-center text-center shadow-xl mr-4"
					>
						3
					</span>
					Horário
				</div>

				{#if $departuresByCalendar}
					{#if $departuresByCalendar.length === 0}
						<div class="flex flex-col border-error border-2 p-2 rounded-xl">
							<div class="flex flex-row font-bold items-center text-error-content">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="stroke-current shrink-0 h-6 w-6"
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
								Não existem partidas previstas para {new Date($selectedDay).toLocaleDateString(
									'pt-PT',
									{ month: 'long', day: 'numeric' }
								)}. Por favor, selecione outro dia.
							</div>
						</div>
					{/if}

					{#each $departuresByCalendar as calendarDepartures}
						<h2 class="text-lg font-bold">{calendarDepartures.calendar.name}</h2>
						<div class="overflow-x-auto">
							<table class="table table-compact w-full">
								<thead>
									<tr>
										{#each calendarDepartures.scheduleHours as hour}
											<th>{hour}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each calendarDepartures.transposedDepartures as row}
										<tr>
											{#each row as departure}
												{#if departure !== undefined}
													<td>{departure}</td>
												{:else}
													<td></td>
												{/if}
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/each}
				{/if}
			{:else}
				<div class="alert alert-warning shadow-lg my-4">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/></svg
						>
						<span>Serviço por definir</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
