<script>
	import alga from './avatars/alga.png';
	import capitao from './avatars/capitao.png';
	import gnomo from './avatars/gnomo.png';
	import livro from './avatars/livro.png';
	import magma from './avatars/magma.png';
	import oliveira from './avatars/oliveira.png';
	import pepino from './avatars/pepino.png';
	import unicornio from './avatars/unicornio.png';
	import ourico from './avatars/ourico.png';

	let friendos = [
		/*{
			fakeName: 'Parede Brilhante',
			description:
				'Participação pública é com esta pessoa. É muito jeitosa a mover-se por entre o sistema politico e entende as engrenagens que movem a cidade.',
			skills: ['Cidadania', 'Politica', 'Geografia']
		},*/
		{
			_: 'Vasconcelos',
			fakeName: 'Pepino Bailarino',
			avatar: pepino,
			subtitle: 'Todos os males são falta de amarelo...',
			descriptions: [
				'Perfecionista que trata os computadores como arte.',
				'Move-se ao movimento dos autocarros.'
			],
			skills: ['Cidadania', 'Informática']
		},
		{
			_: 'Bebiano',
			fakeName: 'Capitão Hexagono',
			avatar: capitao,
			subtitle: 'Conheces aquele festival de sopa?',
			descriptions: [
				'Somas, adições e incrementos. Faz tudo sem usar muito os dedos.',
				'Pessoa que pedala autocarro dentro se desprovida de impedimento.'
			],
			skills: ['Cidadania', 'Contas', 'Mapas']
		},
		{
			_: 'Ricardo',
			fakeName: 'Arco-íris Ultravioleta',
			subtitle: 'E se o mundo tivesse mais cores?',
			description2:
				'Curioso e pragmático sobre a visão que se tem sobre o mundo. Entre trabalho e lazer, o que esta pessoa faz bem é ligar o mundo.',
			descriptions: [
				'Entre trabalho e lazer, esta pessoa faz senão por ligar o mundo.',
				'Não tem medo de computadores nem de contratos públicos',
				'Move-se ao transporte que aparecer. A aplicação que diga.'
			],
			skills: ['Cidadania', 'Politica', 'Informática']
		},
		{
			_: 'Filipe',
			fakeName: 'Oliveira Prateada',
			avatar: oliveira,
			subtitle: 'Poesia, pão e politica',
			description2:
				'Amante da artes (especialmente as vegetais) e apaixonado por broa. Fantasia com um mundo mais justo e próspero.',
			descriptions: [
				'Especialista em flora. Saberá o sitio certo para as couves.',
				'Desloca-se de comboio, mesmo quando não tem de ir a lado nenhum.'
			],
			skills: ['Politica', 'Cultura', 'Culinária']
		},
		{
			_: 'Mafalda',
			fakeName: 'Magma Aquático',
			avatar: magma,
			subtitle: 'Da malta que cria muito bom ambiente.',
			descriptions: [
				'Acredita num mundo mais verde, azul e todas as demais cores positivas.',
				'Defende flora, fauna, fungos e culturas simbióticas.',
				'Move-se ao que come.'
			],
			skills: ['Plantas', 'Ecologia', 'Cidadania']
		},
		{
			_: 'Samoq',
			fakeName: 'Alga Sorridente',
			avatar: alga,
			subtitle: 'Excesso de suculentas resolve-se com mais!',
			descriptions: [
				'Esta pessoa sabe muito sobre quimica.',
				'Move-se com transportes públicos e modos leves.'
			],
			skills: ['Plantas', 'Quimica']
		},
		{
			_: 'Mario',
			fakeName: 'Livro Circular',
			avatar: livro,
			subtitle: 'Foto, paragrafo, foto, paragrafo... online!',
			descriptions: [
				'Esta pessoa sabe muito sobre o que se passa na cidade mas não guarda para si.',
				'De lápis na orelha e cerveja na mão, move-se a vontade de escrever.'
			],
			skills: ['Escrita', 'Fotografia', 'Cidadania']
		},
		{
			_: 'Teles',
			fakeName: 'Gnomo Pensante',
			avatar: gnomo,
			subtitle: 'Gosto do que gostar e quando o relógio alinhar!',
			descriptions: [
				'Explorador de extremos sociais',
				'"Adoraria ter metro da porta de casa até Espanha"'
			],
			skills: ['Informática', 'Politica']
		},
		{
			_: 'Diogo',
			fakeName: 'Ouriço Sopranista',
			avatar: ourico,
			subtitle: 'Inclusividade, inclusividade, Inclusividade!',
			descriptions: [
				'"As cidades querem-se acessiveis, seguras, acessiveis, sustentáveis, acessiveis, belas e também acessiveis!"',
				'Esta personagem sabe do comboio de ambos.'
			],
			skills: ['Cidadania', 'Acessibilidade']
		},
		{
			_: 'Rúben',
			fakeName: 'Unicornio Vaidoso',
			avatar: unicornio,
			subtitle: '"Seria uma pena se esta publicidade ganhasse um bigode"',
			descriptions: [
				'Esta pessoa preocupa-se muito com os efeitos da toxicidade nas nossas comunidades. Detesta publicidade, especialmente quando atapalha.',
				'Deita a mão ao transporte público mais ao pé'
			],
			skills: ['Comunidade', 'Politica']
		}
	];

	// Randomly sort friendos
	friendos = friendos
		.map((f) => [f, Math.random()])
		.sort((a, b) => a[1] - b[1])
		.map((a) => a[0]);
