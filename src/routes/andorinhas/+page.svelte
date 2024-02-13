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
	import { Map as Maplibre, NavigationControl, Marker } from 'maplibre-gl';
	import { tileStyle } from '$lib/settings.js';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let map;
	let mapElem;
	let mapLoaded = false;

	const VOLUNTEERS = [
		{
			commit: ['1106', '1504', '1511'],
			watch: [
				'0807',
				'0808',
				'0810',
				'0811',
				'0814',
				'1105',
				'1107',
				'1109',
				'1110',
				'1111',
				'1114',
				'1115',
				'1116',
				'1502',
				'1503',
				'1506',
				'1507',
				'1508',
				'1510',
				'1512'
			],
			aware: [
				'0104',
				'0105',
				'0107',
				'0109',
				'0113',
				'0116',
				'0119',
				'0312',
				'0801',
				'0805',
				'1304',
				'1306',
				'1308',
				'1310',
				'1312',
				'1313',
				'1314',
				'1315',
				'1316',
				'1317',
				'1318'
			]
		},
		{
			commit: ['1107'],
			watch: [],
			aware: []
		},
		{
			commit: ['1111'],
			watch: [],
			aware: []
		},
		{
			commit: ['1512'],
			watch: [],
			aware: []
		},
		{
			commit: ['1502', '1507'],
			watch: [],
			aware: []
		}
	];

	const ANON_VOLUNTEER_LOCS = [
		[-9.043, 38.5606],
		[-9.0659, 38.6586],
		[-9.0095, 38.7276],
		[-9.1227, 38.6295],
		[-9.0095, 38.7276],
		[-9.1214, 38.9012],
		[-8.6226, 41.1512],
		[-9.0146, 38.5187]
	];

	let muns;

	const DEFAULT_BOUNDS = [
		[-16, 36.5],
		[0, 42.35]
	];

	fetch('/municipios.min.geojson')
		.then((res) => res.json())
		.then((data) => {
			muns = data;
			if (mapLoaded) {
				drawMunicipalities();
			}
		});

	function calcWatchLevels() {
		const comitted = new Set();
		const watched = new Set();
		const aware = new Set();

		VOLUNTEERS.forEach((vol) => {
			vol.commit.forEach((c) => comitted.add(c));
			vol.watch.forEach((w) => watched.add(w));
			vol.aware.forEach((a) => aware.add(a));
		});

		watched.forEach((w) => {
			if (comitted.has(w)) {
				watched.delete(w);
			}
		});

		aware.forEach((a) => {
			if (comitted.has(a) || watched.has(a)) {
				aware.delete(a);
			}
		});

		return [comitted, watched, aware];
	}
	function drawMunicipalities() {
		if (!mapLoaded) {
			return;
		}

		const [comitted, watched, aware] = calcWatchLevels();

		muns.features.forEach((mun) => {
			if (comitted.has(mun.properties['DICO'])) {
				mun.properties['care'] = 3;
			} else if (watched.has(mun.properties['DICO'])) {
				mun.properties['care'] = 2;
			} else if (aware.has(mun.properties['DICO'])) {
				mun.properties['care'] = 1;
			} else {
				mun.properties['care'] = 0;
			}
		});

		map.getSource('regions').setData(muns);
	}

	function addSourcesAndLayers() {
		map.addSource('regions', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});

		map.addLayer({
			id: 'regions-fills',
			type: 'fill',
			source: 'regions',
			layout: {},
			paint: {
				// Color should be based on the care property.
				'fill-color': [
					'case',
					['==', ['get', 'care'], 0],
					'#dd7878',
					['==', ['get', 'care'], 1],
					'#fe640b',
					['==', ['get', 'care'], 2],
					'#df8e1d',
					['==', ['get', 'care'], 3],
					'#40a02b',
					'#dd7878'
				],
				'fill-opacity': 0.5
			}
		});

		// map.addLayer({
		// 	id: 'region-labels',
		// 	type: 'symbol',
		// 	source: 'regions',
		// 	layout: {
		// 		'text-field': ['get', 'DICO'],
		// 		'text-size': 12
		// 	},
		// 	paint: {
		// 		'text-color': '#000'
		// 	}
		// });
	}

	onMount(() => {
		map = new Maplibre({
			container: mapElem,
			style: tileStyle,
			minZoom: 2,
			zoom: 3,
			maxZoom: 11,
			maxBounds: DEFAULT_BOUNDS,
			center: [-9.1333, 38.7167]
		});

		map.addControl(new NavigationControl(), 'top-right');

		map.on('load', () => {
			addSourcesAndLayers();
			mapLoaded = true;
			if (muns) {
				drawMunicipalities();
			}

			// Add markers for volunteers
			ANON_VOLUNTEER_LOCS.forEach((loc) => {
				new Marker({ opacity: 0.5, scale: 0.5 }).setLngLat(loc).addTo(map);
			});
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map.remove();
	});
</script>

<div class="flex flex-col gap-2 pt-24 bg-[#d0e9f4]">
	<div class="w-[min(960px,100%)] p-3 lg:px-0 text-sky-900 self-center flex flex-col gap-8">
		<h1 class="text-3xl">Andorinhas, as nossas ajudantes</h1>
		<p>
			É infima a distância entre uma curiosidade de fim-de-semana e uma grande aventura. Este
			projeto é a nossa grande aventura.<br />
			Somos uma pequena chama que demonstra o que é possível, mas não conseguimos fazer tudo sozinhos.<br
			/>
			Ajuda-nos a crescer. Juntos venceremos o desafio que é a transição para um futuro sustentável.
		</p>
		<h1 class="text-xl">Podes ajudar-nos...</h1>
	</div>
	<div
		class="overflow-x-hidden flex flex-col align-middle items-center relative py-32 lg:py-56 font-bold -my-32 lg:-my-56"
	>
		<div class="text-red-100 bg-red-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Contribuindo informação</h3>
				<p>Partilha o teu conhecimento. A câmara no teu bolso vale por muitas palavras.</p>
			</div>
		</div>
		<div class="text-orange-100 bg-orange-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Encontrando erros</h3>
				<p>O nosso mecanismo para saber de erros é senão a comunicação de quem os encontra.</p>
			</div>
		</div>
		<div class="text-yellow-100 bg-yellow-500 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Adoptando municipios</h3>
				<p>
					A nossa equipa não consegue estar a par de tudo o que é notório em território nacional.
					Ajuda-nos adoptando municipios e mantendo-nos informados sobre o que se passa.
				</p>
			</div>
		</div>
		<div class="text-lime-100 bg-lime-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Demonstrando talento</h3>
				<p>
					Todo o código do projeto é de fonte aberta. O projeto não só é nosso como pode ser teu!
				</p>
			</div>
		</div>
		<div class="text-sky-100 bg-sky-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Partilhando</h3>
				<p>
					Acreditamos que a melhor publicidade parte de pessoas satisfeitas. Se gostares do projeto,
					divulga-o!
				</p>
			</div>
		</div>
		<div class="text-purple-100 bg-purple-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Apresentando-nos</h3>
				<p>
					É dificil fazer bons contactos. Podes ser o nosso elo de ligação.<br />
					Autarquias, empresas, escolas... Sinergia começa com comunicação.
				</p>
			</div>
		</div>
		<div class="text-pink-100 bg-pink-600 strip-outer">
			<div class="strip-inner">
				<h3 class="text-xl">Falando connosco</h3>
				<p>
					Taboo leva este ponto ao final da lista. Existe imensa motivação a retirar de palavras
					simpáticas.
				</p>
			</div>
		</div>
	</div>
	<div class="w-[min(960px,100%)] p-3 lg:px-0 text-sky-900 self-center flex flex-col gap-2">
		<h1 class="text-3xl self-end">O nosso bando</h1>
		<p class="self-end">Estas são as nossas andorinhas e os seus territórios:</p>
		<div class="flex flex-col gap-1">
			<div class="w-full h-96 rounded-md" bind:this={mapElem} />
			<div class="flex flex-wrap gap-3 justify-end">
				<div class="flex gap-1 items-center">
					<span class="w-3 h-3 rounded-md bg-[#40a02b]" />
					<span class="text-xs">Vigiado</span>
				</div>
				<div class="flex gap-1 items-center">
					<span class="w-3 h-3 rounded-md bg-[#df8e1d]" />
					<span class="text-xs">Estudado</span>
				</div>
				<div class="flex gap-1 items-center">
					<span class="w-3 h-3 rounded-md bg-[#fe640b]" />
					<span class="text-xs">Noções</span>
				</div>
				<div class="flex gap-1 items-center">
					<span class="w-3 h-3 rounded-md bg-[#d20f39]" />
					<span class="text-xs">Abandonado</span>
				</div>
			</div>
		</div>
		<span class="text-xl self-center my-10">Obrigado por nos dares uma oportunidade!</span>
	</div>
</div>

<style>
	.strip-outer {
		display: flex;
		width: 120vw;
		height: 15rem;
		transform: rotate(-6deg);
		justify-content: center;
	}
	.strip-inner {
		width: min(80%, 960px);
		align-self: center;
		transform: rotate(6deg);
	}
</style>
