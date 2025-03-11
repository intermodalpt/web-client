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
	import { fetchRegions, loadMissing } from '$lib/db';
	import logo from '$lib/icons/logo.svg';
	import swallow from '$lib/icons/swallow.svg';
	import discourse from '$lib/icons/brands/discourse.svg';
	import wpp from '$lib/icons/brands/wpp.svg';
	import signal from '$lib/icons/brands/signal.svg';
	import books from '$lib/icons/books.svg';
	import lpp from '$lib/icons/brands/lpp.svg';
	import osm from '$lib/icons/brands/osm.svg';
	import gitlab from '$lib/icons/brands/gitlab.svg';
	import github from '$lib/icons/brands/github.svg';
	import mastodon from '$lib/icons/brands/mastodon.svg';
	import instagram from '$lib/icons/brands/instagram.svg';
	import facebook from '$lib/icons/brands/facebook.svg';

	async function loadData() {
		await Promise.all([
			fetchRegions()
			// fetch(`${apiServer}/v1/news&stuff`)
			// 	.then((r) => r.json())
			// 	.then((r) => {
			// 		data = r;
			// 	})
		]);
	}
	loadData().then(async () => {
		await loadMissing();
	});
</script>

<svelte:head>
	<title>Intermodal</title>
	<meta name="description" content="Intermodal" />
</svelte:head>

<div
	class="w-full pt-20 lg:pt-24 pb-[25vw] flex flex-col items-center gap-8"
	style="background: url(/backgrounds/top.svg) top no-repeat, url(/backgrounds/footer.svg) bottom no-repeat; background-size: contain"
