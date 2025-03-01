import slugify from '$lib/utils';

export function regionUrl(region) {
	return `/regioes/${region.id}-${slugify(region.name)}`;
}

export function operatorWithinRegionUrl(region, operator) {
	return `${regionUrl(region)}/${operator.id}-${slugify(operator.tag)}`;
}

export function routeWithinRegionUrl(region, operator, route) {
	return `${operatorWithinRegionUrl(region, operator)}/${route.id}-${slugify(route.code || route.name)}`;
}
