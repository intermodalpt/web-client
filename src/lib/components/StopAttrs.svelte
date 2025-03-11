<script>
	import abusiveParking from '$lib/icons/stopattrs/abusive-parking.svg';
	import accessible from '$lib/icons/stopattrs/accessible.svg';
	import accessibleNot from '$lib/icons/stopattrs/accessible-not.svg';
	import bench from '$lib/icons/stopattrs/bench.svg';
	import benchNot from '$lib/icons/stopattrs/bench-not.svg';
	import crossing from '$lib/icons/stopattrs/crossing.svg';
	import crossingNot from '$lib/icons/stopattrs/crossing-not.svg';
	import damaged from '$lib/icons/stopattrs/damaged.svg';
	import flag from '$lib/icons/stopattrs/flag.svg';
	import flagNot from '$lib/icons/stopattrs/flag-not.svg';
	import garbage from '$lib/icons/stopattrs/garbage.svg';
	import garbageNot from '$lib/icons/stopattrs/garbage-not.svg';
	import lightFull from '$lib/icons/stopattrs/light-full.svg';
	import lightHalf from '$lib/icons/stopattrs/light-half.svg';
	import lightNone from '$lib/icons/stopattrs/light-none.svg';
	import schedules from '$lib/icons/stopattrs/schedules.svg';
	import schedulesNot from '$lib/icons/stopattrs/schedules-not.svg';
	import shelter from '$lib/icons/stopattrs/shelter.svg';
	import shelterNot from '$lib/icons/stopattrs/shelter-not.svg';
	import sidewalk from '$lib/icons/stopattrs/sidewalk.svg';
	import sidewalkNot from '$lib/icons/stopattrs/sidewalk-not.svg';
	import visibility from '$lib/icons/stopattrs/visibility.svg';
	import visibilityNot from '$lib/icons/stopattrs/visibility-not.svg';
	import visibilityWithin from '$lib/icons/stopattrs/visibility-within.svg';
	import visibilityWithinNot from '$lib/icons/stopattrs/visibility-within-not.svg';
	import visible from '$lib/icons/stopattrs/visible.svg';
	import visibleNot from '$lib/icons/stopattrs/visible-not.svg';

	export let stop;

	export let showPrimary = true;
	export let showSecondary = true;
</script>

