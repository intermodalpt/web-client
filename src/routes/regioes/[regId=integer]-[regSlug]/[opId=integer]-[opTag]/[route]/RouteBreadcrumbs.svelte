<script>
	import { operatorWithinRegionUrl, regionUrl, routeInfoWithinRegionUrl } from '$lib/urls';

	let { region, operator, route } = $props();
</script>

<div class="breadcrumbs">
	<ul>
		<li>
			<a href={regionUrl(region)} class="btn btn-ghost btn-xs text-primary">{region?.name}</a>
		</li>
		<li>
			<a href={operatorWithinRegionUrl(region, operator)} class="btn btn-ghost btn-xs text-primary">
				{operator.name}
			</a>
		</li>
		<li>
			<a
				href={routeInfoWithinRegionUrl(region, operator, route)}
				class="btn btn-ghost btn-xs text-primary"
			>
				{route.code || route.name}
			</a>
		</li>
	</ul>
</div>
