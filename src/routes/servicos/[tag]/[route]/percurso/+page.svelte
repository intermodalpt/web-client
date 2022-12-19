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
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteMenu from '$lib/components/RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';
	import RouteMap from '$lib/components/RouteMap.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const operator = data.operator;
	const route = data.route;
	const routeStops = data.routeStops;

	const selectedSubrouteId = writable(route.subroutes[0]?.id);
	const subrouteStops = derived([selectedSubrouteId], ([$selectedSubrouteId]) => {
		if (routeStops) {
			return routeStops[$selectedSubrouteId];
		} else {
			return [];
		}
	});
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
					<a href="/servicos/{operator.tag}/percurso" class="btn btn-ghost btn-xs text-primary"
						>Percurso
					</a>
				</li>
			</ul>
		</div>
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu operatorTag={operator.tag} {route} />

			<h2 class="text-xl">Variante a consultar</h2>
			<select class="select select-primary select-sm w-full" bind:value={$selectedSubrouteId}>
				{#each route.subroutes as subroute}
					<option value={subroute.id}>{subroute.flag}</option>
				{/each}
			</select>
			<RouteMap {subrouteStops} />
		</div>
	</div>
</div>
