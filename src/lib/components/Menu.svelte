<script>
	import { writable } from 'svelte/store';
	import { tick } from 'svelte';
	import { page } from '$app/stores';

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


<div class="navbar bg-base-100 shadow-md rounded-xl">
	<div class="navbar-start">
		<div>
			<span
				class="btn btn-ghost lg:hidden"
				on:click={() => toggleDD(0)}
				on:keypress={() => toggleDD(0)}
			>
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
				class="menu menu-compact mt-3 p-2 dropdown-content shadow bg-base-100 rounded-box w-52 duration-200 transition-all z-[100000] {$ddClasses}"
				on:click={() => toggleDD(150)}
				on:keypress={() => toggleDD(150)}
			>
				<li><a href="/rede">Mapa</a></li>
				<li><a href="/servicos">Serviços</a></li>
				<li><a href="/avisos">Avisos</a></li>
			</ul>
		</div>
		<a class="btn btn-ghost" href="/">
			<img src="/logo-text.svg" class="h-8 max-w-[60vw]" alt="Início,Logotipo" />
		</a>
	</div>
	<div class="navbar-end hidden lg:flex">
		<ul class="menu menu-horizontal p-0 gap-3">
			<li>
				<a
					href="/rede"
					class="p-3"
					class:active={$page.url.pathname.startsWith('/rede')}>Mapa</a>
			</li>
			<li>
				<a
					href="/servicos"
					class="p-3"
					class:active={$page.url.pathname.startsWith('/servicos')}>Serviços</a>
			</li>
			<li>
				<a
					href="/avisos"
					class="p-3"
					class:active={$page.url.pathname.startsWith('/avisos')}>Avisos</a>
			</li>
		</ul>
	</div>
</div>
