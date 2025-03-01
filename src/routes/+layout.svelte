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
	import { page } from '$app/stores';
	import { selectedRegion } from '$lib/db';
	import DbLoadingInfo from '$lib/components/DbLoadingInfo.svelte';
	import RegionPicker from '$lib/components/RegionPicker.svelte';
	import globe from '$lib/icons/ui/globe.svg';
	import logoText from '$lib/icons/logo-text.svg';
	import '../app.css';

	let regDialog;
	let renderDialogMap = false;

	function closeDrawer() {
		document.getElementById('drawer').checked = false;
	}
</script>

<svelte:head>
	<title>{'Intermodal - ' + $page.data.title ?? 'Mobilidade amplificada'}</title>
	<meta name="title" content={'Intermodal - ' + $page.data.title ?? 'Mobilidade amplificada'} />
	<meta
		property="og:title"
		content={'Intermodal - ' + $page.data.title ?? 'Mobilidade amplificada'}
	/>
	<meta
		property="twitter:title"
		content={'Intermodal - ' + $page.data.title ?? 'Mobilidade amplificada'}
	/>
	<meta
		name="description"
		content={$page.data.description ??
			'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
	<meta
		property="og:description"
		content={$page.data.description ??
			'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
	<meta
		property="twitter:description"
		content={$page.data.description ??
			'A plataforma para a mobilidade. Informação na palma da mão.'}
	/>
</svelte:head>

<div class="drawer grow">
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div
			class="w-[min(960px,100%)] mx-auto p-0 pb-4 lg:px-0 xl:pt-4 self-center"
			class:absolute={$page.data.floatingMenu || false}
			class:top-0={$page.data.floatingMenu || false}
			class:z-[3000]={$page.data.floatingMenu || false}
		>
			<div
				class="navbar bg-base-100 sm:rounded-xl"
				class:shadow-md={$page.data.floatingMenu}
				class:shadow-sm={!$page.data.floatingMenu}
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
					<a class="btn btn-ghost hover:bg-zinc-100" href="/">
						<img src={logoText} class="h-8 max-w-[60vw]" alt="Início,Logotipo" />
					</a>
				</div>
				<div class="navbar-end hidden lg:flex">
					<ul class="menu menu-horizontal p-0 gap-3">
						{#if $selectedRegion}
							<li>
								<a href="/rede" class="p-3" class:active={$page.url.pathname.startsWith('/rede')}
									>Mapa</a
								>
							</li>
						{/if}
						<li>
							<a href="/regiao" class="p-3" class:active={$page.url.pathname.startsWith('/regiao')}
								>Região</a
							>
						</li>
						<li>
							<a href="/edu" class="p-3" class:active={$page.url.pathname.startsWith('/edu')}>
								Educação
							</a>
						</li>
						<li>
							<button
								class="bg-base-200 border h-full flex"
								aria-label="Escolher região"
								on:click={() => {
									regDialog.showModal();
									renderDialogMap = true;
								}}
							>
								<img src={globe} alt="Escolher região" />
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<slot />
	</div>
	<div class="drawer-side z-[10000]">
		<label for="drawer" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
			<li><a href="/rede" on:click={closeDrawer} on:keypress={closeDrawer}>Mapa</a></li>
			<li><a href="/regiao" on:click={closeDrawer} on:keypress={closeDrawer}>Região</a></li>
			<li><a href="/edu" on:click={closeDrawer} on:keypress={closeDrawer}>Educação</a></li>
			<span class="grow" />
			<button
				class="flex flex-col bg-base-300 hover:bg-base-100 p-4 rounded-xl mb-3"
				on:click={() => {
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
	on:close={() => {
		renderDialogMap = false;
	}}
>
	<div class="modal-box !max-w-[60em]">
		<h2 class="text-lg font-bold text-center">Escolha a sua região</h2>
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

<DbLoadingInfo />
