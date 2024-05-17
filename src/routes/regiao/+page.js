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
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { selectedRegion } from '$lib/db.js';
import { slugify } from '$lib/utils.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	let region = browser ? get(selectedRegion) : null;

	if (region) {
		redirect(307, `/regioes/${region.id}-${slugify(region.name)}`);
	}

	redirect(307, '/regioes');
}
