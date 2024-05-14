<script>
    export let disable = false;
	let suppressed = true;
</script>

<div class="transition-all overflow-y-hidden  flex flex-col gap-2" class:h-0={suppressed && !disable}>
	<slot />
</div>
<div class="rounded-full flex justify-center" class:hidden={!suppressed || disable}>
	<button
		class="btn btn-xs"
		on:click={() => {
			suppressed = false;
		}}>Ver conteúdo suprimido</button
	>
</div>
