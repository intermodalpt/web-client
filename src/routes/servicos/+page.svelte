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
</script>

<div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] mx-2">
	{#each Object.values(operators) as op}
		<a class="card bg-base-100 shadow-lg cursor-pointer" href="/servicos/{op.tag}">
			<div class="rounded-xl aspect-[3.6] {op.tag}" />
		</a>
	{/each}
</div>
