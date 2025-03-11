<script>
	import gitlab from '$lib/icons/brands/gitlab.svg';
	import github from '$lib/icons/brands/github.svg';
	import mastodon from '$lib/icons/brands/mastodon.svg';
</script>

<footer
	class="footer sm:footer-horizontal p-10 bg-base-300 text-base-content rounded-t-xl w-[min(960px,100%)] self-center"
>
	<nav>
		<h6 class="footer-title">Sub-projetos</h6>
		<a class="link link-hover" href="https://editor.intermodal.pt/">Editor</a>
		<a class="link link-hover" href="https://biblioteca.intermodal.pt/">Biblioteca</a>
		<a class="link link-hover" href="https://forum.intermodal.pt/">Forum</a>
		<a class="link link-hover" href="/andorinhas">Andorinhas</a>
	</nav>
	<nav>
		<h6 class="footer-title">Informações</h6>
		<a class="link link-hover" href="/sobre">Sobre nós</a>
		<a class="link link-hover" href="/faq">Perguntas frequentes</a>
		<a class="link link-hover" href="/licencas">Licenças</a>
	</nav>
	<nav>
		<h6 class="footer-title">Projetos amigos</h6>
		<a href="https://openstreetmap.org" target="_blank" class="link link-hover">OpenStreetMap</a>
		<a href="https://lisboaparapessoas.pt" target="_blank" class="link link-hover"
			>Lisboa Para Pessoas</a
		>
		<a href="https://ansol.org/" target="_blank" class="link link-hover">ANSOL</a>
	</nav>
	<nav class="md:justify-self-end self-end">
		<div class="grid grid-flow-col gap-4">
			<a href="https://ciberlandia.pt/@intermodal">
				<img src={mastodon} class="w-10 drop-shadow-xs" alt="Mastodon" />
			</a>
			<a href="https://gitlab.com/intermodalpt">
				<img src={gitlab} class="w-10 drop-shadow-xs" alt="Gitlab" />
			</a>
			<a href="https://github.com/intermodalpt">
				<img src={github} class="w-10 drop-shadow-xs" alt="Github" />
			</a>
		</div>
	</nav>
</footer>
