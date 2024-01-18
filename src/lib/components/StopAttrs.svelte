<script>
	export let stop;

	export let showPrimary = true;
	export let showSecondary = true;
</script>

<div class="flex flex-wrap gap-1">
	{#if showPrimary}
		{#if stop.a11y.has_crossing === true}
			<div class="tooltip" data-tip="Com atravessamento de via">
				<img class="h-12" src="/stopattrs/crossing.svg" alt="Atravessamento de via" />
			</div>
		{/if}
		{#if stop.a11y.has_accessibility === true}
			<div class="tooltip" data-tip="Adequada a mobilidade reduzida">
				<img class="h-12" src="/stopattrs/accessible.svg" alt="Mobilidade reduzida" />
			</div>
		{/if}
		{#if stop.a11y.is_illumination_working === false}
			<div class="tooltip" data-tip="Falta de iluminação">
				<img class="h-12" src="/stopattrs/light-none.svg" alt="Falta de iluminação" />
			</div>
		{:else if stop.a11y.is_illumination_working === true}
			{#if stop.a11y.illumination_strength || 0 > 3}
				<div class="tooltip" data-tip="Boa iluminação">
					<img class="h-12" src="/stopattrs/light-full.svg" alt="Boa iluminação" />
				</div>
			{:else if stop.a11y.illumination_strength || 0 > 0}
				<div class="tooltip" data-tip="Falta de iluminação">
					<img class="h-12" src="/stopattrs/light-half.svg" alt="Falta de iluminação" />
				</div>
			{/if}
		{/if}
		{#if stop.a11y.has_abusive_parking === true}
			<div class="tooltip" data-tip="Estacionamento abusivo">
				<img class="h-12" src="/stopattrs/abusive-parking.svg" alt="Estacionamento abusivo" />
			</div>
		{/if}
		{#if stop.a11y.has_accessibility === false}
			<div class="tooltip" data-tip="Inadequada a mobilidade reduzida">
				<img
					class="h-12"
					src="/stopattrs/accessible-not.svg"
					alt="Inadequada a mobilidade reduzida"
				/>
			</div>
		{/if}
		{#if stop.a11y.is_damaged === true}
			<div class="tooltip" data-tip="Danificada">
				<img class="h-12" src="/stopattrs/damaged.svg" alt="Danificada" />
			</div>
		{/if}
		{#if stop.a11y.has_flag === false || (stop.a11y.has_flag !== true && stop.a11y.has_outdated_info === true)}
			<div class="tooltip" data-tip="Sem identificação">
				<img class="h-12" src="/stopattrs/flag-not.svg" alt="Sem identificação" />
			</div>
		{/if}
		{#if stop.a11y.has_schedules === false || (stop.a11y.has_schedules !== true && stop.a11y.has_outdated_info === true)}
			<div class="tooltip" data-tip="Sem horários atualizados">
				<img class="h-12" src="/stopattrs/schedules-not.svg" alt="Sem horários atualizados" />
			</div>
		{/if}
		{#if stop.a11y.has_sidewalk === false}
			<div class="tooltip" data-tip="Sem passeio">
				<img class="h-12" src="/stopattrs/sidewalk-not.svg" alt="Sem passeio" />
			</div>
		{/if}
		{#if stop.a11y.has_shelter === false}
			<div class="tooltip" data-tip="Sem abrigo">
				<img class="h-12" src="/stopattrs/shelter-not.svg" alt="Sem abrigo" />
			</div>
		{/if}
		{#if stop.a11y.has_bench === false}
			<div class="tooltip" data-tip="Sem banco">
				<img class="h-12" src="/stopattrs/bench-not.svg" alt="Sem banco" />
			</div>
		{/if}
		{#if stop.a11y.has_trash_can === false}
			<div class="tooltip" data-tip="Sem balde do lixo">
				<img class="h-12" src="/stopattrs/garbage-not.svg" alt="Sem balde do lixo" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_area === false}
			<div class="tooltip" data-tip="Sem visibilidade">
				<img class="h-12" src="/stopattrs/visibility-not.svg" alt="Sem visibilidade" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_within === false}
			<div class="tooltip" data-tip="Sem visibilidade exterior">
				<img
					class="h-12"
					src="/stopattrs/visibility-within-not.svg"
					alt="Sem visibilidade exterior"
				/>
			</div>
		{/if}
		{#if stop.a11y.is_visible_from_outside === false}
			<div class="tooltip" data-tip="Difícil visibilidade para o motorista">
				<img
					class="h-12"
					src="/stopattrs/visible-not.svg"
					alt="Difícil visibilidade para o motorista"
				/>
			</div>
		{/if}
		{#if stop.a11y.has_shelter === true}
			<div class="tooltip z-[10000]" data-tip="Abrigo">
				<img class="h-12" src="/stopattrs/shelter.svg" alt="Abrigo" />
			</div>
		{/if}
		{#if stop.a11y.has_bench === true}
			<div class="tooltip z-[10000]" data-tip="Banco">
				<img class="h-12" src="/stopattrs/bench.svg" alt="Banco" />
			</div>
		{/if}
	{/if}
	{#if showSecondary}
		{#if stop.a11y.has_flag === true}
			<div class="tooltip z-[10000]" data-tip="Identificada">
				<img class="h-12" src="/stopattrs/flag.svg" alt="Identificada" />
			</div>
		{/if}
		{#if stop.a11y.has_schedules === true}
			<div class="tooltip z-[10000]" data-tip="Horários">
				<img class="h-12" src="/stopattrs/schedules.svg" alt="Horários" />
			</div>
		{/if}
		{#if stop.a11y.has_sidewalk === true}
			<div class="tooltip z-[10000]" data-tip="Passeio">
				<img class="h-12" src="/stopattrs/sidewalk.svg" alt="Passeio" />
			</div>
		{/if}
		{#if stop.a11y.has_trash_can === true}
			<div class="tooltip z-[10000]" data-tip="Balde do Lixo">
				<img class="h-12" src="/stopattrs/garbage.svg" alt="Balde do Lixo" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_area === true}
			<div class="tooltip z-[10000]" data-tip="Visibilidade">
				<img class="h-12" src="/stopattrs/visibility.svg" alt="Visibilidade" />
			</div>
		{/if}
		{#if stop.a11y.has_visibility_from_within === true}
			<div class="tooltip z-[10000]" data-tip="Visibilidade exterior">
				<img class="h-12" src="/stopattrs/visibility-within.svg" alt="Visibilidade exterior" />
			</div>
		{/if}
		{#if stop.a11y.is_visible_from_outside === true}
			<div class="tooltip z-[10000]" data-tip="Facilmente visível pelo motorista">
				<img class="h-12" src="/stopattrs/visible.svg" alt="Facilmente visível pelo motorista" />
			</div>
		{/if}
	{/if}
</div>
