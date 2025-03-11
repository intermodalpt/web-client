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
	import { loadMissing } from '$lib/db.js';
	import { regionUrl, operatorWithinRegionUrl } from '$lib/urls.js';
	import Navigation from './Navigation.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const region = data.region;
	const operator = data.operator;

	async function loadData() {}

	loadData().then(async () => {
		console.log('data loaded');
		await loadMissing();
	});
</script>

<div class="card bg-base-100 shadow-xs">
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
			</ul>
		</div>

		<Navigation {region} {operator} page="root" />
	</div>
</div>
