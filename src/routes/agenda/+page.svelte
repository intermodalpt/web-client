<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024  Cláudio Pereira

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
	import { onMount, onDestroy } from 'svelte';
	import { Map as Maplibre, NavigationControl, Marker, Popup } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { tileStyle } from '$lib/settings.js';

	let mapElem;
	let map;

	const events = [
		{
			title: 'Festa do Software Livre 2024',
			date: '11 a 12 de Outubro, 2024',
			jsDate: new Date('2024-10-12'),
			fields: ['Comunidade', 'Direitos digitais'],
			location: 'Aveiro',
			url: 'https://festa2024.softwarelivre.eu/',
			coords: [-8.657, 40.63]
		},
		{
			title: 'Jornadas Ibéricas pela Ferrovia',
			date: '11 a 12 de Maio, 2024',
			jsDate: new Date('2024-05-12'),
			fields: ['Mobilidade'],
			location: 'Lisboa',
			url: 'https://zero.ong/eventos/jornadas-ibericas-pela-ferrovia/'
		},
		{
			title: 'OpenKnowledge Braga 2024',
			date: '24 de Março, 2024',
			jsDate: new Date('2024-03-24'),
			fields: ['Comunidade'],
			location: 'Braga',
			url: 'https://pt.m.wikimedia.org/wiki/Open_Knowledge_Braga_2024'
		},
		{
			title: 'Digital Rights Drinks',
			date: '1ª Sexta-feira, todos os meses, 19h00',
			fields: ['Comunidade', 'Direitos digitais'],
			location: 'Lisboa',
			coords: [-9.1442, 38.7395]
		},
		{
			title: 'Dia da Internet 2024',
			date: '17 de Maio, 2024',
			jsDate: new Date('2024-05-17'),
			fields: ['Direitos digitais'],
			location: 'Lisboa',
			url: 'https://pt.wikimedia.org/wiki/Dia_da_Internet_2024',
			coords: [-9.149, 38.7283]
		},
		{
			title: 'Meetup Makers in Little Lisbon',
			date: '2ª Quarta-feira, todos os meses, 19h00',
			fields: ['Comunidade', 'Engenharia', 'Arte'],
			location: 'Lisboa',
			url: 'https://mill.pt/agenda/meetup-tech-art-lisboa-26/',
			coords: [-9.14103, 38.72041]
		},
		{
			title: 'Geomob',
			date: '8 de Maio, 2024',
			jsDate: new Date('2024-05-08'),
			fields: ['Comunidade', 'Engenharia'],
			location: 'Lisboa',
			url: 'https://geomoblisbon.com/'
		},
		{
			title: 'Kidical Mass',
			date: 'Por localização',
			fields: ['Comunidade', 'Mobilidade'],
			location: 'Nacional',
			url: 'https://kidicalmass.pt/'
		},
		{
			title: 'TMOB Hub',
			date: '3 de Julho, 2024',
			jsDate: new Date('2024-07-03'),
			fields: ['Mobilidade'],
			location: 'Braga',
			url: 'https://tmob-hub.pt/',
			coords: [-8.3972, 41.5614]
		}
	];

	events.sort((a, b) => {
		if (a.jsDate && b.jsDate) {
			return b.jsDate - a.jsDate;
		}
		return 0;
	});

	const today = new Date();

	const upcomingEvents = events.filter((event) => {
		if (event.jsDate) {
			return !event.jsDate || event.jsDate >= today;
		}
		return true;
	});

	const pastEvents = events.filter((event) => {
		if (event.jsDate) {
			return event.jsDate < today;
		}
		return false;
	});

	const fieldColorClass = {
		Comunidade: 'bg-lime-400',
		'Direitos digitais': 'bg-rose-400',
		Mobilidade: 'bg-blue-400',
		Engenharia: 'bg-cyan-400',
		Arte: 'bg-violet-400'
	};

	const DEFAULT_BOUNDS = [
		[-18, 36.5],
		[0, 42.35]
	];

	onMount(() => {
		map = new Maplibre({
			container: mapElem,
			style: tileStyle,
			minZoom: 2,
			zoom: 3,
			maxBounds: DEFAULT_BOUNDS,
			center: [-9.1333, 38.7167]
		});

		map.addControl(new NavigationControl(), 'top-right');

		map.on('load', () => {
			for (const event of events) {
				if (event.coords) {
					const popup = new Popup({ offset: 25 }).setText(event.title);
					new Marker().setLngLat(event.coords).setPopup(popup).addTo(map);
				}
			}
		});
	});

	onDestroy(() => {
		map.remove();
	});
</script>

<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<div class="breadcrumbs -mt-6">
			<ul>
				<li>
					<a href="/" class="btn btn-ghost btn-xs text-primary">Início</a>
				</li>
				<li>
					<a href="/agenda" class="btn btn-ghost btn-xs text-primary">Agenda</a>
				</li>
			</ul>
		</div>
		<h2 class="card-title">Próximos Eventos</h2>
		<div class="flex flex-wrap">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
				{#each upcomingEvents as event}
					<a class="card border-2 border-base-200 hover:bg-zinc-50" href={event.url || '#'}>
						<div class="card-body">
							<h2 class="card-title">{event.title}</h2>
							<p>{event.date}</p>
							<div class="flex flex-wrap gap-2">
								{#each event.fields as field}
									<div class="badge {fieldColorClass[field]}">{field}</div>
								{/each}
								<div class="badge border-yellow-500 badge-outline bg-white">{event.location}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

<div bind:this={mapElem} class="h-96 rounded-xl shadow-sm" />

<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<h2 class="card-title">Eventos Passados</h2>
		<div class="flex flex-wrap">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full opacity-75">
				{#each pastEvents as event}
					<a class="card border-2 border-base-200 hover:bg-zinc-50" href={event.url || '#'}>
						<div class="card-body">
							<h2 class="card-title">{event.title}</h2>
							<p>{event.date}</p>
							<div class="flex flex-wrap gap-2">
								{#each event.fields as field}
									<div class="badge {fieldColorClass[field]}">{field}</div>
								{/each}
								<div class="badge border-yellow-500 badge-outline bg-white">{event.location}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
		<h2 class="card-title">Em falta?</h2>
		<p>Agradecemos que nos mandes mensagem. Sem ti não temos como saber de tudo. 😊</p>
	</div>
</div>
