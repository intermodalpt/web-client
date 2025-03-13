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

import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import {
	fetchLocalRegions,
	getLocalRegion,
	fetchLocalOperators,
	getLocalOperators,
	regionId as regionIdStore
} from '$lib/db';
import { getRegion } from '$lib/api';

export const csr = true;
export const ssr = true;
export const prerender = false;

export async function load({ params, fetch }) {
	const regionId = parseInt(params.regId);

	if (browser && regionId == get(regionIdStore)) {
		await Promise.all([
			fetchLocalOperators({ fetcher: fetch }),
			fetchLocalRegions({ fetcher: fetch })
		]);

		const [operators, region] = await Promise.all([getLocalOperators(), getLocalRegion(regionId)]);
		if (!region) {
			error(404, 'Região não encontrada');
		}

		const regionOperators = Object.values(operators).filter((op) => op.regions.includes(regionId));

		return {
			title: `Região de ${region.name}`,
			region: region,
			operators: regionOperators
		};
	}

	let region = await getRegion(regionId, {
		onError: async (err) => {
			if (err.status === 404) {
				error(404, 'Região não encontrada');
			} else {
				error(err.status, JSON.stringify(await err.json()));
			}
		},
		fetch
	});

	return {
		title: `Região de ${region.name}`,
		region: region,
		operators: region.operators
	};
}
