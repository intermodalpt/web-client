<!-- Intermodal, transportation information aggregator
    Copyright (C) 2024 - 2025  Cláudio Pereira

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
	import maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { tileStyle } from '$lib/settings.js';

	let mapElem;
	let map;

	const events = [
		{
			title: 'Geomob',
			date: '19 de Março, 2025',
			jsDate: new Date('2025-03-19'),
			fields: ['Comunidade', 'Engenharia'],
			location: 'Lisboa',
			url: 'https://geomoblisbon.com/',
			coords: [-9.13647, 38.70999]
		},
		{
			title: 'Open Night, Laboratório de Criação Digital',
			date: 'Terças, 20h25',
			fields: ['Comunidade', 'Engenharia', 'Arte'],
			location: 'Porto',
			url: 'https://lcdporto.org/event/open-lcd-night/',
			coords: [-8.6145, 41.18582]
		},
		{
			title: 'Meetup, Makers in Little Lisbon',
			date: '2ª Quarta do mês, 19h00',
			fields: ['Comunidade', 'Engenharia', 'Arte'],
			location: 'Lisboa',
			url: 'https://mill.pt/agenda/meetup-tech-art-lisboa-26/',
			coords: [-9.14103, 38.72041]
		},
		{
			title: 'Massa Critica Porto',
			date: 'Última Sexta do mês, 18h30',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Porto',
			url: 'https://massacriticaporto.org/',
			coords: [-8.60444, 41.16119]
		},
		{
			title: 'Massa Critica Coimbra',
			date: 'Última Sexta do mês, 18h',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Coimbra',
			url: 'https://massacriticapt.net/',
			coords: [-8.60444, 41.16119]
		},
		{
			title: 'Massa Critica Lisboa',
			date: 'Última Sexta do mês, 18h30',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Lisboa',
			url: 'https://massacriticapt.net/',
			coords: [-8.60444, 41.16119]
		},
		{
			title: 'Massa Critica Almada',
			date: 'Primeira Sexta do mês, 19h30',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Almada',
			url: 'https://massacriticapt.net/',
			coords: [-9.14655, 38.68805]
		},
		{
			title: 'Bicicletada de Sta. Iria de Azóia',
			date: 'Primeiro Domingo do mês, 10h',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Loures',
			url: 'https://massacriticapt.net/',
			coords: [-9.09196, 38.83716]
		},
		{
			title: 'Kidical Mass',
			date: 'Por localização',
			fields: ['Comunidade', 'Mobilidade', 'Ativismo'],
			location: 'Nacional',
			url: 'https://kidicalmass.pt/'
		},
		{
			title: 'Dia aberto das Cicloficinas',
			date: 'Por localização',
			fields: ['Comunidade', 'Mobilidade'],
			location: 'Nacional',
			url: 'https://cicloficina.pt/'
		},
		{
			title: 'Digital Rights Drinks',
			date: '1ª Sexta do mês, 19h00',
			fields: ['Comunidade', 'Ativismo', 'Direitos digitais'],
			location: 'Lisboa',
			url: 'https://ansol.org/eventos/',
			coords: [-9.1442, 38.7395]
		},
		{
			title: 'Festival de Tecnologia Popular de Setúbal',
			date: '15-16 de Março de 2025',
			jsDate: new Date('2025-03-15'),
			fields: ['Comunidade', 'Ativismo', 'Direitos digitais'],
			location: 'Setúbal',
			url: 'https://odet.pt/festival/2025/',
			coords: [-8.89587, 38.52283]
		},
		// Past
		{
			title: 'Encontro Nacional pela Justiça Climática 2025',
			date: '21-23 de Fevereiro, 2025',
			jsDate: new Date('2025-02-21'),
			fields: ['Comunidade', 'Ativismo'],
			location: 'Lisboa',
			url: 'https://justicaclimatica.pt/'
		},
		{
			title: 'Encontro Nacional pela Justiça Climática 2024',
			date: '5-7 de Abril, 2024',
			jsDate: new Date('2024-04-05'),
			fields: ['Comunidade', 'Ativismo'],
			location: 'Lisboa',
			url: 'https://justicaclimatica.pt/'
		},
		{
			title: 'Encontro Justiça Climática Braga',
			date: '8 de Fevereiro, 2025',
			jsDate: new Date('2025-02-08'),
			fields: ['Comunidade', 'Ativismo'],
			location: 'Braga',
			url: 'https://justicaclimatica.pt/2025/01/11/encontro-pela-justica-climatica-em-braga-8-de-fevereiro/'
		},
		{
			title: 'Encontro Justiça Climática Porto',
			date: '14 de Dezembro, 2024',
			jsDate: new Date('2024-12-14'),
			fields: ['Comunidade', 'Ativismo'],
			location: 'Porto',
			url: 'https://justicaclimatica.pt/2024/12/01/encontro-pela-justica-climatica-no-porto-14-de-dezembro/'
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
			title: 'TMOB Hub',
			date: '3 de Julho, 2024',
			jsDate: new Date('2024-07-03'),
			fields: ['Mobilidade'],
			location: 'Braga',
			url: 'https://tmob-hub.pt/',
			coords: [-8.3972, 41.5614]
		},
		{
			title: 'Geomob 2024',
			date: '8 de Maio, 2024',
			jsDate: new Date('2024-05-08'),
			fields: ['Comunidade', 'Engenharia'],
			location: 'Lisboa',
			url: 'https://geomoblisbon.com/',
			coords: [-9.13647, 38.70999]
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
		Comunidade: 'bg-lime-600',
		Ativismo: 'bg-yellow-600',
		'Direitos digitais': 'bg-rose-500',
		Mobilidade: 'bg-blue-500',
		Engenharia: 'bg-cyan-500',
		Arte: 'bg-violet-500'
	};

	// Next last saturday of the month (including the current day)

	const dateOptions = { day: 'numeric', month: 'long' };
	const nextFirstSaturday = (() => {
		const d = new Date();
		d.setMonth(d.getMonth() + 1);
		d.setDate(1);
		while (d.getDay() !== 6) {
			d.setDate(d.getDate() + 1);
		}
		return d;
	})();
	const nextSecondSaturday = (() => {
		const d = new Date();
		d.setMonth(d.getMonth() + 1);
		d.setDate(1);
		while (d.getDay() !== 6) {
			d.setDate(d.getDate() + 1);
		}
		d.setDate(d.getDate() + 7);
		return d;
	})();
	const nextFirstSaturdayStr = nextFirstSaturday.toLocaleDateString('pt-PT', dateOptions);
	const nextSecondSaturdayStr = nextSecondSaturday.toLocaleDateString('pt-PT', dateOptions);

	const DEFAULT_BOUNDS = [
		[-18, 36.5],
		[0, 42.35]
	];

	onMount(() => {
		map = new maplibre.Map({
			container: mapElem,
			style: tileStyle,
			minZoom: 2,
			zoom: 3,
			maxBounds: DEFAULT_BOUNDS,
			center: [-9.1333, 38.7167]
		});

		map.addControl(new maplibre.NavigationControl(), 'top-right');
		map.addControl(new maplibre.FullscreenControl(), 'top-left');

		map.on('load', () => {
			for (const event of upcomingEvents) {
				if (event.coords) {
					const popup = new maplibre.Popup({ offset: 25 }).setText(event.title);
					new maplibre.Marker().setLngLat(event.coords).setPopup(popup).addTo(map);
				}
			}
		});
	});

	onDestroy(() => {
		map.remove();
	});
</script>

<div class="card bg-base-100 w-full shadow-xs gap-4 px-2 lg:px-0">
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
		<!--<div class="grid grid-cols-1 w-full">
			<span class="card border-2 border-amber-300">
				<div class="card-body">
					<h2 class="card-title">Workshop OpenStreetMap</h2>
					<p>
						Segundo Sábado do mês <span class="text-xs">(Próximo a {nextSecondSaturdayStr})</span
						><br />
						16h00 - 18h00
					</p>
					<p>
						O OpenStreetMap é o mais detalhado mapa colaborativo do mundo e é amplamente utilizado
						tanto comunitariamente como na industria. Este workshop seguirá os seguintes pontos:
					</p>
					<ul class="list-disc ml-4">
						<li>Utilidades do OpenStreetMap</li>
						<li>Conceitos e editores</li>
						<li>Prática assistida</li>
					</ul>
					<span class="flex gap-1">
						<span>Participação gratuita mas solicitamos um pedido de inscrição enviado para</span>
						<span class="flex flex-row-reverse">
							<span>pt</span>
							<span>intermodal.</span>
							<span>@</span>
							<span>workshop</span>
						</span>
					</span>
					<div class="flex flex-wrap gap-2">
						{#each ['Comunidade', 'Mobilidade'] as field}
							<div class="badge {fieldColorClass[field]}">{field}</div>
						{/each}
						<div class="badge border-yellow-500 badge-outline bg-white">Online</div>
					</div>
				</div>
			</span>
		</div>-->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
			{#each upcomingEvents as event}
				<a class="card border-2 border-base-200 hover:bg-zinc-50" href={event.url || '#'}>
					<div class="card-body">
						<h2 class="card-title">{event.title}</h2>
						<p>{event.date}</p>
						<div class="flex flex-wrap gap-2">
							{#each event.fields as field}
								<div class="badge {fieldColorClass[field]}">
									<span class="text-white drop-shadow-xs font-bold">{field}</span>
								</div>
							{/each}
							<div class="badge border-yellow-500 badge-outline bg-white">{event.location}</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="grid grid-cols-1 w-full">
			<span class="card border-2">
				<a class="card-body" href="https://eventos.coletivos.org">
					<h2 class="card-title">Outros eventos</h2>
					<p>
						O meta-coletivo <i>coletivos.org</i> agrega eventos de interesse público no seu calendário.
						Vê se te interessam!
					</p>
					<p class="text-xs">
						(Existe um viés no espetro político dos eventos listados. Não listamos por favorecer
						ideologias, listamos porque algos eventos são relevantes)
					</p>
					<div class="flex flex-wrap gap-2">
						{#each ['Comunidade', 'Ativismo', 'Arte'] as field}
							<div class="badge {fieldColorClass[field]} text-white font-bold">{field}</div>
						{/each}
					</div>
				</a>
			</span>
		</div>
	</div>
</div>

<div bind:this={mapElem} class="h-96 rounded-xl shadow-xs" />

<div class="card bg-base-100 w-full shadow-xs gap-4 px-2 lg:px-0">
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
									<div class="badge text-white font-bold {fieldColorClass[field]}">{field}</div>
								{/each}
								<div class="badge border-yellow-500 badge-outline bg-white">{event.location}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
		<h2 class="card-title mt-6">Em falta?</h2>
		<p>Informa-nos! Sem ti não temos como saber de tudo. 😊</p>
	</div>
</div>