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
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteMenu from '$lib/components/RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';
	import { writable, derived } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;

	const operator = data.operator;
	const operatorCalendars = Object.values(data.calendars).filter(
		(value) => value.operator_id === operator.id
	);

	const route = data.route;
	const routeSchedule = data.routeSchedule;
	const dateCalendars = data.calendars;

	const selectedSubrouteId = writable(route.subroutes[0]?.id);
	const selectedDay = writable(data.date);

	const subrouteSchedule = derived([selectedSubrouteId], ([$selectedSubrouteId]) => {
		return routeSchedule.filter((departure) => departure.subroute === $selectedSubrouteId);
	});

	let departuresByCalendar = derived(subrouteSchedule, ($subrouteSchedule) => {
		return buildSchedule($subrouteSchedule, dateCalendars);
	});

	function getDeparturesAndCalendars(schedule) {
		let scheduleMats = Object.fromEntries(schedule.map((departure) => [departure.calendar_id, {}]));

		for (let e of schedule) {
			let scheduleMat = scheduleMats[e.calendar_id];

			let hour = Math.floor(e.time / 60);
			let minute = String(Math.floor(e.time % 60)).padStart(2, '0');
			if (!scheduleMat[hour]) scheduleMat[hour] = [];

			scheduleMat[hour].push({ id: e.id, minute: minute });
		}
		let departures = {};

		for (const scheduleMat of Object.values(scheduleMats)) {
			for (const hour of Object.keys(scheduleMat).sort()) {
				departures[hour] = scheduleMat[hour];
			}
		}
		return scheduleMats;
	}

	function groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}

	function buildSchedule(departures, calendars) {
		// Get used calendars
		const usedCalendarIds = new Set(departures.map((departure) => departure.calendar_id));
		const usedCalendars = Object.fromEntries(
			calendars
				.filter((calendar) => usedCalendarIds.has(calendar.id))
				.map((calendar) => [calendar.id, calendar])
		);

		// Group departures by calendar
		const calendarDepartures = groupBy(departures, (departure) => departure.calendar_id);

		const processedSchedule = [...calendarDepartures.entries()].map(([calendarId, departures]) => {
			let calendar = usedCalendars[calendarId];
			let schedule = Array.from(Array(24), () => []);
			if (calendar === undefined) return null;

			for (let departure of departures) {
				let hour = Math.floor(departure.time / 60) % 24;
				let minute = String(Math.floor(departure.time % 60)).padStart(2, '0');
				schedule[hour].push(minute);
			}

			// Find first and last hour with departures
			let minHour = 4; // 4AM
			let maxHour = 2; // 2AM

			for (let i = 4; i <= 26; i++) {
				if (schedule[i % 24].length !== 0) {
					minHour = i;
					break;
				}
			}
			for (let i = 26; i >= 4; i--) {
				if (schedule[i % 24].length !== 0) {
					maxHour = i;
					break;
				}
			}
			// ------------------------------------------

			// Shift hours so that the day starts at 4AM
			let scheduleHours = [...Array(maxHour - minHour + 1).keys()].map((offset) => {
				return (minHour + offset) % 24;
			});

			schedule =
				maxHour < 24
					? schedule.slice(minHour, maxHour + 1)
					: schedule.slice(minHour, 24).concat(schedule.slice(0, (maxHour % 24) + 1));
			// ------------------------------------------

			// Calculate the transposed schedule (for table display)
			const depth = Math.max.apply(
				0,
				schedule.map((hour) => {
					return hour.length;
				})
			);

			const transposed = [...Array(depth).keys()].map(() => []);

			for (let i = 0; i < depth; i++) {
				for (let j = 0; j < schedule.length; j++) {
					transposed[i][j] = schedule[j][i];
				}
			}
			// ----------------------------------------------------

			return {
				calendar: calendar,
				departures: schedule,
				transposedDepartures: transposed,
				scheduleHours: scheduleHours
			};
		});

		return processedSchedule.filter((calendar) => calendar !== null);
	}
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body -mt-6">
		<div class="breadcrumbs">
			<ul>
				<li>
					<a href="/servicos" class="btn btn-ghost btn-xs text-primary">Operadoras</a>
				</li>
				<li>
					<a href="/servicos/{operator.tag}" class="btn btn-ghost btn-xs text-primary">
						{operator.name}
					</a>
				</li>
				<li>
					<a
						href="/servicos/{operator.tag}/{route.id}/informacao"
						class="btn btn-ghost btn-xs text-primary"
					>
						{route.code || route.name}
					</a>
				</li>
				<li>
					<a href="/servicos/{operator.tag}/horario" class="btn btn-ghost btn-xs text-primary">
						Horário
					</a>
				</li>
			</ul>
		</div>
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu operatorTag={operator.tag} {route} />

			{#if $selectedSubrouteId}
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
								Não existem partidas previstas para {new Date($selectedDay).toLocaleDateString(
									'pt-PT',
									{ month: 'long', day: 'numeric' }
								)}. Por favor, selecione outro dia.
							</div>
						</div>
					{/if}

					{#each $departuresByCalendar as calendarDepartures}
						<h2 class="text-lg">{calendarDepartures.calendar}</h2>
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
													<td />
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
							class="stroke-current flex-shrink-0 h-6 w-6"
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
