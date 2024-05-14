<!-- Intermodal, transportation information aggregator
    Copyright (C) 2023  Cláudio Pereira

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
	import mubi from './logos/mubi.jpg';
	import osm from './logos/osm.svg';
	import ansol from './logos/ansol.svg';
	import d3 from './logos/d3.svg';
	import wikimedia from './logos/wikimedia.svg';
	import zero from './logos/zero.svg';
	import geota from './logos/geota.svg';
	import bragaciclavel from './logos/bragaciclavel.svg';
	import ciclaveiro from './logos/ciclaveiro.svg';
	import lpp from './logos/lpp.svg';
	import lisboapossivel from './logos/lisboapossivel.png';
</script>

<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<div class="breadcrumbs -mt-6">
			<ul>
				<li>
					<a href="/" class="btn btn-ghost btn-xs text-primary">Início</a>
				</li>
				<li>
					<a href="/familia" class="btn btn-ghost btn-xs text-primary">Família de projetos</a>
				</li>
			</ul>
		</div>
		<h2 class="card-title">Família de projetos</h2>
		<p>
			Existem diversos projetos alem do Intermodal que visam desenvolver trabalho em áreas que nos
			são de interesse.. Gostaríamos de lhes dar algum destaque.
		</p>
	</div>
</div>
<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<h2 class="card-title">Âmbito Nacional</h2>

		<div class="flex flex-col gap-4">
			<a
				href="https://www.openstreetmap.org/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={osm} alt="OpenStreetMap" class="w-24 h-24" />
				<div>
					<h2 class="font-bold">OpenStreetMap</h2>
					<p>O OpenStreetMap visa fazer mapeamento à escala mundial em regime de dados abertos.</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-pink-400">Cultura</div>
						<div class="badge bg-rose-400">Direitos digitais</div>
						<div class="badge bg-blue-400">Mobilidade</div>
					</div>
				</div>
			</a>
			<a
				href="https://zero.ong"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={zero} alt="Logótipo Zero" class="w-24" />
				<div>
					<h2 class="font-bold">Zero</h2>
					<p>
						A Zero tem como missão é tornar a sustentabilidade no elemento estruturante das
						políticas públicas.
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-green-400">Ambiente</div>
						<div class="badge bg-blue-400">Mobilidade</div>
					</div>
				</div>
			</a>
			<a
				href="https://www.geota.pt/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={geota} alt="Logótipo GEOTA" class="w-24" />
				<div>
					<h2 class="font-bold">GEOTA</h2>
					<p>
						O GEOTA tem por missão promover o desenvolvimento sustentável e a conservação do
						património natural e cultural, mediante a capacitação de cidadãos para se tornarem
						agentes ativos de educação, intervenção e advocacia ambiental.
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-green-400">Ambiente</div>
						<div class="badge bg-blue-400">Mobilidade</div>
					</div>
				</div>
			</a>
			<a
				href="https://mubi.pt/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={mubi} alt="Logótipo da Mubi" class="w-24 self-start" />
				<div>
					<h2 class="font-bold">Associação pela Mobilidade Urbana em Bicicleta</h2>
					<p>
						A MUBi assume como sua missão ajudar a criar condições para que qualquer pessoa possa
						utilizar a bicicleta de forma fácil, agradável, eficiente e segura, e que os benefícios
						desta opção sejam amplamente reconhecidos.
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-blue-400">Mobilidade</div>
					</div>
				</div>
			</a>
			<a
				href="https://pt.wikimedia.org/wiki/Wikimedia_Portugal"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={wikimedia} alt="Logótipo Wikimedia" class="w-24" />
				<div>
					<h2 class="font-bold">Wikimedia</h2>
					<p>
						Organização para a disseminação generalizada do saber e da cultura, através do incentivo
						à recolha, criação e difusão de conteúdos isentos de restrições de utilização,
						modificação e distribuição
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-pink-400">Cultura</div>
						<div class="badge bg-rose-400">Direitos digitais</div>
					</div>
				</div>
			</a>
			<a
				href="https://ansol.org/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={ansol} alt="Logótipo ANSOL" class="w-24 self-start" />
				<div>
					<h2 class="font-bold">Associação Nacional para o Software Livre</h2>
					<p>
						A ANSOL é uma associação que tem como fim a divulgação, promoção, desenvolvimento,
						investigação e estudo da Informática Livre e das suas repercussões sociais, políticas,
						filosóficas, culturais, técnicas e científicas.
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-rose-400">Direitos digitais</div>
					</div>
				</div>
			</a>
			<a
				href="https://direitosdigitais.pt/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<img src={d3} alt="Logótipo D3" class="w-24 h-24" />
				<div>
					<h2 class="font-bold">Defesa dos Direitos Digitais</h2>
					<p>A D3 atua em problemas relacionados com direitos humanos em contexto tecnológico.</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-rose-400">Direitos digitais</div>
					</div>
				</div>
			</a>
			<a
				href="https://aterra.info/"
				target="_blank"
				class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
			>
				<div>
					<h2 class="font-bold">ATERRA</h2>
					<p>
						ATERRA é um movimento de indivíduos e grupos em Portugal que defende a redução do
						tráfego aéreo e uma forma de mobilidade mais justa, mais ecologia e mais enriquecedora.
					</p>
					<div class="flex flex-wrap gap-2">
						<div class="badge bg-blue-400">Mobilidade</div>
					</div>
				</div>
			</a>
		</div>
	</div>
