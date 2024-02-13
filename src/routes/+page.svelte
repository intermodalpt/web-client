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
	import { derived, writable } from 'svelte/store';
	import { Map as Maplibre, NavigationControl, GeolocateControl } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { liveQuery } from 'dexie';
	import { fetchRegions, getRegions, regionId, setRegion, loadMissing } from '$lib/db';
	import { tileStyle } from '$lib/settings.js';

	let map;
	let mapElem;
	let regionConfirmationModal;
	let mapGeolocateControl;
	let isGeolocating = false;

	let mapLoaded = false;
	let regionsLoaded = false;

	let hoveredRegionId = null;
	let explicitRegionChange = false;

	const DEFAULT_BOUNDS = [
		[-11, 36.5],
		[-5.5, 42.35]
	];

	const regions = liveQuery(() => getRegions());
	const pendingRegionId = writable();

	const pendingRegion = derived([regions, pendingRegionId], ([$regions, $pendingRegionId]) => {
		if (!$pendingRegionId || !$regions) {
			return null;
		}
		return $regions.find((r) => r.id == $pendingRegionId);
	});
	const selectedRegion = derived([regions, regionId], ([$regions, $regionId]) => {
		console.log('$regionId', $regionId);
		if (!$regionId || !$regions) {
			console.log('1');
			return null;
		}
		console.log('2');
		return $regions.find((r) => r.id == $regionId);
	});

	regions.subscribe((regs) => {
		drawRegions();
	});

	pendingRegion.subscribe((region) => {
		if (!region) {
			return;
		}
		regionConfirmationModal.showModal();
	});

	async function confirmPendingRegion() {
		await setRegion($pendingRegionId);
		explicitRegionChange = false;
		$pendingRegionId = null;
	}

	function drawRegions() {
		if (!mapLoaded || !$regions) {
			return;
		}
		map.getSource('regions').setData({
			type: 'FeatureCollection',
			features: $regions.map((region) => ({
				type: 'Feature',
				id: region.id,
				properties: {
					id: region.id,
					name: region.name
				},
				geometry: region.geometry
			}))
		});
	}

	async function loadData() {
		await Promise.all([
			fetchRegions().then((r) => {
				regionsLoaded = true;
				drawRegions();
				return r;
			})
			// fetch(`${apiServer}/v1/news&stuff`)
			// 	.then((r) => r.json())
			// 	.then((r) => {
			// 		data = r;
			// 	})
		]);
	}
	loadData().then(async () => {
		console.log('data loaded');
		await loadMissing();
	});

	const regionTabs = {
		north: 1,
		center: 2,
		south: 3
	};
	let regionTab = writable();

	regionTab.subscribe((tab) => {
		switch (tab) {
			case regionTabs.north:
				// map.setMaxBounds([
				// 	[-9.14, 40.44],
				// 	[-7.95, 42.38]
				// ]);
				map.flyTo({
					center: [-8.62, 41.16],
					zoom: 7
				});
				break;
			case regionTabs.center:
				map.setMaxBounds(DEFAULT_BOUNDS);
				map.flyTo({
					center: [-9.12, 38.72],
					zoom: 7
				});
				break;
			case regionTabs.south:
				map.setMaxBounds(DEFAULT_BOUNDS);
				map.flyTo({
					center: [-8.0, 37.14],
					zoom: 8
				});
				break;
			default:
				if (map) {
					map.setMaxBounds(DEFAULT_BOUNDS);
				}
		}
	});

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
				'fill-color': '#627BC1',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, 0.1]
			}
		});

		map.addLayer({
			id: 'region-borders',
			type: 'line',
			source: 'regions',
			layout: {},
			paint: {
				'line-color': '#627BC1',
				'line-width': 0.5
			}
		});
	}

	function addEvents() {
		mapGeolocateControl.on('geolocate', (e) => {
			isGeolocating = false;
			$regionTab = -1;
		});

		mapGeolocateControl.on('outofmaxbounds', function () {
			alert('Aparenta estar fora de Portugal continental.');
			isGeolocating = false;
		});

		mapGeolocateControl.on('error', function () {
			alert('Incapaz de obter a sua localização.');
			isGeolocating = false;
		});

		map.on('click', 'regions-fills', (e) => {
			$pendingRegionId = e.features[0].id;
		});

		map.on('mousemove', 'regions-fills', (e) => {
			if (e.features.length > 0) {
				if (hoveredRegionId) {
					map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: false });
				}
				hoveredRegionId = e.features[0].id;
				map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: true });
			}
		});

		map.on('mouseleave', 'regions-fills', () => {
			if (hoveredRegionId) {
				map.setFeatureState({ source: 'regions', id: hoveredRegionId }, { hover: false });
			}
			hoveredRegionId = null;
		});
	}

	onMount(() => {
		map = new Maplibre({
			container: mapElem,
			style: tileStyle,
			minZoom: 3,
			zoom: 3,
			maxZoom: 11,
			maxBounds: DEFAULT_BOUNDS,
			center: [-9.1333, 38.7167]
		});

		mapGeolocateControl = new GeolocateControl();
		map.addControl(new NavigationControl(), 'top-right');
		map.addControl(mapGeolocateControl, 'top-right');

		map.on('load', () => {
			addSourcesAndLayers();
			addEvents();
			mapLoaded = true;
			if (regionsLoaded) {
				drawRegions();
			}
		});
	});

	onDestroy(() => {
		mapLoaded = false;
		map.remove();
	});
