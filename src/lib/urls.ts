import { slugify } from './utils';

export function regionUrl(region) {
	return `/regioes/${region.id}-${slugify(region.name)}`;
}

export function operatorWithinRegionUrl(region, operator) {
	return `${regionUrl(region)}/${operator.id}-${slugify(operator.tag)}`;
}

export function routeWithinRegionUrl(region, operator, route) {
	return `${operatorWithinRegionUrl(region, operator)}/${route.id}-${slugify(route.code || route.name)}`;
}


export function routeInfoWithinRegionUrl(region, operator, route) {
	return `${routeWithinRegionUrl(region, operator, route)}/informacao`;
}

export function routeScheduleWithinRegionUrl(region, operator, route) {
	return `${routeWithinRegionUrl(region, operator, route)}/horario`;
}

export function routeStopsWithinRegionUrl(region, operator, route) {
	return `${routeWithinRegionUrl(region, operator, route)}/paragens`;
}

export function routePathWithinRegionUrl(region, operator, route) {
	return `${routeWithinRegionUrl(region, operator, route)}/percurso`;
}