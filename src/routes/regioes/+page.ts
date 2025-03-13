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
import { getRegions } from '$lib/api';
import { getLocalRegions, fetchLocalRegions } from '$lib/db';
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	if (browser) {
		await fetchLocalRegions({ fetcher: fetch });

		return {
			regions: await getLocalRegions()
		};
	} else {
		const regions = await getRegions({
			onError: async (err) => {
				error(err.status, JSON.stringify(await err.json()));
			},
			fetch
		});

		return { regions };
	}
}
