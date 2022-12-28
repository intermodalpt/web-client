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
import { apiServer } from '$lib/settings.js';
import { routes, loadRoutes, stops, loadStops } from '$lib/stores.js';

export const csr = true;
export const ssr = false;
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const stopId = params.id;

	let stopsPromise = new Promise((resolve, reject) => {
		let data = get(stops);
		if (data === undefined) {
			resolve(loadStops(fetch));
		} else {
			resolve(data);
		}
	});

	let routesPromise = new Promise((resolve, reject) => {
		let data = get(routes);
		if (data === undefined) {
			resolve(loadRoutes(fetch));
		} else {
			resolve(data);
		}
	});

	const stopSpider = fetch(`${apiServer}/v1/stops/${stopId}/spider`).then((x) => x.json());

	const [stopsData, stopSpiderData, routesData] = await Promise.all([
		stopsPromise,
		stopSpider,
		routesPromise
	]);

	const accessibleRoutes = Object.keys(stopSpiderData.routes)
		.map((routeId) => {
			return routesData[routeId];
		})
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
		stop: stopsData[stopId],
		routes: accessibleRoutes
	};
}
