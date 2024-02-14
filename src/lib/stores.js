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
import { writable } from 'svelte/store';
import { apiServer } from '$lib/settings.js';

export const routes = writable(undefined);
export const stops = writable(undefined);
export const calendars = writable(undefined);

export const operators = {
	1: { id: 1, name: 'Carris Metropolitana', tag: 'cmet' },
	2: { id: 2, name: 'Transportes Colectivos do Barreiro', tag: 'tcb' },
	3: { id: 3, name: 'Carris', tag: 'carris' },
	4: { id: 4, name: 'MobiCascais', tag: 'mobic' },
	5: { id: 5, name: 'Comboios de Portugal', tag: 'cp' },
	6: { id: 6, name: 'Fertagus', tag: 'fert' },
	7: { id: 7, name: 'Metro Transportes do Sul', tag: 'mts' },
	8: { id: 8, name: 'Metro de Lisboa', tag: 'ml' },
	9: { id: 9, name: 'Transtejo e Soflusa', tag: 'ttsl' }
};

export const operatorIdTagPairs = Object.fromEntries(
	Object.entries(operators).map(([id, op]) => [op.tag, id])
);

export async function loadRoutes(fetch) {
	let routesData = await fetch(`${apiServer}/v1/regions/1/routes`)
		.then((r) => r.json())
		.then((routeList) => {
			return Object.fromEntries(routeList.map((route) => [route.id, route]));
		});

	routes.set(routesData);
	return routesData;
}

export async function loadStops(fetch) {
	let stopData = fetch(`${apiServer}/v1/regions/1/stops`)
		.then((r) => r.json())
		.then((stopList) => {
			return Object.fromEntries(stopList.map((stop) => [stop.id, stop]));
		});

	stops.set(stopData);
	return stopData;
}
