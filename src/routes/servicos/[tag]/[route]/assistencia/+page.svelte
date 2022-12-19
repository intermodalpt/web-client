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
	import RouteIllustration from '$lib/components/RouteIllustration.svelte';
	import RouteMenu from '$lib/components/RouteMenu.svelte';
	import RouteTitle from '$lib/components/RouteTitle.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const operator = data.operator;
	const route = data.route;
</script>

<div class="card bg-base-100 shadow-xl mx-2">
	<div class="card-body -mt-6">
		<div class="breadcrumbs">
			<ul>
				<li>
					<a href="/servicos" class="btn btn-ghost btn-xs text-primary">Operadoras</a>
				</li>
				<li>
					<a href="/servicos/{operator.tag}" class="btn btn-ghost btn-xs text-primary">
						{operator.name}
					</a>
				</li>
				<li>
					<a href="/servicos/{operator.tag}/assistencia" class="btn btn-ghost btn-xs text-primary">
						Assistência
					</a>
				</li>
			</ul>
		</div>
		<RouteIllustration {operator} />
		<div class="overflow-x-auto">
			<RouteTitle {route} />
			<RouteMenu operatorTag={operator.tag} {route} />

			<p class="text-lg">
				Ainda estamos a trabalhar nestas funcionalidades.<br />
				Esperamos tê-las prontas para si e para os seus num futuro próximo.
			</p>
			<div class="flex justify-between">
				<img src="/icons/audio.svg" class="w-64" />
				<img src="/icons/video.svg" class="w-64" />
				<img src="/icons/audiovisual.svg" class="w-64" />
			</div>
		</div>
	</div>
</div>
