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
import L from 'leaflet?client';
import { browser } from '$app/environment';


export const stopIcon = browser
	? L.icon({
			iconUrl: `/markers/bus-minimal.svg`,
			iconSize: [16, 16],
			iconAnchor: [8, 8]
	  })
	: null;

export const bigStopIcon = browser
	? L.icon({
			iconUrl: `/markers/bus-minimal.svg`,
			iconSize: [32, 32],
			iconAnchor: [16, 16]
	  })
	: null;
