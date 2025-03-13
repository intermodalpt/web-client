<!-- Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2025  Cláudio Pereira

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
	import { page } from '$app/state';
	import {
		routeInfoWithinRegionUrl,
		routePathWithinRegionUrl,
		routeScheduleWithinRegionUrl,
		routeStopsWithinRegionUrl
	} from '$lib/urls';

	let { region, operator, route } = $props();
</script>

<div role="tablist" class="tabs tabs-border mb-4">
	<a
		href={routeInfoWithinRegionUrl(region, operator, route)}
		class="tab tab-lg"
		class:tab-active={page.url.pathname.endsWith('informacao')}>Informação</a
	>
	<a
		href={routeScheduleWithinRegionUrl(region, operator, route)}
		class="tab tab-lg"
		class:tab-active={page.url.pathname.endsWith('horario')}>Horário</a
	>
	<a
		href={routePathWithinRegionUrl(region, operator, route)}
		class="tab tab-lg"
		class:tab-active={page.url.pathname.endsWith('percurso')}>Percurso</a
	>
	<a
		href={routeStopsWithinRegionUrl(region, operator, route)}
		class="tab tab-lg"
		class:tab-active={page.url.pathname.endsWith('paragens')}>Paragens</a
	>
</div>
