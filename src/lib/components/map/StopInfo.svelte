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
	import StopAttrs from '$lib/components/StopAttrs.svelte';
	import picturePlaceholder from '$lib/icons/picture.svg';

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
							.url_medium}'), url({picturePlaceholder}); background-size: cover, contain;"
					/>
				</button>
			{/if}
			<div class="flex flex-col grow py-2">
				<div class="px-2 sm:px-2">
					<StopAttrs {stop} showSecondary={false} />
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
				<div class="px-2 sm:px-2">
					<StopAttrs {stop} showPrimary={false} />
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
				<span class="grow" />
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
