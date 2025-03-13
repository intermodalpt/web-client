/*
    Intermodal, transportation information aggregator
    Copyright (C) 2024 - 2025  Cláudio Pereira

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

import { browser } from '$app/environment';
import { getOperatorRoutes, getRegion } from '$lib/api.js';
import {
	fetchLocalOperators,
	fetchLocalRegions,
	fetchLocalRoutes,
	getLocalRegion,
	getLocalOperator,
	regionId as regionIdStore
} from '$lib/db.js';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const csr = true;
export const ssr = false;
export const prerender = false;

export async function load({ params, fetch }) {
	const regionId = parseInt(params.regId);
	const operatorId = parseInt(params.opId);
	const routeId = parseInt(params.route);

	if (browser && regionId == get(regionIdStore)) {
		const [, , , routes] = await Promise.all([
			fetchLocalRegions({ fetcher: fetch }),
			fetchLocalOperators({ fetcher: fetch }),
			fetchLocalRoutes({ fetcher: fetch }),
			getOperatorRoutes(operatorId, {
				onError: (err) => {
					if (err.status === 404) {
						error(404, 'Operador não encontrado nesta região');
					} else {
						error(err.status, 'Problema ao obter linhas');
					}
				},
				fetch
			})
		]);

		const [region, operator] = await Promise.all([
			getLocalRegion(regionId),
			getLocalOperator(operatorId)
		]);

		if (!region) {
			error(404, 'Região não encontrada');
		}

		if (!operator) {
			error(404, 'Operador não encontrado');
		}

		const route = routes.find((r) => r.id === routeId);
		if (!route) {
			error(404, 'Linha não encontrada');
		}

		return {
			title: `Linha ${route?.name}, ${operator?.name}`,
			region: region,
			operator: operator,
			route: route
		};
	}

	const [region, routes] = await Promise.all([
		getRegion(regionId, {
			onError: (err) => {
				if (err.status === 404) {
					error(404, 'Região não encontrada');
				}
				error(err.status, 'Problema ao obter região');
			},
			fetch
		}),
		getOperatorRoutes(operatorId, {
			onError: (err) => {
				if (err.status === 404) {
					error(404, 'Operador não encontrado nesta região');
				}
				error(err.status, 'Problema ao obter linhas');
			},
			fetch
		})
	]);

	const operator = region.operators.find((op) => op.id === operatorId);
	if (!operator) {
		error(404, 'Operador não encontrado nesta região');
	}

	const route = routes.find((r) => r.id === routeId);
	if (!route) {
		error(404, 'Linha não encontrada');
	}

	return {
		title: `Linha ${route?.name}, ${operator?.name}`,
		region: region,
		operator: operator,
		route: route
	};
}
