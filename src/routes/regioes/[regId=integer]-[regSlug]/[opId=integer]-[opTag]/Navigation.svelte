<script>
	import { operatorWithinRegionUrl } from '$lib/urls.js';

	export let region;
	export let operator;
	export let page = 'root';
</script>

<div class="w-full flex flex-col gap-2">
    {#if operator.logo_url}
        <img
            class="h-full max-w-16 sm:max-w-96 max-h-12 self-start"
            alt="Logotipo de {operator.name}"
            src={operator.logo_url}
        />
    {/if}
    <div class="flex justify">
        <span class="text-2xl font-bold">{operator.name}</span>
    </div>
</div>
<div role="alert" class="border-l-2 border-warning p-2 text-xs" class:hidden={operator.id == 1}>
    <span>Não representamos a {operator.name}.</span>
</div>
<div role="tablist" class="tabs tabs-lg tabs-bordered">
	<a
		role="tab"
		class="tab"
		class:tab-active={page == 'root'}
		href={operatorWithinRegionUrl(region, operator)}
        data-sveltekit-preload-data="hover">Geral</a
	>
	<a
		role="tab"
		class="tab"
		href={operatorWithinRegionUrl(region, operator) + '/linhas'}
		class:tab-active={page == 'routes'}
        data-sveltekit-preload-data="hover">Linhas</a
	>
	<!-- <a role="tab" class="tab" href={operatorWithinRegionUrl(region, operator) + '/rede'}>Rede</a> -->
	<a
		role="tab"
		class="tab"
		href={operatorWithinRegionUrl(region, operator) + '/noticias'}
		class:tab-active={page == 'news'}
        data-sveltekit-preload-data="hover">Notícias</a
	>
</div>
