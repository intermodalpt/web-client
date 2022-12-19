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

	export let operatorTag;
	export let route;
</script>

<div class="tabs mx-auto w-full mb-4">
	<a
		href="/servicos/{operatorTag}/{route.id}/informacao"
		class={`tab tab-lg tab-bordered`}
		class:tab-active={$page.url.pathname.endsWith('informacao')}>Informação</a
	>
	<a
		href="/servicos/{operatorTag}/{route.id}/horario"
		class={`tab tab-lg tab-bordered`}
		class:tab-active={$page.url.pathname.endsWith('horario')}>Horário</a
	>
	<a
		href="/servicos/{operatorTag}/{route.id}/percurso"
		class={`tab tab-lg tab-bordered`}
		class:tab-active={$page.url.pathname.endsWith('percurso')}>Percurso</a
	>
	<a
		href="/servicos/{operatorTag}/{route.id}/paragens"
		class={`tab tab-lg tab-bordered`}
		class:tab-active={$page.url.pathname.endsWith('paragens')}>Paragens</a
	>
	<a
		href="/servicos/{operatorTag}/{route.id}/assistencia"
		class={`tab tab-lg tab-bordered`}
		class:tab-active={$page.url.pathname.endsWith('assistencia')}>Assistência</a
	>
</div>
