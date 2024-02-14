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
	import logoText from '$lib/icons/logo-text.svg';
	import child from '$lib/icons/openmoji/child.svg';
	import woman from '$lib/icons/openmoji/woman.svg';
	import elderly from '$lib/icons/openmoji/elderly.svg';
	import afrodesc from '$lib/icons/openmoji/afro-desc.svg';
	import deaf from '$lib/icons/openmoji/deaf.svg';
	import wheelchair from '$lib/icons/openmoji/wheelchair.svg';
	import blind from '$lib/icons/openmoji/blind.svg';
	import guidedog from '$lib/icons/openmoji/guidedog.svg';
	import codeImg from './illustrations/code.webp';
	import osmCompare from './illustrations/osmcompare.webp';
	import survey from './illustrations/survey.webp';
	import bar from './muns/bar.svg';
	import ses from './muns/ses.svg';
	import tml from './partners/tml.svg';
	import cmet from './partners/cmet.svg';
</script>

<div class="brand-slide flex flex-col min-h-screen items-center justify-center">
	<img src={logoText} alt="Intermodal" class="w-[40rem] px-2" />
	<p class="text-xl sm:text-2xl font-extralight">
		Uma marca para um futuro móvel, sustentável e aberto
	</p>
</div>
<div class="flex flex-col items-center py-12 px-2 bg-zinc-800 shadow-lg w-full">
	<div class="text-white w-3/4 max-w-[100em]">
		<p class="text-xl">
			Somos uma equipa especialistas na criação de
			<b>soluções digitais para apoio à mobilidade</b>.<br />Preocupamo-nos com as cidades em que
			vivemos e nelas investimos com as nossas inovações.
		</p>
		<div class="flex flex-col py-24">
			<span class="text-xl self-center text-zinc-400">Palavras chave</span>
			<ul class="flex flex-wrap gap-y-8 gap-x-32 text-3xl py-6 justify-around">
				<li>Mobilidade</li>
				<li>Transportes</li>
				<li>Espaço público</li>
				<li>Acessibilidade</li>
				<li>Inclusividade</li>
				<li>Cartografia</li>
				<li>Dados</li>
				<li>Analise</li>
				<li>Visualização</li>
				<li>Fonte aberta</li>
				<li>Acesso livre</li>
				<li>Responsibilidade social</li>
			</ul>
		</div>
		<p class="text-xl text-zinc-400">
			Procuramos ser uma empresa responsável, que deixa um impacto positivo no mundo.<br />
			Alem do comercial, fazemos o que acreditamos ser importante para a nossa comunidade.<br />
			Assim demonstramos o valor do nosso trabalho.
		</p>
	</div>
</div>
<div class="w-full flex gap-8 justify-center py-8 shadow-inner">
	<h2 class="text-5xl self-center text-zinc-800">O que fazemos</h2>
