<script>
	import SuppressedContent from './SuppressedContent.svelte';

	let showEmelFull = false;
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

<div class="card flex flex-col bg-base-100 shadow-xs rounded-xl relative">
	<div class="card card-sm bg-base-100 shadow-xs absolute -left-56 hidden 2xl:flex">
		<div class="card-body">
			<h2 class="card-title">Índice</h2>
			<div class="text-lg flex flex-col gap-2">
				<a class="text-primary" href="#titulo">Introdução</a>
				<a class="text-primary" href="#emel">EMEL</a>
				<a class="text-primary" href="#sair">Sair da lista</a>
			</div>
		</div>
	</div>
	<div class="card-body">
		<div class="breadcrumbs -mt-6">
			<ul>
				<li>
					<a href="/" class="btn btn-ghost btn-xs text-primary">Início</a>
				</li>
				<li>
					<a href="/iniciativas" class="btn btn-ghost btn-xs text-primary">Iniciativas</a>
				</li>
				<li>
					<a href="/iniciativas/muro-da-vergonha" class="btn btn-ghost btn-xs text-primary"
						>Muro da Vergonha</a
					>
				</li>
			</ul>
		</div>
		<h1 id="titulo" class="text-2xl font-bold">Muro da Vergonha</h1>
		<div class="flex flex-col gap-2">
			<p>
				Deparamo-nos com situações que atentam contra a sociedade. Em frustração, concluímos que
				muitas destas situações não são noticiadas; são invisíveis ao comum dos Portugueses.
			</p>
			<p>
				Nesta página não procuramos expor o que já é mediático, nem tampouco enumerar
				insuficiências. Esta página serve para denunciar comportamentos inadmissíveis à sociedade,
				isto no âmbito do projeto.<br />
				Critérios à inclusão que nos parecem razoáveis são:
			</p>
			<ul class="list-disc ml-4">
				<li>
					Situações que <a href="https://pt.wikipedia.org/wiki/Navalha_de_Hanlon" class="link"
						>apresentam fortes evidências de má fé</a
					>.
				</li>
				<li>Atentam contra o progresso da sociedade ou contra os seus cidadãos.</li>
				<li>Têm informações públicas e suficientes para exposição sem difamação.</li>
			</ul>
		</div>
		<h2 id="emel" class="text-2xl font-bold text-center">
			Empresa Municipal de Estacionamento de Lisboa (EMEL)
		</h2>
		<div>
			Ver versão:
			<div class="join">
				<button
					class="btn btn-primary btn-outline btn-sm join-item"
					class:btn-active={showEmelFull}
					on:click={() => (showEmelFull = true)}>Completa</button
				>
				<button
					class="btn btn-primary btn-outline btn-sm join-item"
					class:btn-active={!showEmelFull}
					on:click={() => (showEmelFull = false)}>Resumida</button
				>
			</div>
		</div>

		<p>
			A EMEL é uma empresa pública municipal detida pela Câmara Municipal de Lisboa. A sua presença
			mais mediática é na gestão dos estacionamentos e na fiscalização do estacionamento dentro da
			cidade. Apesar de tal, a empresa tem mais projetos para dinamizar a cidade, muitos dos quais
			manifestamente interessantes.
		</p>
		<p>
			As rede de bicicletas partilhadas <i>Gira</i> é um dos projetos na alçada da EMEL. Nas palavras
			dos próprios:
		</p>
		<cite class="border-l-2 border-neutral pl-2">
			Com a Gira, queremos transformar Lisboa numa cidade mais acessível, menos poluída, com menos
			ruído e muito menos stress.
		</cite>

		<SuppressedContent disable={showEmelFull}>
			<p>
				Naturalmente que já experimentamos o serviço e, salvo alguns fatores,
				<b>adoramos a experiência</b>. Pode ser melhorada mas é geralmente muito positiva. Os
				fatores que menos gostamos são partilhados com o que acreditamos ser a totalidade dos
				utilizadores e ex-utilizadores do serviço. "Alguma falta de bicicletas, algumas bicicletas
				com problemas e uma aplicação terrível" - dizem os utilizadores.
			</p>
			<p>
				Os sistemas que culminam na aplicação tem uma observável <b>falta de qualidade</b>. Não é o
				melhor parecer que esta peça critica poderia receber, todavia, não é a EMEL quem produz a
				aplicação; foi encomendada ao sector privado. Nós sabemos que
				<b>contratação pública é difícil</b>, não condenamos a EMEL por este lapso e, pelo
				contrário, detemos a opinião que
				<b>o sistema de contratação pública requer mudanças profundas</b>.
			</p>
		</SuppressedContent>
		<p>
			Afonso, um estudante voluntário, começou em 2023 a desenvolver a
			<a class="link" href="https://mgira.pt/"><b>aplicação <i>mGira</i></b></a>, uma forma
			alternativa de utilizar o serviço. Sendo ainda estudante, não seria expectável que Afonso
			fizesse uma aplicação a elevados padrões da industria. Ainda assim fez uma aplicação que foi
			amada pela comunidade, levando as pessoas a ficar
			<b>mais felizes com o serviço Gira</b>.
		</p>
		<SuppressedContent disable={showEmelFull}>
			<p>
				Em pouco tempo, a EMEL convocou uma reunião com Afonso. Não sendo públicas as palavras
				proferidas, sabe-se que foi uma reunião amigável e anunciada como para apresentação mutua.
			</p>
			<p>
				Sabemos por base no <a class="link" href="https://github.com/afonsosousah/mGira"
					>código público</a
				>
				da <i>mGira</i> que
				<b>esta aplicação não é imaculada em matéria de segurança</b>. Devido à implementação dos
				serviços da EMEL e às tecnologias que Afonso escolheu, Afonso viu-se obrigado a criar um
				serviço que intermedeia as credenciais dos utilizadores. Esta escolha de design cria
				superfície de ataque desnecessária. Foi uma escolha sub-ótima que
				<b>pode expor os utilizadores a riscos</b>.
			</p>
		</SuppressedContent>
		<p>
			Dois outros jovens, Tiago e Rodrigo, foram falar com Afonso a fim de o apoiar. Sendo estes
			mais experientes, optaram por desenvolver outra aplicação, a
			<a href="https://github.com/rt-evil-inc/gira" class="link"><i>Gira+</i></a>. Esta aplicação é,
			na nossa opinião, mais refinada e feita às boas práticas profissionais. Adicionalmente
			<b>não tem as vulnerabilidades de segurança da <i>mGira</i></b>.
		</p>
		<p>
			Assim que a <i>Gira+</i> foi publicada, em Dezembro de 2023, deu-se um insólito. Um individuo
			que temos motivos para acreditar ser José Rosa, um dos diretores da EMEL, enviou um
			<a class="link" href="https://github.com/rt-evil-inc/gira/issues/2"
				>comentário de mau tom aos criadores da aplicação Gira+</a
			>:
		</p>

		<cite class="border-l-2 border-neutral pl-2">
			Calculo que vocês estejam autorizados pela EMEL a usar a API....vai ser giro quando a EMEL
			trancar a coisa.
		</cite>
		<p>
			Deu-se um seguimento onde, de acordo com a nossa interpretação, <b
				>José Rosa insistiu em argumentos de má fé</b
			> antagonizando a comunidade. Foram-lhe apresentados argumentos como o respeito pelas regras da
			EMEL e o facto que estas aplicações estão a fazer as pessoas mais felizes com as GIRA, bem como
			desta e inclusive as ilegalidades que José Rosa poderia estar a cometer enquanto no exercício do
			cargo público a ameaçar desrespeitar cidadãos e possivelmente até seus direitos.
		</p>
		<p>
			Apesar de possível que este insólito tenha partido um dia mau onde José Rosa optou por largar
			as suas frustrações numa
			<b>comunidade que, além de positiva, se encontrava no exercício dos seus direitos</b>, o
			insólito não finalizou a cadeia de eventos.
		</p>
		<p>
			Surge então em Abril de 2024 um novo <a
				class="link"
				href="https://www.base.gov.pt/Base4/pt/detalhe/?type=contratos&id=10695934"
				>contrato público</a
			> onde a EMEL pagará 19.116€ a uma consultora. Num documento é possível ler:
		</p>
		<cite class="border-l-2 border-neutral pl-2">
			A App Gira é uma solução [...] <b>já sem suporte</b>. Os utilizadores têm reportado problemas,
			<b>queixando-se da experiência</b>.<br />
			Um utilizador desenvolveu a sua própria versão não oficial que <b>está a ser bem recebida</b>
			pela comunidade, mas está <b>a explorar um conjunto não autorizado de recursos da EMEL</b>.<br
			/>
			A EMEL quer mitigar o acesso não autorizado e também
			<b>proporcionar uma experiência adequada aos utilizadores</b>. A expectativa é que
			<b>nesta fase possamos apresentar uma mitigação imediata</b>
			[...] para superar as limitações e
			<b>proteger os serviços da EMEL usados indevidamente. </b>
		</cite>
		<p>
			Existe nuance à interpretação nestas matérias. As entidades, sejam públicas ou privadas, têm
			naturalmente direito a proteger os seus serviços em matérias como a exposição da marca e
			abusos à segurança. Uma empresa como a EMEL está no seu direito de agir nessas matérias. No
			entanto, acreditamos que o caso é ilegítimo.
		</p>
		<SuppressedContent disable={showEmelFull}>
			<p>
				A aplicação oficial, a <i>mGira</i> e a <i>Gira+</i> são <b>clientes</b>.
				<b>Cliente</b> é designação para lógica no lado do consumidor, termo que contrasta com
				<b>servidor</b>, lógica no lado do produtor. Um rádio é um cliente e uma torre de
				transmissão é o seu servidor.
			</p>
			<p>
				Neste documento confessa-se que a aplicação oficial está sem suporte, que os utilizadores se
				queixam dela, e que estes mesmos utilizadores estão satisfeitos com uma outra, possivelmente
				a <i>mGira</i>. O argumento é o de recursos não autorizados.
			</p>
			<p>
				A arquitetura cliente-servidor é o fundamento de uma maioria da internet. Caso uma pessoa
				navegue com uma aplicação cliente (como o navegador) a um servidor (como
				<a href="https://meuperfil.emel.pt/" class="link">https://meuperfil.emel.pt/</a>) e este lhe
				responda com conteúdos, a pessoa <b>não está a aceder a recursos não autorizados</b>. Isto é
				<b>indiferente do cliente estar a utilizar uma conta</b>. Acesso não autorizado é quando uma
				pessoa encontra um lapso técnico que permite contornar medidas de segurança, tal que o
				servidor autoriza o que seria caso contrário não autorizado. O servidor da EMEL aceitou
				servir os clientes <i>mGira</i> e <i>Gira+</i>. Estas aplicações não defraudaram nem
				desbloquearam recursos que seriam inacessíveis; utilizaram a conta que o utilizador lhes
				cedeu <b>voluntariamente e com intenção</b> e comportaram-se como a aplicação oficial se
				comportaria. <b>Alegar que se deu um acesso não autorizado é falso</b>.
			</p>
		</SuppressedContent>
		<p>
			Além da falta de mérito técnico nos argumentos, a EMEL implica que qualquer solução que não
			seja explicitamente aprovada é ilegítima, independentemente da satisfação do público. Expressa
			ainda que sente urgência de privar os utilizadores do trabalho da comunidade antes de dar uma
			alternativa adequada, isto em nome de uma segurança insustentada pela realidade.
		</p>

		<SuppressedContent disable={showEmelFull}>
			<p>
				Os mencionados lapsos de segurança da <i>mGira</i> dizem respeito à
				<b>segurança do utilizador</b>, não à segurança dos serviços da EMEL. A segurança dos
				serviços da EMEL só seria posta em causa se estas aplicações fizessem uma utilização
				irrazoavelmente alta de recursos ou se o serviço do qual a
				<i>mGira</i> depende comprometesse as credenciais de utilizadores. Isto
				<b>nunca aconteceu nem é um risco na <i>Gira+</i></b>.
			</p>
			<p>
				A direção da EMEL age tão desfasada da realidade ou tão vinculada à má fé que se esquece que
				são uma empresa pública que vive de dinheiros públicos. Esqueceu-se que não serve o José
				Rosa ou qualquer outro ofendido interno mas sim o cidadão Lisboeta. Esqueceu-se que as leis
				estão a ser escritas no sentido de dados e serviços abertos, de interoperabilidade; não de
				aplicações proprietárias, fechadas, fruto de contratos dispendiosos e sem o devido
				escrutínio.
			</p>
			<p>
				Enquanto cereja no topo do bolo, a direção da EMEL esquece-se que não tem competência
				técnica para concluir se as medidas contratadas realmente vão impedir a <i>mGira</i> ou a
				<i>Gira+</i> de funcionar. Não vão! Estas aplicações apenas verão a sua disseminação dificultada,
				mas conseguirão trivialmente contornar as dispendiosas dificuldades adquiridas pela EMEL.
			</p>
		</SuppressedContent>
		<p>
			Se a EMEL tivesse abraçado a comunidade teria boas aplicações gratuitamente, teria um a dizer
			no desenvolvimento destas, teria serviços de qualidade, teria uma comunidade feliz. Se a EMEL
			tivesse ignorado estas aplicações, elas coexistiriam pacificamente por entre um nicho de
			interessados. Todavia, <b>a EMEL optou por por lutar uma guerra contra contra o cidadão</b>. É
			esse o motivo que nos leva a criar este Muro da Vergonha e estreá-lo com a triste direção
			desta empresa.
		</p>

		<h2 id="sair" class="text-2xl font-bold">Sair da lista</h2>
		<p>
			Esta lista quer-se vazia. Tratamos de remover as publicações assim que se retraiam os motivos
			que nos levam a condenar estas entidades. Não implicamos que tal passe por demissões.
			Idealmente, as entidades chegam adiante, admitem os seus erros, corrigem-nos e tal chegará.
		</p>
		<p>
			Também somos abertos a explicações para o porquê de tudo ter sido um grande mal entendido, até
			porque somos humanos. Estamos no entanto confiantes que fomos diligentes antes de publicar
			estes conteúdos.
		</p>
	</div>
</div>
