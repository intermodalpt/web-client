/*
    Intermodal, transportation information aggregator
    Copyright (C) 2022  Cláudio Pereira

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { get } from 'svelte/store';
import { operators, operatorIdTagPairs, routes, loadRoutes } from '$lib/stores.js';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch, depends }) {
	const operatorTag = params.tag;
	const operator = operators[operatorIdTagPairs[operatorTag]];

	let routesData = get(routes);
	if (routesData === undefined) {
		routesData = await loadRoutes(fetch);
	}

	const sortedRoutes = Object.values(routesData)
		.filter((route) => route.operator === operator.id)
		.sort((ra, rb) => {
			if (!ra.code) {
				return -1;
			} else if (!rb.code) {
				return 1;
			} else {
				return (parseInt(ra.code) || 10000) - (parseInt(rb.code) || 10000);
			}
		});

	return {
		operator: operator,
		routes: sortedRoutes
	};
}
