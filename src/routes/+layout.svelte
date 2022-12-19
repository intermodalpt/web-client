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
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import '../app.css';

	let ddopen = writable(false);
	let ddClasses = writable('hidden');
	function toggleDD(delay = 0) {
		function doToggle() {
			$ddopen = !$ddopen;
			$ddClasses = 'absolute scale-95 opacity-10';
			tick();
			if (!$ddopen) {
				setTimeout(() => ($ddClasses = 'hidden'), 150);
			} else {
				setTimeout(() => ($ddClasses = $ddopen ? 'absolute' : 'absolute scale-95'), 1);
			}
		}
		if (delay === 0) {
			doToggle();
		} else {
			setTimeout(() => {
				doToggle();
			}, delay);
		}
	}
</script>

<div
	class="w-[min(960px,100%)] mx-auto p-2 pb-4 xl:pt-4"
	class:z-[3000]={$page.url.pathname.endsWith('rede')}
>
	<div class="navbar bg-base-100 shadow-lg rounded-xl">
		<div class="navbar-start">
			<div class="">
				<span class="btn btn-ghost lg:hidden" on:click={() => toggleDD(0)}>
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
				</span>
				<ul
					class="menu menu-compact mt-3 p-2 dropdown-content shadow bg-base-100 rounded-box w-52 duration-200 transition-all {$ddClasses}"
					on:click={() => toggleDD(150)}
				>
					<li><a href="/rede">Rede</a></li>
					<li><a href="/servicos">Serviços</a></li>
					<li><a href="/avisos">Avisos</a></li>
					<li><a href="/faq">Questões</a></li>
					<li><a href="/sobre">Sobre</a></li>
				</ul>
			</div>
			<a class="btn btn-ghost normal-case text-xl md:text-3xl text-primary" href="/">
				<img src="/logo.svg" class="w-8 pr-1" alt="Início,Logo Intermodal" />
				<span class="text-[#59befe]">inter</span>
				<span class="text-[#006d99]">modal</span>
			</a>
		</div>
		<div class="navbar-end hidden lg:flex">
			<ul class="menu menu-horizontal p-0">
				<li>
					<a
						href="/rede"
						class={$page.url.pathname.startsWith('/rede')
							? 'bg-primary text-primary-content rounded-lg'
							: 'rounded-lg'}>Rede</a
					>
				</li>
				<li>
					<a
						href="/servicos"
						class={$page.url.pathname.startsWith('/servicos')
							? 'bg-primary text-primary-content rounded-lg'
							: 'rounded-lg'}>Serviços</a
					>
				</li>
				<li>
					<a
						href="/avisos"
						class={$page.url.pathname.startsWith('/avisos')
							? 'bg-primary text-primary-content rounded-lg'
							: 'rounded-lg'}>Avisos</a
					>
				</li>
				<li>
					<a
						href="/faq"
						class={$page.url.pathname.startsWith('/faq')
							? 'bg-primary text-primary-content rounded-lg'
							: 'rounded-lg'}>Questões</a
					>
				</li>
				<li>
					<a
						href="/sobre"
						class={$page.url.pathname.startsWith('/sobre')
							? 'bg-primary text-primary-content rounded-lg'
							: 'rounded-lg'}>Sobre</a
					>
				</li>
			</ul>
		</div>
	</div>
</div>

<div class="w-[min(960px,100%)] mx-auto">
	<slot />
</div>