</div>
<div class="w-full flex justify-center drop-shadow-lg z-10">
	<div class="w-full grid grid-cols-1 2xl:grid-cols-2">
		<div class="bg-[#dd7878] text-[#f2cdcd] p-2 sm:p-4 lg:p-16 saturate-[0.9]">
			<h1 class="text-3xl drop-shadow-xl">Levantamento e processamento de dados</h1>
			<div class="flex flex-col-reverse lg:flex-row gap-4">
				<img src={survey} alt="Levantamento de dados" class="h-fit lg:h-48 rounded-lg" />
				<div>
					<p>
						Perante a falta de dados de qualidade tomamos a missão por nossa!<br />
						A equipa Intermodal encontra-se a atravessar o país, norte a sul, enquanto criamos o maior
						levantamento de dados de oferta de mobilidade e acessibilidade de via.
					</p>
					<p>
						Todavia não queremos dados, queremos <b>informação</b>!<br />Fazemos análise aos dados
						levantados afim de acusar problemas no meio urbano. Coordenamos esta informação com as
						autoridades por um país melhor para todos.
					</p>
				</div>
			</div>
		</div>
		<div class="bg-[#04a5e5] text-[#89dceb] p-2 sm:p-4 lg:p-16 shadow-md saturate-[0.75]">
			<h1 class="text-3xl text-white">Desenvolvimento de sistemas</h1>
			<div class="flex flex-col lg:flex-row gap-4 justify-between">
				<div>
					<p>
						Criamos sistemas informáticos de humanos para humanos. Focamo-nos na qualidade com
						tecnologias que dão garantias difíceis de obter no mercado. Tal permite-nos criar
						soluções de baixo custo <b>sem compromissos</b>.
					</p>
					<p>
						Muito do que fazemos é públicado como <b>software livre</b>, para que possa ser usado,
						melhorado e estudado por <b>todos</b>. Sem práticas abusivas, sem segredos, sem truques
						na manga!
					</p>
				</div>
				<img src={codeImg} alt="Programação" class="h-fit lg:h-48 rounded-lg shrink-0" />
			</div>
		</div>
		<div class="bg-[#179299] text-[#94e2d5] p-2 sm:p-4 lg:p-16 shadow-md saturate-50">
			<h1 class="text-3xl text-white drop-shadow-xl">Cartografia aberta</h1>
			<div class="flex flex-col items-start">
				<p>
					Participamos no projeto <a href="https://openstreetmap.org"><b>OpenStreetMap</b></a>: Um
					mapa livre, ideal para serviços públicos, investigação, empresas competitivas e a criação
					de soluções inovadoras que ilustram o território português.
				</p>
				<img
					src={osmCompare}
					alt="Comparação entre OSM e satélite"
					class="max-h-48 w-auto rounded-lg shrink-0"
				/>
			</div>
		</div>
		<div class="bg-[#df8e1d] text-[#f9e2af] p-2 sm:p-4 lg:p-16 shadow-md saturate-50">
			<h1 class="text-3xl text-white">Componentes sociais</h1>
			<p>
				Fazemos a ponte entre os <b>serviços de mobilidade e os seus utentes</b>.<br />
				<b>Educamos</b> a população para a importância de serviços e infraestrutura de qualidade,
				para a aceitação da <b>transição verde</b>.<br />
				<b>Promovemos o desenvolvimento</b> de mais e melhor mobilidade e a
				<b>coesão do tecido social</b>, por uma sociedade onde ninguém perde oportunidades por
				incapacidade de deslocação.
			</p>
			<div class="flex flex-wrap">
				<figure><img src={child} class="w-16 lg:w-24" alt="Criança" /></figure>
				<figure><img src={woman} class="w-16 lg:w-24" alt="Mulher" /></figure>
				<figure><img src={elderly} class="w-16 lg:w-24" alt="Idoso" /></figure>
				<figure>
					<img src={afrodesc} class="w-16 lg:w-24" alt="Afro-descentente" />
				</figure>
				<figure><img src={deaf} class="w-16 lg:w-24" alt="Surdo" /></figure>
				<figure><img src={wheelchair} class="w-16 lg:w-24" alt="Cadeirante" /></figure>
				<figure><img src={blind} class="w-16 lg:w-24" alt="Cego" /></figure>
				<figure><img src={guidedog} class="w-16 lg:w-24" alt="Cão Guia" /></figure>
			</div>
			<span class="absolute bottom-0 right-2 text-xs opacity-75"
				>OpenMoji icons <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA</a></span
			>
		</div>
	</div>
</div>
<div class="relative bg-white">
	<div class="team-slide-inner flex justify-center">
		<div class="w-[100em] mx-4 flex flex-col gap-8 relative overflow-hidden">
			<h1 class="text-5xl mt-32">Equipa</h1>
			<div>
				<div class="lg:w-fit carousel carousel-center space-x-4 rounded-box">
					<div class="carousel-item">
						<div class="card w-64 xl:w-72 bg-base-100 border-2">
							<div class="absolute h-20 bg-red-600 w-full" />
							<div class="card-body">
								<div class="avatar">
									<div
										class="w-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2"
									>
										<img src="/avatars/claudio.webp" alt="Cláudio Pereira" />
									</div>
								</div>
								<div>
									<span class="card-title">Cláudio Pereira</span>
									<span class="text-sm">Criador de ideias</span>
								</div>
							</div>
						</div>
					</div>
					<div class="carousel-item">
						<div class="card w-64 xl:w-72 bg-base-100 border-2">
							<div class="absolute h-20 bg-lime-500 w-full" />
							<div class="card-body">
								<div class="avatar">
									<div
										class="w-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 bg-black"
									>
										<img src="/avatars/theo.webp" alt="João Bebiano" />
									</div>
								</div>
								<div>
									<span class="card-title">João Bebiano</span>
									<span class="text-sm">Matemático, Cartografo</span>
								</div>
							</div>
						</div>
					</div>
					<div class="carousel-item">
						<div class="card w-64 xl:w-72 bg-base-100 border-2">
							<div class="absolute h-20 bg-sky-500 w-full" />
							<div class="card-body">
								<div class="avatar">
									<div
										class="w-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 bg-black"
									>
										<img src="/avatars/maf.webp" alt="Mafalda Antunes" />
									</div>
								</div>
								<div>
									<h2 class="card-title">Mafalda Antunes</h2>
									<span class="text-sm">Assistência, Sustentabilidade</span>
								</div>
							</div>
						</div>
					</div>
					<div class="carousel-item">
						<div class="card w-64 xl:w-72 bg-base-100 border-2">
							<div class="absolute h-20 bg-zinc-500 w-full" />
							<div class="card-body">
								<div class="avatar">
									<div
										class="w-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2"
									>
										<img src="/avatars/teles.webp" alt="Tiago Teles" />
									</div>
								</div>
								<div>
									<h2 class="card-title">Tiago Teles</h2>
									<span class="text-sm">Programador, Designer</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="card card-compact max-w-[30em] bg-white border-2 absolute bottom-8 sm:bottom-16 md:bottom-32 xl:bottom-56 lg:right-16"
			>
				<div class="card-body">
					<h2 class="card-title">Contributos</h2>
					<ul class="flex flex-wrap gap-x-4 gap-y-2">
						<li>Diogo Baptista</li>
						<li>Diogo Martins</li>
						<li>Henrique Pereira</li>
						<li>Nelson Vassalo</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="flex justify-center bg-base-100 py-16">
	<div
		class="w-[100em] mx-4 flex gap-16 items-start align-top content-start relative overflow-hidden flex-wrap"
	>
		<div>
			<h1 class="text-3xl lg:text-5xl mb-8">Os nossos clientes</h1>
			<div class="flex flex-wrap gap-16 shrink-0">
				<img src={tml} alt="Transportes Metropolitanos de Lisboa" class="h-16 lg:h-24" />
				<img src={cmet} alt="Carris Metropolitana" class="h-16 lg:h-24" />
			</div>
		</div>
		<span class="divider divider-horizontal hidden" />
		<div>
			<h1 class="text-3xl lg:text-5xl mb-8">Autarquias cartografadas</h1>
			<div class="flex flex-wrap gap-16">
				<img src={bar} alt="Barreiro" class="w-48 lg:w-64" />
				<img src={ses} alt="Sesimbra" class="w-48 lg:w-64" />
			</div>
		</div>
	</div>