</script>

<svelte:head>
	<title>Intermodal</title>
	<meta name="description" content="Intermodal" />
</svelte:head>

<div
	class="w-full pt-24 sm:pt-32 pb-[25vw] flex flex-col items-center gap-8"
	style="background: url(/top.svg) top no-repeat, url(/footer.svg) bottom no-repeat; background-size: contain"
>
	{#if $regionId && !explicitRegionChange}
		<div class="w-[min(960px,100%)] flex justify-end">
			<div
				class="flex flex-col p-4 bg-[#ffffff77] rounded-xl"
				style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
			>
				<span>A sua região está definida como</span>
				<span
					class="text-5xl py-2 text-slate-900"
					style="font-family: Charm, handwriting; text-shadow: 0 1px 0 #ffffffaa"
					>{$selectedRegion?.name}</span
				>
				<div class="flex justify-end opacity-50">
					<button class="btn btn-sm btn-neutral" on:click={() => (explicitRegionChange = true)}
						>Mudar</button
					>
				</div>
			</div>
		</div>
	{/if}
	<div class="w-[min(960px,100%)] flex flex-col gap-6 mx-2 xl:mx-0">
		<div
			class="card card-compact lg:card-normal bg-[#ffffff77]"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">🚧 Obras adiante 🚧</h2>
				<p>
					Estamos a melhorar o Intermodal para suportar o país. Durante as próximas semanas o
					Intermodal poderá não funcionar. Pedimos desculpa.
				</p>
			</div>
		</div>
		<div
			class="card card-compact lg:card-normal bg-[#ffffff77]"
			class:hidden={$regionId && !explicitRegionChange}
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">Escolha a sua região</h2>
				<div>
					<div
						role="tablist"
						class="tabs tabs-lg tabs-bordered justify-start"
						class:hidden={!$regionTab}
					>
						<button role="tab" class="tab" on:click={() => ($regionTab = null)}>Voltar</button>
					</div>
					<div role="tablist" class="tabs tabs-lg tabs-bordered" class:hidden={$regionTab}>
						<button
							role="tab"
							class="tab"
							class:tab-active={$regionTab == regionTabs.north}
							on:click={() => ($regionTab = regionTabs.north)}>Porto</button
						>
						<button
							role="tab"
							class="tab"
							class:tab-active={$regionTab == regionTabs.center}
							on:click={() => ($regionTab = regionTabs.center)}>Lisboa</button
						>
						<button
							role="tab"
							class="tab"
							class:tab-active={$regionTab == regionTabs.south}
							on:click={() => ($regionTab = regionTabs.south)}>Algarve</button
						>
					</div>
					<div
						bind:this={mapElem}
						class="w-full h-[50vh] rounded-b-lg relative"
						class:rounded-tr-lg={$regionTab}
					>
						<div
							class="absolute top-0 w-full h-full z-10 flex flex-col gap-4 justify-center items-center backdrop-blur-md"
							class:hidden={$regionTab}
						>
							{#if isGeolocating}
								<span class="text-3xl text-neutral">A obter a sua localização</span>
								<span class="text-lg text-neutral">(pode ter de aceitar)</span>
								<progress class="progress w-56" />
							{:else}
								<span class="text-3xl text-neutral">Escolha a zona do país</span>
								<button
									class="btn btn-primary"
									class:hidden={isGeolocating}
									on:click={() => {
										isGeolocating = true;
										mapGeolocateControl.trigger();
									}}>Utilizar a minha localização</button
								>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="card card-compact lg:card-normal bg-[#ffffff77] mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">Recursos</h2>
				<div class="flex flex-col gap-4">
					<a
						href="https://editor.intermodal.pt"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src="/logo.svg" alt="Editor" class="w-24 h-24" />
						<div>
							<h2 class="font-bold">Editor</h2>
							<p>
								Local onde editamos a informação do Intermodal. Permite que qualquer pessoa ajude a
								manter a informação atualizada. Não são os nossos dados, são os teus!
							</p>
						</div>
					</a>
					<a
						href="https://biblioteca.intermodal.pt"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src="/icons/books.svg" alt="Biblioteca" class="w-24 h-24" />
						<div>
							<h2 class="font-bold">Biblioteca</h2>
							<p>
								Uma plataforma onde é possível consultar o conhecimento que vamos acumulando sobre
								locais e serviços de Portugal.
							</p>
						</div>
					</a>
					<a
						href="https://forum.intermodal.pt"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src="/icons/discourse.svg" alt="Forum" class="w-24" />
						<div>
							<h2 class="font-bold">Forum</h2>
							<p>
								No nosso forum podes debater e partilhar informação, bem como conhecer toda uma
								comunidade de intressados em mobilidade, acessibilidade e urbanismo.
							</p>
						</div>
					</a>
					<a
						href="https://signal.me/#p/+351910551803"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src="/icons/signal.svg" alt="Signal" class="w-24" />
						<div>
							<h2 class="font-bold">Signal</h2>
							<p>
								Coloca-nos qualquer dúvida por mensagem, seja sobre transportes ou sobre o nosso
								projeto. Aceitamos elogios😻, criticas😾 e fotos de gatos🐯.
							</p>
						</div>
					</a>
					<a
						href="https://wa.me/351910551803"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src="/icons/wpp.svg" alt="Whatsapp" class="w-24" />
						<div>
							<h2 class="font-bold">WhatsApp</h2>
							<p>
								Também podes falar connosco por Whatsapp, seja para o que seja. Estamos ao teu
								dispor!
							</p>
						</div>
					</a>
				</div>
			</div>
		</div>

		<div
			class="card card-compact lg:card-normal bg-[#ffffff77]"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<a
					href="/andorinhas"
					class="flex flex-col justify sm:justify-between sm:flex-row gap-3"
				>
					<div>
						<h2 class="card-title">Junta-te ás andorinhas!</h2>
						<p>
							Ajuda-nos a migrar para o futuro.
						</p>
					</div>
					<img src="/swallow.svg" alt="Andorinha" class="h-32" />
				</a>
			</div>
		</div>
	</div>
</div>
<footer>
	<div class="bg-[#664631] text-[#b49987] relative -mt-[1px] p-4 lg:px-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-fit gap-8 lg:gap-16">
			<div>
				<h2 class="text-xs">Projetos amigos</h2>
				<div class="flex gap-3 saturate-50">
					<a href="https://www.openstreetmap.org/about">
						<img src="/icons/osm.svg" class="w-10" alt="OpenStreetMap" />
					</a>
					<button onclick="lpp_warning.showModal()">
						<img src="/icons/lpp.svg" class="w-20" alt="Lisboa para Pessoas" />
					</button>
				</div>
			</div>
			<div>
				<h2 class="text-xs">Redes sociais</h2>
				<div class="flex gap-3">
					<a href="https://ciberlandia.pt/@intermodal">
						<img src="/icons/mastodon.svg" class="w-10 drop-shadow-md" alt="Mastodon" />
					</a>
					<button onclick="fb_warning.showModal()">
						<img src="/icons/facebook.svg" class="w-10" alt="Facebook" />
					</button>
					<button onclick="ig_warning.showModal()">
						<img src="/icons/instagram.svg" class="w-10 drop-shadow-md" alt="Instagram" />
					</button>
				</div>
			</div>
			<div>
				<h2 class="text-xs">A nossa formula secreta</h2>
				<div class="flex gap-3">
					<a href="https://gitlab.com/intermodalpt">
						<img src="/icons/gitlab.svg" class="w-10" alt="Gitlab" />
					</a>
					<a href="https://github.com/intermodalpt">
						<img src="/icons/github.svg" class="w-10" alt="Github" />
					</a>
				</div>
			</div>
			<div>
				<h2 class="text-xs">Outras informações</h2>
				<div class="flex flex-col text-white">
					<a href="/sobre">Sobre nós</a>
					<a href="/faq">Perguntas frequentes</a>
					<a href="/licencas">Licenças</a>
				</div>
			</div>
		</div>
	</div>
</footer>
<dialog bind:this={regionConfirmationModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Colocar Intermodal em <b>{$pendingRegion?.name || ''}</b>?</h3>
		<p class="py-4">
			Esta definição serve para mostrar os serviços relevantes para a sua região. Pode alterar em
			qualquer momento a partir do menu.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success" on:click={confirmPendingRegion}>Sim</button>
				<button class="btn" on:click={() => ($pendingRegionId = null)}>Não</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>
<dialog id="lpp_warning" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Gostaria de interpor por um momento,</h3>
		<p class="py-4">
			O Lisboa para Pessoas sustenta-se com alguma intrusão à sua privacidade. Caso goste do
			conteúdo, <b>doe ao projeto</b>. Cabe-lhe a si possibilitar jornalismo de qualidade sem
			compromissos.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<a
					class="btn btn-success"
					href="https://lisboaparapessoas.pt/"
					target="_blank"
					rel="noopener">Abrir</a
				>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>
<dialog id="fb_warning" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Convinha saber que...</h3>
		<p class="py-4">
			A Meta é uma empresa muito eticamente questionável. Temos Facebook para divulgar a uma
			audiência maior todavia preferimos plataformas que não vivam de
			<a
				class="link link-primary no-underline"
				href="https://en.wikipedia.org/wiki/2021_Facebook_leak"
			>
				manipulação e monetização de violações de direitos humanos
			</a>.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<a
					class="link link-primary no-underline mr-4"
					href="https://www.facebook.com/intermodalpt"
					target="_blank"
					rel="noopener">Abrir</a
				>
				<button class="btn" autofocus>Fechar</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>
<dialog id="ig_warning" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Convinha saber que...</h3>
		<p class="py-4">
			A Meta é uma empresa muito eticamente questionável. Temos Instagram para divulgar a uma
			audiência maior todavia preferimos plataformas que não vivam de
			<a
				class="link link-primary no-underline"
				href="https://en.wikipedia.org/wiki/2021_Facebook_leak"
			>
				manipulação e monetização de violações de direitos humanos
			</a>.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<a
					class="link link-primary no-underline mr-4"
					href="https://instagram.com/intermodalpt"
					target="_blank"
					rel="noopener">Abrir</a
				>
				<button class="btn" autofocus>Fechar</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Fechar</button>
	</form>
</dialog>
