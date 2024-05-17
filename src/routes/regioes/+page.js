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
import { browser } from '$app/environment';
import { getRegions, fetchRegions } from '$lib/db.js';
import { apiServer } from '$lib/settings';

export const csr = true;
export const ssr = true;
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load() {
	if (browser) {
		await fetchRegions();

		return {
			regions: await getRegions()
		};
	} else {
		const res = await fetch(`${apiServer}/v1/regions`);

		if (!res.ok) {
			error();
		}

		return {
			regions: await res.json()
		};
	}
}
