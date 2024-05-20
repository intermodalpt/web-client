/*
    Intermodal, transportation information aggregator
    Copyright (C) 2024  Cláudio Pereira

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

import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { apiServer } from '$lib/settings';
import { fetchRegions, fetchOperators, getRegion, getOperator } from '$lib/db.js';

// export const prerender = true;
export const ssr = true;
export const csr = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const regionId = parseInt(params.regId);
	const operatorId = parseInt(params.opId);

	if (browser) {
		// Ensure that we have cached data
		await Promise.all([fetchRegions(), fetchOperators()]);

		// Make use of cached data
		const [region, operator, routesRes] = await Promise.all([
			getRegion(regionId),
			getOperator(operatorId),
			fetch(`${apiServer}/v1/operators/${operatorId}/routes`)
		]);

		if (!region) {
			error(404, 'Região não encontrada');
		}

		if (!operator) {
			error(404, 'Operador não encontrado');
		}

		if (!routesRes.ok) {
			routesRes.status === 404
				? error(404, 'Operador não encontrado nesta região')
				: error('Problema ao obter linhas');
			return;
		}

		return {
			title: `Linhas ${operator.name} em ${region.name}`,
			region: region,
			operator: operator,
			routes: await routesRes.json()
		};
	}

	const [regionsRes, routesRes] = await Promise.all([
		fetch(`${apiServer}/v1/regions/${regionId}`),
		fetch(`${apiServer}/v1/operators/${operatorId}/routes`)
	]);

	if (!regionsRes.ok) {
		if (regionsRes.status === 404) {
			error(404, 'Região não encontrada');
		}
		error('Problema ao obter região');
	}

	if (!routesRes.ok) {
		if (routesRes.status === 404) {
			error(404, 'Operador não encontrado');
		}
		error('Problema ao obter linhas');
	}

	const regionData = await regionsRes.json();
	const operator = regionData.operators.find((op) => op.id === operatorId);
	if (!operator) {
		error(404, 'Operador não encontrado nesta região');
	}

	return {
		title: `Linhas ${operator.name} em ${regionData?.name}`,
		region: regionData,
		operator: operator,
		routes: await routesRes.json()
	};
}
