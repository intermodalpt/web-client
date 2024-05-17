import { apiServer } from '$lib/settings';

function slugify(string) {
	return string
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export function regionUrl(region) {
	return `/regioes/${region.id}-${slugify(region.name)}`;
}

export function operatorWithinRegionUrl(region, operator) {
	return `${regionUrl(region)}/${operator.id}-${slugify(operator.tag)}`;
}

export function routeWithinRegionUrl(region, operator, route) {
	return `${operatorWithinRegionUrl(region, operator)}/${route.id}-${slugify(route.code || route.name)}`;
}
