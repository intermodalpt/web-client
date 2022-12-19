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
import { browser } from '$app/environment';
import { apiServer } from '$lib/settings.js';

export const mode = writable(browser ? localStorage.getItem('mode') : null);
export const stats = writable(null);

export const routes = writable(undefined);
export const stops = writable(undefined);
export const pictures = writable(undefined);
export const stopPicRels = writable([]);
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

export async function loadStats(fetch) {
	let statsData = await fetch(`${apiServer}/v1/stats`).then((r) => r.json());

	stats.set(statsData);
	return statsData;
}

export async function loadRoutes(fetch) {
	let routesData = await fetch(`${apiServer}/v1/routes`)
		.then((r) => r.json())
		.then((stopList) => {
			return Object.fromEntries(stopList.map((stop) => [stop.id, stop]));
		});

	routes.set(routesData);
	return routesData;
}

export async function loadStops(fetch) {
	let stopData = await fetch(`${apiServer}/v1/stops`)
		.then((r) => r.json())
		.then((stopList) => {
			return Object.fromEntries(stopList.map((stop) => [stop.id, stop]));
		});

	stops.set(stopData);
	return stopData;
}

export async function loadPictures(fetch, token) {
	if (!browser) {
		return;
	}

	let headers = {
		headers: {
			authorization: `Bearer ${token}`
		}
	};

	await Promise.all([
		fetch(`${apiServer}/v1/pictures`, headers)
			.then((r) => r.json())
			.then((pics) => {
				return Object.fromEntries(pics.map((pic) => [pic.id, pic]));
			}),
		fetch(`${apiServer}/v1/pictures/rels`, headers).then((r) => r.json())
	]).then(([pics, rels]) => {
		pictures.set(pics);
		stopPicRels.set(rels);
	});
}

export async function loadCalendars(fetch) {
	let calendarsData = await fetch(`${apiServer}/v1/calendars`)
		.then((r) => r.json())
		.then((calendarList) => {
			return Object.fromEntries(calendarList.map((calendar) => [calendar.id, calendar]));
		});
	calendars.set(calendarsData);
	return calendarsData;
}
