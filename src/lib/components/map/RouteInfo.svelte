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
	import { createEventDispatcher } from 'svelte';
	import { operators } from '$lib/stores.js';
	import WHeader from '$lib/components/map/WidgetHeader.svelte';

	export let route;

	const dispatch = createEventDispatcher();

	function goBack() {
		dispatch('back');
	}
</script>

{#if $route}
	<WHeader backBtn="true" on:back={goBack} fg={$route.badge_text} bg={$route.badge_bg}>
		{$route.code}: {$route.name}
	</WHeader>
	<div class="overflow-y-scroll overflow-x-hidden">
		<div class="flex flex-col justify-between min-h-full">
			<span class="text-lg font-bold -mt-1 text-center w-full">Variantes</span>
			<div class="px-2">
				{#each $route.subroutes as subroute}
					<div class="px-2 py-1 outline-1 rounded-box flex flex-col gap-1">
						<span class="text-lg">{subroute.flag} <button class="btn btn-outline btn-xs">👁️</button></span>
						<div class="form-control">
							<div class="input-group input-group-md pl-2">
								<span>De</span>
								<span class="bg-base-200">xxxxxxxx</span>
								<button disabled class="btn btn-outline btn-sm">Ver</button>
							</div>
						</div>
						<div class="form-control">
							<div class="input-group input-group-md pl-2">
								<span>Para</span>
								<span class="bg-base-200">yyyyyyyy</span>
								<button disabled class="btn btn-outline btn-sm" on:click={() => alert("")}>Ver</button>
							</div>
						</div>
						<div class="form-control">
							<div class="input-group input-group-md pl-2">
								<span>Duração</span>
								<span class="bg-base-200">x minutos</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="grow" />
			<a
				class="btn btn-outline btn-primary rounded-full m-2"
				href="/servicos/{operators[$route.operator]?.tag}/{$route.id}/informacao"
			>
				Mais informações
			</a>
		</div>
	</div>
{/if}