<div class="flex flex-wrap gap-1">
	{#if showPrimary}
		{#if stop.a11y.has_crossing === true}
			<div class="tooltip" data-tip="Com atravessamento de via">
				<img class="h-12" src={crossing} alt="Atravessamento de via" />
			</div>
		{:else if stop.a11y.has_crossing === false}
			<div class="tooltip" data-tip="Sem atravessamento de via">
				<img class="h-12" src={crossingNot} alt="Atravessamento de via" />
			</div>
		{/if}
		{#if stop.a11y.has_accessibility === true}
			<div class="tooltip" data-tip="Adequada a mobilidade reduzida">
				<img class="h-12" src={accessible} alt="Mobilidade reduzida" />
			</div>
		{/if}
		{#if stop.a11y.is_illumination_working === false}
			<div class="tooltip" data-tip="Falta de iluminação">
				<img class="h-12" src={lightNone} alt="Falta de iluminação" />
			</div>
		{:else if stop.a11y.is_illumination_working === true}
			{#if stop.a11y.illumination_strength || 0 > 3}
				<div class="tooltip" data-tip="Boa iluminação">
					<img class="h-12" src={lightFull} alt="Boa iluminação" />
				</div>
			{:else if stop.a11y.illumination_strength || 0 > 0}
				<div class="tooltip" data-tip="Falta de iluminação">
					<img class="h-12" src={lightNone} alt="Falta de iluminação" />
				</div>
			{/if}
		{/if}
		{#if stop.a11y.has_abusive_parking === true}
			<div class="tooltip" data-tip="Estacionamento abusivo">
				<img class="h-12" src={abusiveParking} alt="Estacionamento abusivo" />
			</div>
		{/if}
		{#if stop.a11y.has_accessibility === false}
			<div class="tooltip" data-tip="Inadequada a mobilidade reduzida">
				<img class="h-12" src={accessibleNot} alt="Inadequada a mobilidade reduzida" />
			</div>
		{/if}
		{#if stop.a11y.is_damaged === true}
			<div class="tooltip" data-tip="Danificada">
				<img class="h-12" src={damaged} alt="Danificada" />
			</div>
		{/if}
		{#if stop.a11y.has_flag === false || (stop.a11y.has_flag !== true && stop.a11y.has_outdated_info === true)}
			<div class="tooltip" data-tip="Sem identificação">
				<img class="h-12" src={flagNot} alt="Sem identificação" />
			</div>
		{/if}
		{#if stop.a11y.has_schedules === false || (stop.a11y.has_schedules !== true && stop.a11y.has_outdated_info === true)}
			<div class="tooltip" data-tip="Sem horários atualizados">
				<img class="h-12" src={schedulesNot} alt="Sem horários atualizados" />
			</div>
		{/if}
		{#if stop.a11y.has_sidewalk === false}
			<div class="tooltip" data-tip="Sem passeio">
				<img class="h-12" src={sidewalkNot} alt="Sem passeio" />
			</div>
		{/if}
		{#if stop.a11y.has_shelter === false}
			<div class="tooltip" data-tip="Sem abrigo">
				<img class="h-12" src={shelterNot} alt="Sem abrigo" />
			</div>
		{/if}
		{#if stop.a11y.has_bench === false}
			<div class="tooltip" data-tip="Sem banco">
				<img class="h-12" src={benchNot} alt="Sem banco" />
			</div>
		{/if}
		{#if stop.a11y.has_trash_can === false}
			<div class="tooltip" data-tip="Sem balde do lixo">
				<img class="h-12" src={garbageNot} alt="Sem balde do lixo" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_area === false}
			<div class="tooltip" data-tip="Sem visibilidade">
				<img class="h-12" src={visibilityNot} alt="Sem visibilidade" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_within === false}
			<div class="tooltip" data-tip="Sem visibilidade exterior">
				<img class="h-12" src={visibilityWithinNot} alt="Sem visibilidade exterior" />
			</div>
		{/if}
		{#if stop.a11y.is_visible_from_outside === false}
			<div class="tooltip" data-tip="Difícil visibilidade para o motorista">
				<img class="h-12" src={visibilityNot} alt="Difícil visibilidade para o motorista" />
			</div>
		{/if}
		{#if stop.a11y.has_shelter === true}
			<div class="tooltip z-10000" data-tip="Abrigo">
				<img class="h-12" src={shelter} alt="Abrigo" />
			</div>
		{/if}
		{#if stop.a11y.has_bench === true}
			<div class="tooltip z-10000" data-tip="Banco">
				<img class="h-12" src={bench} alt="Banco" />
			</div>
		{/if}
	{/if}
	{#if showSecondary}
		{#if stop.a11y.has_flag === true}
			<div class="tooltip z-10000" data-tip="Identificada">
				<img class="h-12" src={flag} alt="Identificada" />
			</div>
		{/if}
		{#if stop.a11y.has_schedules === true}
			<div class="tooltip z-10000" data-tip="Horários">
				<img class="h-12" src={schedules} alt="Horários" />
			</div>
		{/if}
		{#if stop.a11y.has_sidewalk === true}
			<div class="tooltip z-10000" data-tip="Passeio">
				<img class="h-12" src={sidewalk} alt="Passeio" />
			</div>
		{/if}
		{#if stop.a11y.has_trash_can === true}
			<div class="tooltip z-10000" data-tip="Balde do Lixo">
				<img class="h-12" src={garbage} alt="Balde do Lixo" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_area === true}
			<div class="tooltip z-10000" data-tip="Visibilidade">
				<img class="h-12" src={visibility} alt="Visibilidade" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_within === true}
			<div class="tooltip z-10000" data-tip="Visibilidade exterior">
				<img class="h-12" src={visibilityWithin} alt="Visibilidade exterior" />
			</div>
		{/if}
		{#if stop.a11y.is_visible_from_outside === true}
			<div class="tooltip z-10000" data-tip="Facilmente visível pelo motorista">
				<img class="h-12" src={visible} alt="Facilmente visível pelo motorista" />
			</div>
		{/if}
	{/if}
</div>