</div>
<div class="flex justify-center py-16 bg-zinc-700 text-zinc-400">
	<div
		class="w-[100em] mx-4 flex flex-col gap-1 items-start align-top content-start relative overflow-hidden"
	>
		<h1 class="text-5xl mb-2">Vem melhorar o mundo connosco</h1>
		<p>Apresenta-te e certamente que nos veremos em futuras oportunidades!</p>
		<p>Soluções opensource permitem-nos criar soluções de qualidade. Valorizamos intressados!</p>
		<ul class="flex flex-wrap shrink-0 gap-4 saturate-50">
			<li>
				<a href="https://www.rust-lang.org">
					<img src="foss/rust.svg" alt="Rust" class="h-16" />
				</a>
			</li>
			<li>
				<a href="https://svelte.dev">
					<img src="foss/svelte.svg" alt="Svelte" class="h-16" />
				</a>
			</li>
			<li>
				<a href="https://www.python.org">
					<img src="foss/python.svg" alt="Python" class="h-16" />
				</a>
			</li>
			<li>
				<a href="https://qgis.org">
					<img src="foss/qgis.svg" alt="QGIS" class="h-16" />
				</a>
			</li>
			<li><img src="foss/linux.svg" alt="Linux" class="h-16" /></li>
			<li>
				<a href="https://opencv.org">
					<img src="foss/opencv.svg" alt="OpenCV" class="h-16" />
				</a>
			</li>
		</ul>
		<ul class="flex flex-wrap shrink-0 gap-4 saturate-50 mt-2">
			<li>
				<a href="https://www.blender.org/">
					<img src="foss/blender.svg" alt="Blender" class="h-16" />
				</a>
			</li>
			<li>
				<a href="https://inkscape.org/">
					<img src="foss/inkscape.svg" alt="Inkscape" class="w-16" />
				</a>
			</li>
			<li>
				<a href="https://opentoonz.github.io">
					<img src="foss/opentoonz.svg" alt="OpenToonz" class="w-16" />
				</a>
			</li>
			<li>
				<a href="https://krita.org">
					<img src="foss/krita.svg" alt="Krita" class="w-16" />
				</a>
			</li>
		</ul>
		<span class="flex gap-1">
			<span>Envia-nos o teu portefólio para</span>
			<span class="flex flex-row-reverse">
				<span>pt</span>
				<span>intermodal.</span>
				<span>@</span>
				<span>participar</span>
			</span>
		</span>
		<span class="text-xs self-end">Logotipos propriedade dos respetivos projetos</span>
	</div>
</div>

<style>
	.brand-slide {
		min-height: 100vh;
		background-image: url(/stock/mads-schmidt-rasmussen-6YmzwamGzCg.jpg);
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
	}

	.team-slide-inner::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: white;
		background-image: url('/backgrounds/team.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		opacity: 0.5;
	}

	.team-slide-inner {
		height: calc(max(min(1000px, 60vw), 700px));
	}

	/* Media query to turn up the opacity after 80rem*/
	@media (min-width: 80rem) {
		.team-slide-inner::before {
			opacity: 1;
		}
	}
</style>
