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
	import { page } from '$app/stores';
	import Menu from '$lib/components/Menu.svelte';
	import '../app.css';
</script>


<div
	class="w-[min(960px,100%)] mx-auto p-2 pb-4 xl:pt-4   self-center"
    class:absolute={$page.data.floatingMenu || false}
    class:top-0={$page.data.floatingMenu || false}
    class:z-[3000]={$page.data.floatingMenu || false}
>
	<Menu />
</div>

<slot />
