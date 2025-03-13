/*
    Intermodal, transportation information aggregator
    Copyright (C) 2024 - 2025 Cláudio Pereira

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
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import {
	fetchLocalRegions,
	fetchLocalOperators,
	getLocalRegion,
	getLocalOperator,
	regionId as regionIdStore
} from '$lib/db';
import { getOperatorRoutes, getRegion } from '$lib/api';

// export const prerender = true;
export const ssr = true;
export const csr = true;

export async function load({ params, fetch }) {
	const regionId = parseInt(params.regId);
	const operatorId = parseInt(params.opId);

	if (browser && regionId == get(regionIdStore)) {
		// Ensure that we have cached data
		await Promise.all([
			fetchLocalRegions({ fetcher: fetch }),
			fetchLocalOperators({ fetcher: fetch })
		]);

		// Make use of cached data
		const [region, operator, routes] = await Promise.all([
			getLocalRegion(regionId),
			getLocalOperator(operatorId),
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

		if (!region) {
			error(404, 'Região não encontrada');
		}

		if (!operator) {
			error(404, 'Operador não encontrado');
		}

		return {
			title: `Linhas ${operator.name} em ${region.name}`,
			region: region,
			operator: operator,
			routes: routes
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

	return {
		title: `Linhas ${operator?.name} em ${region?.name}`,
		region: region,
		operator: operator,
		routes: routes
	};
}
