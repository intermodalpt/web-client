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
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteStops from '$lib/components/RouteStops.svelte';
	import RouteMenu from '$lib/components/RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const operator = data.operator;
	const route = data.route;
	const routeStops = data.routeStops;

	let selectedSubrouteId = writable(route.subroutes[0]?.id);
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body">
		<div class="breadcrumbs -mt-6">
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
					<a href="/servicos/{operator.tag}/{route.id}/paragens" class="btn btn-ghost btn-xs text-primary">
						Paragens
					</a>
				</li>
			</ul>
		</div>
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu operatorTag={operator.tag} {route} />

			{#if $selectedSubrouteId}
				<h2 class="text-xl">Variante a consultar</h2>
				<select class="select select-primary select-sm w-full" bind:value={$selectedSubrouteId}>
					{#each route.subroutes as subroute}
						<option value={subroute.id}>{subroute.flag}</option>
					{/each}
				</select>
				<RouteStops subrouteStops={routeStops[$selectedSubrouteId]} />
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