</div>
<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<h2 class="card-title">Âmbito Regional</h2>
		<a
			href="https://lisboaparapessoas.pt/"
			target="_blank"
			class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
		>
			<img src={lpp} alt="Logótipo Lisboa para Pessoas" class="w-24" />
			<div>
				<h2 class="font-bold">Lisboa para Pessoas</h2>
				<p>
					O Lisboa Para Pessoas é um jornal local e portal comunitário sobre a Lisboa metropolitana,
					que reúne informação, ferramentas e pessoas.
				</p>
				<div class="flex flex-wrap gap-2">
					<div class="badge bg-purple-400">Comunicação Social</div>
					<div class="badge bg-teal-400">Urbanismo</div>
					<div class="badge bg-blue-400">Mobilidade</div>
					<div class="badge bg-pink-400">Cultura</div>
					<div class="badge border-yellow-500 badge-outline bg-white">Lisboa</div>
				</div>
			</div>
		</a>
		<a
			href="https://bragaciclavel.pt/"
			target="_blank"
			class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
		>
			<img src={bragaciclavel} alt="Logótipo Braga Ciclável" class="w-24" />
			<div>
				<h2 class="font-bold">Braga Ciclável</h2>
				<p>
					Associação promove o uso quotidiano da bicicleta como modo de transporte. Pretende
					contribuir para a melhoria de condições de segurança e conforto, com vista a expandir esse
					uso e tornar Braga uma cidade onde seja mais seguro e mais agradável viver.
				</p>
				<div class="flex flex-wrap gap-2">
					<div class="badge bg-blue-400">Mobilidade</div>
					<div class="badge border-yellow-500 badge-outline bg-white">Braga</div>
				</div>
			</div>
		</a>
		<a
			href="https://bragaciclavel.pt/"
			target="_blank"
			class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
		>
			<img src={ciclaveiro} alt="Logótipo Ciclaveiro" class="w-24" />
			<div>
				<h2 class="font-bold">Ciclaveiro</h2>
				<p>
					Associação que promove a utilização da bicicleta como meio de deslocação para melhorar a
					qualidade de vida das pessoas em Aveiro.
				</p>
				<div class="flex flex-wrap gap-2">
					<div class="badge bg-blue-400">Mobilidade</div>
					<div class="badge border-yellow-500 badge-outline bg-white">Aveiro</div>
				</div>
			</div>
		</a>
		<a
			href="https://lisboapossivel.pt/"
			target="_blank"
			class="flex flex-col sm:flex-row gap-3 p-4 hover:bg-base-300 rounded-lg"
		>
			<img src={lisboapossivel} alt="Logótipo Lisboa Possível" class="w-24 self-start" />
			<div>
				<h2 class="font-bold">Lisboa Possível</h2>
				<p>
					Caminhar, brincar, pedalar e respirar. Querem pessoas que amam a cidade de Lisboa e agem
					para tornar estas coisas possíveis.
				</p>
				<div class="flex flex-wrap gap-2">
					<div class="badge bg-teal-400">Urbanismo</div>
					<div class="badge bg-blue-400">Mobilidade</div>
					<div class="badge border-yellow-500 badge-outline bg-white">Lisboa</div>
				</div>
			</div>
		</a>
	</div>
</div>
<div class="card bg-base-100 w-full shadow-sm gap-4 px-2 lg:px-0">
	<div class="card-body">
		<h2 class="card-title">Outros projetos</h2>
		<p>
			O Intermodal não apoia causas com alinhamento politico políticas nem metodologias extremistas.
			Consideramos essencial não alienar o cidadão e vingar respeitando os demais. Projetos
			alinhados com estes ideais são bem-vindos a apresentar-se.
		</p>
		<h2 class="card-title">"Estes projetos defendem ideais conflituosos"</h2>
		<p>
			Não defendemos todas as posições tomadas por estes projetos nem a inflexibilidade de algumas
			destas posições, acreditamos todavia que sejam causas razoáveis com boas intenções e
			fortemente baseadas em ciência.
		</p>
		<p>
			Existe um esforço no sentido do debate. Esperamos ajudar a unir o panorama ativista nacional e
			promover a sinergia e consistência de iniciativas.
		</p>
	</div>
</div>
