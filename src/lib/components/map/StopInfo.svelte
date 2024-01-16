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
	import RouteListing from '$lib/components/map/RouteListing.svelte';
	import { sensibleLengthStopName, stopScore, stopScoreClass } from '$lib/utils.js';
	import { createEventDispatcher } from 'svelte';

	export let routes;
	export let stop;
	export let spider;
	export let pictures;

	$: selectedRoutes = spider
		? Object.keys(spider.routes)
				.map((id) => {
					return routes[id];
				})
				.sort((ra, rb) => {
					if (!ra.code) {
						return -1;
					} else if (!rb.code) {
						return 1;
					} else {
						return (parseInt(ra.code) || 10000) - (parseInt(rb.code) || 10000);
					}
				})
		: [];

	$: score = stop ? stopScore(stop) : null;

	const dispatch = createEventDispatcher();

	let openedPic = null;
	let picDialogElem;
	function openPic(pic) {
		openedPic = pic;
		picDialogElem.showModal();
	}

	function goBack() {
		dispatch('back');
	}
</script>

{#if stop}
	<div class="h-full grid grid-cols-1" style="grid-template-rows: auto 1fr;">
		<div
			class="px-1 py-2 flex flex-row items-center gap-1 h-12 w-full bg-[#303446] text-white text-lg font-bold"
		>
			<button class="btn btn-neutral btn-circle mt-0 mb-0" on:click={goBack}>
				<svg
					class="w-6 h-6"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					style="fill: oklch(var(--pc))"
				>
					<path
						d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z"
					/>
				</svg>
			</button>
			<span
				class="text-lg font-bold whitespace-nowrap overflow-hidden flex flex-row gap-1 items-baseline grow"
			>
				{sensibleLengthStopName(stop)}
			</span>
			{#if score != null}
				<span class="rounded-full p-2 {stopScoreClass(score)}">{score}</span>
			{/if}
		</div>
		<div class="overflow-x-hidden overflow-y-auto h-full flex flex-col">
			{#if $pictures?.length}
				<button on:click={() => openPic($pictures[0])}>
					<div
						class="bg-no-repeat bg-center transition-all hover:scale-110 h-32 lg:h-40"
						style="background-image: url('{$pictures[0]
							.url_medium}'), url(/icons/picture.svg); background-size: cover, contain;"
					/>
				</button>
			{/if}
			<div class="flex flex-col grow py-2">
				<div class="flex flex-wrap gap-1 pl-2 pr-2 sm:pl-4 sm:pr-3">
					{#if stop?.has_crossing === true}
						<div class="tooltip" data-tip="Com atravessamento de via">
							<img class="h-12" src="/stopattrs/crossing.svg" alt="Atravessamento de via" />
						</div>
					{/if}
					{#if stop?.has_accessibility === true}
						<div class="tooltip" data-tip="Adequada a mobilidade reduzida">
							<img class="h-12" src="/stopattrs/accessible.svg" alt="Mobilidade reduzida" />
						</div>
					{/if}
					{#if stop?.is_illumination_working === false}
						<div class="tooltip" data-tip="Falta de iluminação">
							<img class="h-12" src="/stopattrs/light-none.svg" alt="Falta de iluminação" />
						</div>
					{:else if stop?.is_illumination_working === true}
						{#if stop.illumination_strength || 0 > 3}
							<div class="tooltip" data-tip="Boa iluminação">
								<img class="h-12" src="/stopattrs/light-full.svg" alt="Boa iluminação" />
							</div>
						{:else if stop.illumination_strength || 0 > 0}
							<div class="tooltip" data-tip="Falta de iluminação">
								<img class="h-12" src="/stopattrs/light-half.svg" alt="Falta de iluminação" />
							</div>
						{/if}
					{/if}
					{#if stop?.has_abusive_parking === true}
						<div class="tooltip" data-tip="Estacionamento abusivo">
							<img class="h-12" src="/stopattrs/abusive-parking.svg" alt="Estacionamento abusivo" />
						</div>
					{/if}
					{#if stop?.has_accessibility === false}
						<div class="tooltip" data-tip="Inadequada a mobilidade reduzida">
							<img
								class="h-12"
								src="/stopattrs/accessible-not.svg"
								alt="Inadequada a mobilidade reduzida"
							/>
						</div>
					{/if}
					{#if stop?.is_damaged === true}
						<div class="tooltip" data-tip="Danificada">
							<img class="h-12" src="/stopattrs/damaged.svg" alt="Danificada" />
						</div>
					{/if}
					{#if stop?.has_flag === false || (stop?.has_flag !== true && stop?.has_outdated_info === true)}
						<div class="tooltip" data-tip="Sem identificação">
							<img class="h-12" src="/stopattrs/flag-not.svg" alt="Sem identificação" />
						</div>
					{/if}
					{#if stop?.has_schedules === false || (stop?.has_schedules !== true && stop?.has_outdated_info === true)}
						<div class="tooltip" data-tip="Sem horários atualizados">
							<img class="h-12" src="/stopattrs/schedules-not.svg" alt="Sem horários atualizados" />
						</div>
					{/if}
					{#if stop?.has_sidewalk === false}
						<div class="tooltip z-[10000]" data-tip="Sem passeio">
							<img class="h-12" src="/stopattrs/sidewalk-not.svg" alt="Sem passeio" />
						</div>
					{/if}
					{#if stop?.has_shelter === false}
						<div class="tooltip" data-tip="Sem abrigo">
							<img class="h-12" src="/stopattrs/shelter-not.svg" alt="Sem abrigo" />
						</div>
					{/if}
					{#if stop?.has_bench === false}
						<div class="tooltip" data-tip="Sem banco">
							<img class="h-12" src="/stopattrs/bench-not.svg" alt="Sem banco" />
						</div>
					{/if}
					{#if stop?.has_trash_can === false}
						<div class="tooltip" data-tip="Sem balde do lixo">
							<img class="h-12" src="/stopattrs/garbage-not.svg" alt="Sem balde do lixo" />
						</div>
					{/if}
					{#if stop?.has_visibility_from_area === false}
						<div class="tooltip" data-tip="Sem visibilidade">
							<img class="h-12" src="/stopattrs/visibility-not.svg" alt="Sem visibilidade" />
						</div>
					{/if}
					{#if stop?.has_visibility_from_within === false}
						<div class="tooltip" data-tip="Sem visibilidade exterior">
							<img
								class="h-12"
								src="/stopattrs/visibility-within-not.svg"
								alt="Sem visibilidade exterior"
							/>
						</div>
					{/if}
					{#if stop?.is_visible_from_outside === false}
						<div class="tooltip" data-tip="Difícil visibilidade para o motorista">
							<img
								class="h-12"
								src="/stopattrs/visible-not.svg"
								alt="Difícil visibilidade para o motorista"
							/>
						</div>
					{/if}
				</div>
				<span class="text-lg font-bold -mt-1 sm:-mb-3 text-center w-full">Linhas</span>
				<RouteListing
					{selectedRoutes}
					on:openroute
					on:openschedule
					on:openinfo
					on:hint
					on:drophint
				/>
				<span class="text-lg font-bold -mt-1 text-center w-full">Atributos</span>
				<div class="flex flex-wrap gap-1 pl-2 pr-2 sm:pl-4 sm:pr-3">
					{#if stop?.has_flag === true}
						<div class="tooltip z-[10000]" data-tip="Identificada">
							<img class="h-12" src="/stopattrs/flag.svg" alt="Identificada" />
						</div>
					{/if}
					{#if stop?.has_schedules === true}
						<div class="tooltip" data-tip="Horários">
							<img class="h-12" src="/stopattrs/schedules.svg" alt="Horários" />
						</div>
					{/if}
					{#if stop?.has_sidewalk === true}
						<div class="tooltip" data-tip="Passeio">
							<img class="h-12" src="/stopattrs/sidewalk.svg" alt="Passeio" />
						</div>
					{/if}
					{#if stop?.has_shelter === true}
						<div class="tooltip" data-tip="Abrigo">
							<img class="h-12" src="/stopattrs/shelter.svg" alt="Abrigo" />
						</div>
					{/if}
					{#if stop?.has_bench === true}
						<div class="tooltip" data-tip="Banco">
							<img class="h-12" src="/stopattrs/bench.svg" alt="Banco" />
						</div>
					{/if}
					{#if stop?.has_trash_can === true}
						<div class="tooltip" data-tip="Balde do Lixo">
							<img class="h-12" src="/stopattrs/garbage.svg" alt="Balde do Lixo" />
						</div>
					{/if}
					{#if stop?.has_visibility_from_area === true}
						<div class="tooltip" data-tip="Visibilidade">
							<img class="h-12" src="/stopattrs/visibility.svg" alt="Visibilidade" />
						</div>
					{/if}
					{#if stop?.has_visibility_from_within === true}
						<div class="tooltip" data-tip="Visibilidade exterior">
							<img
								class="h-12"
								src="/stopattrs/visibility-within.svg"
								alt="Visibilidade exterior"
							/>
						</div>
					{/if}
					{#if stop?.is_visible_from_outside === true}
						<div class="tooltip" data-tip="Facilmente visível pelo motorista">
							<img
								class="h-12"
								src="/stopattrs/visible.svg"
								alt="Facilmente visível pelo motorista"
							/>
						</div>
					{/if}
				</div>
				<!-- <a class="text-xs text-right mr-2 link link-primary" href="#">O que são estes atributos?</a> -->
				{#if $pictures?.length > 1}
					<span class="text-lg font-bold -mt-1 text-center w-full">Fotografias</span>
					<div class="grid grid-cols-2">
						{#each $pictures.slice(1, 5) as picture (picture.id)}
							{#if !picture.tagged}
								<div class="p-1 flex justify-center items-center cursor-pointer">
									<img
										src={$pictures[0].url_medium}
										class="rounded-lg transition-all hover:scale-105"
										on:click={() => openPic(picture)}
										on:keypress={() => openPic(picture)}
										alt="Fotografia da paragem"
									/>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
				<span class="grow"></span>
				<a class="btn btn-outline btn-primary rounded-full m-2" href="/paragens/{stop?.id}">
					Mais informações
				</a>
			</div>
		</div>
	</div>
{/if}
<dialog bind:this={picDialogElem} id="pic-dialog" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box !max-w-full overflow-hidden">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-error">✕</button>
		</form>
		<a href={openedPic?.url_full}>
			<img
				id="pic-dialog-img"
				alt="Fotografia de paragem"
				class="max-h-full max-w-full"
				src={openedPic?.url_full}
			/>
		</a>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>

<style>
	.scrollbar-fix {
		scrollbar-width: auto !important;
	}
</style>