</script>

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

<div class="card flex flex-col bg-base-100 shadow-sm rounded-xl relative">
	<div class="card-body">
		<div class="breadcrumbs hidden lg:block -mt-6">
			<ul>
				<li>
					<a href="/" class="btn btn-ghost btn-xs text-primary">Início</a>
				</li>
				<li>
					<a href="/iniciativas" class="btn btn-ghost btn-xs text-primary">Iniciativas</a>
				</li>
				<li>
					<a href="/iniciativas/caixa-da-comunidade" class="btn btn-ghost btn-xs text-primary"
						>Caixa da Comunidade</a
					>
				</li>
			</ul>
		</div>
		<h1 id="titulo" class="text-2xl font-bold">Caixa da Comunidade</h1>
		<div class="chat chat-start py-0">
			<div class="w-12" />
			<div class="chat-header">Estranho na internet</div>
			<div class="chat-bubble">Psst, chega aqui!</div>
		</div>
		<div class="chat chat-start py-0">
			<div class="w-12" />
			<div class="chat-bubble">
				Sim, tu! Não sejas tímido!<br />
				Não guardes as tuas ideias só para ti!
			</div>
		</div>
		<div class="chat chat-start py-0">
			<div class="w-12" />
			<div class="chat-bubble">
				Olha, aqui entre nós... o que tu precisas mesmo é de amigos que te ajudem com isso!<br />
				Um espaço seguro onde podes combater a solidão e dinamizar-te.
			</div>
		</div>
		<div class="chat chat-start py-0">
			<div class="chat-image">
				<div class="w-12">
					<img alt="Intermodal" src="/favicon.png" />
				</div>
			</div>
			<div class="chat-bubble">Tenho uma ideia! Vê lá o que achas disto...</div>
		</div>
		<p class="mt-2">
			As comunidades vivem de pessoas que se juntam. Pessoas que estão confortáveis umas com as
			outras. Pessoas que entre elas sabem o que precisam para progredir.
		</p>
		<p>
			Abaixo estão algumas das pessoas que confortam o Intermodal. Receberam uma pitada de anonimato
			e tem alguns dos seus pontos fortes destacados. Pode ser que alguma seja mesmo o que precisas,
			ou quem sabe todas.
		</p>
		<p>
			Manda para os nossos contactos uma mensagem onde te apresentas (não precisas de nos dar as
			coordenadas da tua janela) e diz-nos o que precisas. Qualquer coisa entre origami e ideias
			para combater a solidão. Devolvemos-te uma resposta conforme o que acharmos razoável.<br />
			Nem sempre temos tempo e gostamos muito de espaços de respeito. Ciente disso receberás resposta.
		</p>
	</div>
</div>

<div class="card card-compact flex flex-col shadow-sm rounded-xl relative bg-slate-900">
	<svg
		class="absolute top-0 bottom-0 left-0 right-0 h-full w-full overflow-hidden rounded-xl aopacity-20"
		preserveAspectRatio="xMidYMid slice"
		viewBox="10 10 80 80"
	>
		<defs>
			<style>
				@keyframes rotate {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
				.out-top {
					animation: rotate 80s linear infinite;
					transform-origin: 13px 25px;
				}
				.in-top {
					animation: rotate 40s linear infinite;
					transform-origin: 13px 25px;
				}
				.out-bottom {
					animation: rotate 100s linear infinite;
					transform-origin: 84px 93px;
				}
				.in-bottom {
					animation: rotate 60s linear infinite;
					transform-origin: 84px 93px;
				}
			</style>
		</defs>
		<path
			fill="#006d99"
			class="out-top"
			d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
		/>
		<path
			fill="#59befe"
			class="in-top"
			d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
		/>
		<path
			fill="#6a0c6e"
			class="out-bottom"
			d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
		/>
		<path
			fill="#f78557"
			class="in-bottom"
			d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
		/>
	</svg>
	<div class="card-body rounded-xl z-10">
		<div class="flex flex-col gap-3 alternate">
			<!-- <div class="flex flex-wrap gap-3"> -->
			{#each friendos as friendo}
				<div
					class="p-3 w-fit max-w-[40em] text-white ml-12 mt-12"
					style="background: rgba(120, 130, 150, 0.50);
						border-radius: 16px;
						box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
						backdrop-filter: blur(4.5px);
						-webkit-backdrop-filter: blur(4.5px);
						border: 1px solid rgba(130, 140, 160, 0.4);"
				>
					<div class="flex gap-2 mb-2">
						{#if friendo.avatar}
							<div class="avatar -mt-16 -ml-12">
								<div class="w-32 rounded-full">
									<img src={friendo.avatar} alt="Avatar de {friendo.fakeName}" />
								</div>
							</div>
						{:else}
							<div class="avatar placeholder -mt-16 -ml-12">
								<div class="w-32 rounded-xl bg-black" />
							</div>
						{/if}
						<div>
							<h2 class="text-xl font-bold">{friendo.fakeName}</h2>
							<h3 class="text-lg">{friendo.subtitle ?? ''}</h3>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						{#each friendo.descriptions || [] as description}
							<p class="drop-shadow-lg">{description}</p>
						{/each}
					</div>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each friendo.skills as skill}
							<div class="badge badge-primary">
								{skill}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.alternate > div:nth-child(4n + 3) {
		align-self: flex-end;
	}
	.alternate > div:nth-child(4n + 3) {
		align-self: flex-end;
	}
	.alternate > div:nth-child(2n) {
		align-self: center;
	}
</style>
