<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024  Cláudio Pereira

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
	import { loadMissing } from '$lib/db';
	import { operatorsWithIllustrations, secondaryOperators } from '$lib/settings';
	import { regionUrl, operatorWithinRegionUrl } from '$lib/urls';

	/** @type {import('./$types').PageData} */
	export let data;
	const region = data.region;
	const operators = data.operators;

	const sortedOperators = operators.sort((a, b) => {
		if (secondaryOperators.has(a.id) && !secondaryOperators.has(b.id)) return 1;
		if (secondaryOperators.has(b.id) && !secondaryOperators.has(a.id)) return -1;
		return a.name.localeCompare(b.name);
	});

	loadMissing().then(() => {
		console.log('Loaded missing data');
	});
</script>

<div class="w-full">
	<div class="card bg-base-100 shadow-xs card-sm lg:card-md">
		<div class="card-body">
			<div class="breadcrumbs hidden lg:block -mt-6">
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
				</ul>
			</div>
			<h2 class="card-title">Operações na região {region.name}</h2>
			<div class="flex flex-col gap-3">
				{#each sortedOperators as op}
					{#if op.logo_url}
						{#if operatorsWithIllustrations.has(op.id)}
							<a
								class="border border-base-300 rounded-xl cursor-pointer h-24 p-2 bg-origin-content! bg-contain! hover:bg-zinc-50! hidden md:flex flex-col justify-between items-stretch"
								href={operatorWithinRegionUrl(region, op)}
								style="background: bottom 0.2em right no-repeat url('/operators/{op.tag}/vehicle.svg')"
							>
								<span
									class="block bg-contain! bg-left-top! bg-no-repeat! grow"
									style="background: url('{op.logo_url}')"
								/>
								<span class="text-xl font-bold">{op.name}</span>
							</a>
							<a
								class="border border-base-300 rounded-xl cursor-pointer hover:bg-zinc-50! h-24 p-2 flex md:hidden flex-col justify-between items-stretch"
								href={operatorWithinRegionUrl(region, op)}
							>
								<span
									class="block bg-contain! bg-left-top! bg-no-repeat! grow"
									style="background: url('{op.logo_url}')"
								/>
								<span class="text-xl font-bold">{op.name}</span>
							</a>
						{:else}
							<a
								class="border border-base-300 rounded-xl cursor-pointer hover:bg-zinc-50! h-24 p-2 flex flex-col justify-between items-stretch"
								href={operatorWithinRegionUrl(region, op)}
							>
								<span
									class="block bg-contain! bg-left-top! bg-no-repeat! grow"
									style="background: url({op.logo_url})"
								/>
								<span class="text-xl font-bold">{op.name}</span>
							</a>
						{/if}
					{:else}
						<a
							class="border border-base-300 rounded-xl cursor-pointer hover:bg-zinc-50! h-24 p-2 flex flex-col justify-end items-stretch"
							href={operatorWithinRegionUrl(region, op)}
						>
							<span class="text-xl font-bold">{op.name}</span>
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
