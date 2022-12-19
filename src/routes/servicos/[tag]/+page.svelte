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
	/** @type {import('./$types').PageData} */
	export let data;

	const operator = data.operator;
	const routes = data.routes;
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body -mt-4">
		<div class="flex gap-2">
			<a href="/servicos" class="btn btn-ghost btn-xs text-primary">Operadoras</a>
			<a href="/servicos/{data.operator.tag}" class="btn btn-ghost btn-xs text-primary">
				{operator.name}
			</a>
		</div>
		<div class="company compact {data.operator.tag} bg-base-200" />

		<div class="overflow-x-auto">
			{#if false}
				<!-- <Route /> -->
			{:else}
				<table class="table table-zebra table-compact w-full">
					<thead>
						<tr>
							<th>Linha</th>
						</tr>
					</thead>
					<tbody>
						{#each routes as route}
							<tr class="cursor-pointer hover">
								<a href="/servicos/{operator.tag}/{route.id}/informacao">
									<th>
										{#if route.code}
											<span
												class="line-number"
												style="background-color: {route.badge_bg}; color: {route.badge_text}; border: 2px solid {route.badge_text};"
											>
												{route.code}
											</span>
										{/if}
									</th>
									<td class="w-full">{route.name}</td>
								</a>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
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
