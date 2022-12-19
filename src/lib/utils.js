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
export function calcRouteMultipoly(routeStops) {
	let segments = [];

	let currentSegment = [];
	for (let i = 0; i < routeStops.length - 1; i++) {
		let firstStop = routeStops[i];
		let secondStop = routeStops[i + 1];
		if (firstStop.lon && secondStop.lon) {
			if (currentSegment.length === 0) {
				currentSegment.push([firstStop.lat, firstStop.lon]);
			}
			currentSegment.push([secondStop.lat, secondStop.lon]);
		} else {
			if (currentSegment.length !== 0) {
				segments.push(currentSegment);
				currentSegment = [];
			}
		}
	}

	if (currentSegment.length !== 0) {
		segments.push(currentSegment);
	}

	return segments;
}

export function stopName(stop) {
	return stop.short_name || stop.name || stop.official_name || stop.osm_name || '?';
}

function getDeparturesAndCalendars() {
	let scheduleMats = Object.fromEntries(
		data.departures.map((departure) => [departure.calendar_id, {}])
	);

	for (let e of subrouteSchedule) {
		let scheduleMat = scheduleMats[e.calendar_id];

		let hour = Math.floor(e.time / 60);
		let minute = String(Math.floor(e.time % 60)).padStart(2, '0');
		if (!scheduleMat[hour]) scheduleMat[hour] = [];

		scheduleMat[hour].push({ id: e.id, minute: minute });
	}
	let departures = {};

	for (const scheduleMat of Object.values(scheduleMats)) {
		for (const hour of Object.keys(scheduleMat).sort()) {
			departures[hour] = scheduleMat[hour];
		}
	}
	return scheduleMats;
}
