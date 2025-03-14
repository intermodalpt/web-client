/*
    Intermodal, transportation information aggregator
    Copyright (C) 2022 - 2025  Cláudio Pereira

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

import { getStop, getStopPictures, getStopSpider } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export const csr = true;
export const ssr = false;
export const prerender = false;

export async function load({ params, fetch }) {
	const stopId = parseInt(params.id);

	const [stop, pictures, spider] = await Promise.all([
		getStop(stopId, {
			onError: (err) => {
				if (err.status === 404) {
					error(404, 'Paragem não encontrada');
				} else {
					error(err.status, 'Problema ao obter paragem');
				}
			},
			fetch
		}),
		getStopPictures(stopId, {
			onError: (err) => {
				if (err.status === 404) {
					error(404, 'Paragem não encontrada');
				} else {
					error(err.status, 'Problema ao obter fotos');
				}
			},
			fetch
		}),
		getStopSpider(stopId, {
			onError: (err) => {
				if (err.status === 404) {
					error(404, 'Paragem não encontrada');
				} else {
					error(err.status, 'Problema ao obter mapa-aranha');
				}
			},
			fetch
		})
	]);
	return { stop, pictures, spider };
}
