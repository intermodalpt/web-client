<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024 - 2025  Cláudio Pereira

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
<script lang="ts">
	import { page, navigating } from '$app/state';
	import { selectedRegion } from '$lib/db';
	import DbLoadingInfo from '$lib/components/DbLoadingInfo.svelte';
	import RegionPicker from '$lib/components/RegionPicker.svelte';
	import globe from '$lib/icons/ui/globe.svg';
	import logoText from '$lib/icons/logo-text.svg';
	import '../app.css';

	let { children } = $props();

	let regDialog: HTMLDialogElement;
	let renderDialogMap = $state(false);

	let drawerToggle: HTMLInputElement;

	function closeDrawer() {
		if (drawerToggle) {
			drawerToggle.checked = false;
		}
	}
</script>

<svelte:head>
	<title>{'Intermodal - ' + (page.data.title ?? 'Mobilidade amplificada')}</title>
	<meta name="title" content={'Intermodal - ' + (page.data.title ?? 'Mobilidade amplificada')} />
	<meta
		property="og:title"
		content={'Intermodal - ' + (page.data.title ?? 'Mobilidade amplificada')}
	/>
	<meta
		property="twitter:title"
		content={'Intermodal - ' + (page.data.title ?? 'Mobilidade amplificada')}
	/>
	<meta
		name="description"
		content={page.data.description ?? 'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
	<meta
		property="og:description"
		content={page.data.description ?? 'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
	<meta
		property="twitter:description"
		content={page.data.description ?? 'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
</svelte:head>

<div class="drawer grow">
	<input bind:this={drawerToggle} id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div
			class={[
				'w-[min(960px,100%)] mx-auto p-0 pb-4 lg:px-0 xl:pt-4 self-center',
				page.data.floatingMenu && 'absolute top-0 z-3000',
				page.data.noMenu && 'hidden'
			]}
		>
			<div
				class="navbar bg-base-100 sm:rounded-xl"
				class:shadow-md={page.data.floatingMenu}
				class:shadow-sm={!page.data.floatingMenu}
			>
				<div class="navbar-start">
					<div>
						<label for="drawer" class="btn btn-ghost drawer-button lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</label>
					</div>
					<a class="btn btn-lg btn-ghost hover:bg-zinc-100 border-0" href="/">
						<img src={logoText} class="h-8 max-w-[60vw]" alt="Início,Logotipo" />
					</a>
				</div>
				<div class="navbar-end hidden lg:flex">
					<ul class="menu menu-horizontal p-0 gap-3">
						<li>
							{#if $selectedRegion}
								<a
									href="/rede"
									class="p-3"
									class:menu-active={page.url.pathname.startsWith('/rede')}>Mapa</a
								>
							{:else}
								<button
									class="p-3"
									onclick={() => regDialog.showModal()}
									onkeypress={() => regDialog.showModal()}>Mapa</button
								>
							{/if}
						</li>
						<li>
							<a
								href="/regiao"
								class="p-3"
								class:menu-active={page.url.pathname.startsWith('/regiao')}>Região</a
							>
						</li>
						<li>
							<a href="/edu" class="p-3" class:menu-active={page.url.pathname.startsWith('/edu')}>
								Educação
							</a>
						</li>
						<li>
							<button
								class="btn bg-base-200 hover:bg-base-300 border-0 h-full flex relative"
								aria-label="Escolher região"
								onclick={() => {
									regDialog.showModal();
									renderDialogMap = true;
								}}
							>
								<img src={globe} alt="Escolher região" />
								{#if !$selectedRegion}
									<div aria-label="success" class="absolute top-1 left-1 status status-error"></div>
								{/if}
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
		{@render children()}
	</div>
	<div class="drawer-side z-10000">
		<label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
			<li><a href="/rede" onclick={closeDrawer}>Mapa</a></li>
			<li><a href="/regiao" onclick={closeDrawer}>Região</a></li>
			<li><a href="/edu" onclick={closeDrawer}>Educação</a></li>
			<span class="grow"></span>
			<button
				class="flex flex-col bg-base-300 hover:bg-base-100 p-4 rounded-xl mb-3"
				onclick={() => {
					regDialog.showModal();
					renderDialogMap = true;
				}}
			>
				<div class="flex gap-2">
					<img src={globe} alt="Escolher região" />
					<span>Região</span>
				</div>
				{#if $selectedRegion}
					<span class="font-bold">{$selectedRegion?.name}</span>
				{:else}
					<span class="font-bold">Sem região escolhida</span>
				{/if}
			</button>

			<label for="drawer" class="btn btn-error"> Fechar menu </label>
		</ul>
	</div>
</div>
<dialog
	id="regdialog"
	bind:this={regDialog}
	class="modal modal-bottom sm:modal-middle"
	onclose={() => (renderDialogMap = false)}
>
	<div class="modal-box max-w-[60em]!">
		{#if $selectedRegion}
			<h2 class="text-lg font-bold">Região atual</h2>
			<span class="ml-2">{$selectedRegion?.name}</span>
			<h2 class="text-lg font-bold mt-2">Alterar região</h2>
		{:else}
			<h2 class="text-lg font-bold text-center">Escolha a sua região</h2>
		{/if}
		{#if renderDialogMap}
			<RegionPicker />
		{/if}
		<!-- <div class="flex justify-between max-w-64">
			<span class="text-lg font-bold">Lingua</span>
			<span class="font-bold">[Português]</span>
		</div> -->
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

{#if navigating.to}
	<div
		class="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 flex items-end justify-end p-8"
	>
		<span class="loading loading-spinner text-primary loading-lg"></span>
	</div>
{/if}

{#if page.url.searchParams.get('debug')}
	<DbLoadingInfo />
{/if}
