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
	export let route;
</script>

<div class="title-sr-pair text-3xl">
	<span
		class="code"
		style="
			background-color: {route.badge_bg};
			color: {route.badge_text};
			border: 2px solid {route.badge_text};"
	>
		{route.code}
	</span>
	<span class="title">{route.name}</span>
</div>

<style>
	.code {
		border-radius: 32px;
		font-weight: bold;
		color: white;
		background-color: darkred;
		padding: 0.1em 0.3em;
		display: inline-block;
	}
</style>
