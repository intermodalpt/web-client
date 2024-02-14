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
	import { operatorsWithIcons, operatorsWithMinIcons } from '$lib/settings.js';

	export let operator;
</script>

<div class="w-full flex flex-col sm:flex-row gap-4">
	{#if operatorsWithIcons.has(operator.id)}
		<img
			class="h-full max-w-16"
			src="/operators/{operator.tag}/logo{operatorsWithMinIcons.has(operator.id) ? '-min' : ''}.svg"
		/>
	{/if}
	<div class="flex justify">
		<span class="text-2xl font-bold">{operator.name}</span>
	</div>
</div>
