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
	import { operators } from '$lib/stores.js';

	export let onEnter, onUnfocus, onFocus, onLeave, gotoRoute, gotoInfo, gotoSchedule;
	export let route;
	let open = false;

	const minifiedLogos = {
		1: 'cmet-min',
		2: 'tcb',
		3: 'carris-min',
		4: 'mobic-min',
		5: 'cp-min',
		6: 'fertagus-min',
		7: 'mts-min',
		8: 'ml',
		9: 'ttsl'
	};
</script>

<div
	tabindex="0"
	on:focusin={() => {
		open = true;
		onFocus(route.id);
	}}
	on:focusout={() => {
		open = false;
		onUnfocus(route.id);
	}}
>
	<div
		class="cursor-pointer flex flex-row items-center p-1 gap-1 sm:gap-2  bg-base-100 hover:bg-base-300 rounded-full"
		on:mouseenter={() => onEnter(route.id)}
		on:mouseleave={() => onLeave(route.id)}
	>
		<div
			class="flex flex-row items-center rounded-full  border-base-content shrink-0 bg-base-100"
			style:border="2px solid {route.badge_text}"
		>
			<img
				class="ml-1 w-7 px-[2px]"
				src="/logos/{minifiedLogos[route.operator]}.svg"
				alt={operators[route.operator].name}
			/>
			<div
				class="rounded-full px-2 py-1 -my-[2px] -mr-[2px] text-lg"
				style:background-color={route.badge_bg}
				style:color={route.badge_text}
				style:border="2px solid {route.badge_text}"
			>
				{route.code}
			</div>
		</div>
		{#if route.name.split(' - ').length === 2}
			<div>
				<span>{route.name.split(' - ')[0]}</span><br />
				<span>{route.name.split(' - ')[1]}</span>
			</div>
		{:else}
			<div>{route.name}</div>
		{/if}
	</div>
	<div class="overflow-hidden max-w-xs mx-auto">
		<div class="transition-all flex justify-between max-w-lg gap-4 h-20 {open ? '' : '-mt-20'}">
			<div
				class="flex flex-col items-center cursor-pointer"
				on:click={() => gotoRoute(route.id)}
				on:keypress={() => gotoRoute(route.id)}
			>
				<img class="w-10" src="/icons/route.svg" alt="Percurso" />
				<span class="text-lg">Percurso</span>
			</div>
			<div
				class="flex flex-col items-center cursor-pointer"
				on:click={() => gotoSchedule(route.id)}
				on:keypress={() => gotoSchedule(route.id)}
			>
				<img class="w-10" src="/icons/time.svg" alt="Horário" />
				<span class="text-lg">Horário</span>
			</div>
			<div
				class="flex flex-col items-center cursor-pointer"
				on:click={() => gotoInfo(route.id)}
				on:keypress={() => gotoInfo(route.id)}
			>
				<img class="w-10" src="/icons/info.svg" alt="Informação" />
				<span class="text-lg">Informação</span>
			</div>
		</div>
	</div>
</div>
<hr class="sm:-mt-1 sm:-mb-1 ml-6 mr-6" />