>
	<div class="w-[min(960px,100%)] flex flex-col gap-6 mx-2 xl:mx-0 lg:mt-2">
		<div
			class="card card-sm lg:card-md bg-[#ffffff77] sm:mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">🚧 Obras adiante 🚧</h2>
				<p>
					Esta plataforma não é um produto finalizado. Explore à vontade e partilhe as suas
					opiniões.
				</p>
				<div class="flex gap-2 justify-end">
					<a class="btn btn-primary" href="/plano">Ver plano</a>
				</div>
			</div>
		</div>
		<div
			class="card card-sm lg:card-md bg-[#ffffff77] sm:mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">O que é o Intermodal?</h2>
				<div class="flex flex-col gap-4">
					<span class="flex flex-col sm:flex-row gap-3 p-4">
						<img src={person} alt="Pessoa" class="w-24 h-24" />
						<div>
							<h2 class="font-bold">Para si</h2>
							<p>
								Queremos popularizar a <b>mobilidade sustentável</b>🚶 🚴 🚌 🚆, faze-la
								<b>apelativa</b> 😊, <b>inclusiva</b> 👴 e <b>superior</b> 🚀.
							</p>
							<p>
								Melhoramos os serviços existentes, facilitamos a consulta e criamos material
								educativo.
							</p>
							<p>Por um <b>futuro</b> com uma <b>sociedade saudável e verde</b> ❤️🌱!</p>
						</div>
					</span>
					<div class="flex flex-col sm:flex-row gap-2 justify-end">
						<a class="btn btn-primary" href="/sobre">Saber mais</a>
						<!-- <a class="btn btn-primary" href="/sobre/operadores-e-instituicoes"
							>Para operadores e instituições</a
						> -->
					</div>
				</div>
			</div>
		</div>
		<div
			class="card card-sm lg:card-md bg-[#ffffff77] sm:mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<div class="flex flex-wrap justify-between sm:grid sm:grid-cols-2 gap-2">
					<a
						href="/agenda"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src={calendar} alt="Agenda" class="w-24" />
						<div>
							<h2 class="font-bold">Agenda</h2>
							<p>Por esse país fora.</p>
						</div>
					</a>
					<a href="/lab" class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg">
						<img src={lab} alt="Laboratório" class="w-24" />
						<div>
							<h2 class="font-bold">Laboratório</h2>
							<p>A nossa incubadora de ideias.</p>
						</div>
					</a>
					<a
						href="/iniciativas"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src={knot} alt="Lasso" class="w-24" />
						<div>
							<h2 class="font-bold">Iniciativas</h2>
							<p>Por matérias relacionadas.</p>
						</div>
					</a>
					<a
						href="/familia"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
					>
						<img src={hearthands} alt="Mãos em coração" class="w-24" />
						<div>
							<h2 class="font-bold">Familia de projetos</h2>
							<p>Descobre causas como a nossa.</p>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div
			class="card card-sm lg:card-md bg-[#ffffff77] sm:mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<h2 class="card-title">Recursos</h2>
				<div class="flex flex-col gap-4">
					<a
						href="https://editor.intermodal.pt"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-zinc-50 rounded-lg"
					>
						<img src={logo} alt="Editor" class="w-24 h-24" />
						<div>
							<h2 class="font-bold">Editor</h2>
							<p>
								Local onde editamos a informação do Intermodal. Permite que qualquer pessoa ajude a
								manter a informação atualizada. Não são os nossos dados, são os teus!
							</p>
						</div>
					</a>
					<!-- <a
						href="https://biblioteca.intermodal.pt"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-zinc-50 rounded-lg"
					>
						<img src={books} alt="Biblioteca" class="w-24 h-24" />
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
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-zinc-50 rounded-lg"
					>
						<img src={discourse} alt="Forum" class="w-24" />
						<div>
							<h2 class="font-bold">Forum</h2>
							<p>
								No nosso forum podes debater e partilhar informação, bem como conhecer toda uma
								comunidade de intressados em mobilidade, acessibilidade e urbanismo.
							</p>
						</div>
					</a> -->
					<a
						href="https://signal.me/#p/+351910551803"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-zinc-50 rounded-lg"
					>
						<img src={signal} alt="Signal" class="w-24" />
						<div>
							<h2 class="font-bold">Signal</h2>
							<p>
								Coloca-nos qualquer dúvida por mensagem, seja sobre transportes ou sobre o nosso
								projeto. Aceitamos elogios😻, criticas😾 e fotos de gatos🐯.
							</p>
						</div>
					</a>
					<!--<a
						href="https://wa.me/351910551803"
						class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-zinc-50 rounded-lg"
					>
						<img src={wpp} alt="Whatsapp" class="w-24" />
						<div>
							<h2 class="font-bold">WhatsApp</h2>
							<p>
								Também podes falar connosco por Whatsapp, seja para o que seja. Estamos ao teu
								dispor!
							</p>
						</div>
					</a>-->
				</div>
			</div>
		</div>
		<div
			class="card card-sm lg:card-md bg-[#ffffff77] sm:mx-2 lg:mx-0"
			style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);"
		>
			<div class="card-body">
				<a href="/andorinhas" class="flex flex-col justify sm:justify-between sm:flex-row gap-3">
					<div>
						<h2 class="card-title">Junta-te ás andorinhas!</h2>
						<p>Ajuda-nos a migrar para o futuro.</p>
					</div>
					<img src={swallow} alt="Andorinha" class="h-32" />
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
						<img src={osm} class="w-10" alt="OpenStreetMap" />
					</a>
					<button onclick={() => document.querySelector('#lpp_warning').showModal()}>
						<img src={lpp} class="w-20" alt="Lisboa para Pessoas" />
					</button>
				</div>
			</div>
			<div>
				<h2 class="text-xs">Redes sociais</h2>
				<div class="flex gap-3">
					<a href="https://ciberlandia.pt/@intermodal">
						<img src={mastodon} class="w-10 drop-shadow-md" alt="Mastodon" />
					</a>
					<!--<button onclick="fb_warning.showModal()">
						<img src={facebook} class="w-10" alt="Facebook" />
					</button>
					<button onclick="ig_warning.showModal()">
						<img src={instagram} class="w-10 drop-shadow-md" alt="Instagram" />
					</button>-->
				</div>
			</div>
			<div>
				<h2 class="text-xs">A nossa formula secreta</h2>
				<div class="flex gap-3">
					<a href="https://gitlab.com/intermodalpt">
						<img src={gitlab} class="w-10" alt="Gitlab" />
					</a>
					<a href="https://github.com/intermodalpt">
						<img src={github} class="w-10" alt="Github" />
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
