<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2024  Cláudio Pereira

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
	import { goto } from '$app/navigation';
	import { loadMissing } from '$lib/db.js';
	import { regionUrl, operatorWithinRegionUrl, routeWithinRegionUrl } from '$lib/urls.js';
	import Navigation from '../Navigation.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const routes = data.routes;
	const region = data.region;
	const operator = data.operator;

	$: sortedRoutes = routes.sort((a, b) => {
		if (a.code && !b.code) return -1;
		if (!a.code && b.code) return 1;

		const aIntCode = parseInt(a.code);
		const bIntConde = parseInt(b.code);
		if (aIntCode && bIntConde) return aIntCode - bIntConde;

		if (a.code && b.code) return a.code.localeCompare(b.code);
		return a.name.localeCompare(b.name);
	});

	async function loadData() {}

	loadData().then(async () => {
		console.log('data loaded');
		await loadMissing();
	});

	let zoneName = null;

	function clickRoute(route) {
		const url = routeWithinRegionUrl(region, operator, route);
		goto(url);
	}
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body -mt-6">
		<div class="breadcrumbs">
			<ul>
				<li>
					<a href="/" class="btn btn-ghost btn-xs text-primary">Início</a>
				</li>
				<li>
					<a href="/regioes" class="btn btn-ghost btn-xs text-primary">Regiões</a>
				</li>
				<li>
					<a href={regionUrl(region)} class="btn btn-ghost btn-xs text-primary">{region.name}</a>
				</li>
				<li>
					<a
						href={operatorWithinRegionUrl(region, operator)}
						class="btn btn-ghost btn-xs text-primary"
					>
						{operator.name}
					</a>
				</li>
				<li>
					<a
						href={`${operatorWithinRegionUrl(region, operator)}/linhas`}
						class="btn btn-ghost btn-xs text-primary"
					>
						Linhas
					</a>
				</li>
			</ul>
		</div>

		<Navigation {region} {operator} page="routes" />

		{#if zoneName}
			<h2 class="font-xl">{routes.length} linhas em {zoneName}</h2>
		{/if}
		<table class="table table-compact w-full">
			<tbody>
				{#each sortedRoutes as route, i}
					<tr
						class="cursor-pointer hover"
						class:bg-zinc-100={i % 2 === 0}
						on:click={() => clickRoute(route)}
						on:keypress={() => clickRoute(route)}
					>
						<td class="p-0">
							<a
								href={routeWithinRegionUrl(region, operator, route)}
								class="py-3 pl-2 flex justify-end"
							>
								<span
									class="line-number min-h-4"
									style:background-color={route.badge_bg}
									style:color={route.badge_text}
									style:border={'2px solid ' + route.badge_text}>{route.code ?? ''}</span
								>
							</a>
						</td>
						<td class="w-full p-0">
							<a href={routeWithinRegionUrl(region, operator, route)} class="block w-full p-3">
								{route.name}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.line-number {
		padding: 0.2em 10px;
		border-radius: 1em;
		font-weight: 900;
		font-size: 1.2rem;
		display: inline-block;
	}
</style>
