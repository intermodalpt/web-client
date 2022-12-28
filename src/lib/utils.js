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

export function longStopName(stop) {
	return stop.name || stop.short_name || stop.official_name || stop.osm_name || '?';
}

export function sensibleLengthStopName(stop) {
	const longName = longStopName(stop);
	if (longName.length > 100) {
		return stopName(stop);
	} else {
		return longName;
	}
}

function scoreBool(truthVal, potentialScore) {
	if (truthVal === undefined || truthVal === null) {
		return [0.0, 0.0];
	} else if (truthVal) {
		return [potentialScore, potentialScore];
	} else {
		return [0.0, potentialScore];
	}
}

export function stopScore(stop) {
	let score = 0.0;
	let maximum = 0.0;

	let attrScore, attrMaximum;

	[attrScore, attrMaximum] = scoreBool(stop.has_flag, 3.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_schedules, 1.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_sidewalk, 5.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_shelter, 3.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_bench, 1.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_trash_can, 0.5);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_outdated_info, 0.5);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.is_damaged, 0.5);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_crossing, 3.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_accessibility, 1.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_illuminated_path, 1.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_visibility_from_area, 1.0);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.has_visibility_from_within, 0.5);
	score += attrScore;
	maximum += attrMaximum;
	[attrScore, attrMaximum] = scoreBool(stop.is_visible_from_outside, 2.0);

	// TODO illumination
	// TODO has_abusive_parking should not be a binary value
	// TODO has_schedules should not be a binary value
	// TODO is_damaged should not be a binary value

	// Truncate number to 1 decimal place
	return Math.round((score / maximum) * 10);
}

export function stopScoreClass(score) {
	switch (score) {
		case 0:
		case 1:
		case 2:
			return 'score-red';
		case 3:
		case 4:
			return 'score-orange';
		case 5:
		case 6:
			return 'score-yellow';
		case 7:
		case 8:
		case 9:
			return 'score-green';
		default:
			return 'score-perfect';
	}
}

function groupBy(list, keyGetter) {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return map;
}

export function buildSchedule(departures, calendars) {
	// Get used calendars
	const usedCalendarIds = new Set(departures.map((departure) => departure.calendar_id));
	const usedCalendars = Object.fromEntries(
		calendars
			.filter((calendar) => usedCalendarIds.has(calendar.id))
			.map((calendar) => [calendar.id, calendar])
	);

	// Group departures by calendar
	const calendarDepartures = groupBy(departures, (departure) => departure.calendar_id);

	const processedSchedule = [...calendarDepartures.entries()].map(([calendarId, departures]) => {
		let calendar = usedCalendars[calendarId];
		let schedule = Array.from(Array(24), () => []);
		if (calendar === undefined) return null;

		for (let departure of departures) {
			let hour = Math.floor(departure.time / 60) % 24;
			let minute = String(Math.floor(departure.time % 60)).padStart(2, '0');
			schedule[hour].push(minute);
		}

		// Find first and last hour with departures
		let minHour = 4; // 4AM
		let maxHour = 2; // 2AM

		for (let i = 4; i <= 26; i++) {
			if (schedule[i % 24].length !== 0) {
				minHour = i;
				break;
			}
		}
		for (let i = 26; i >= 4; i--) {
			if (schedule[i % 24].length !== 0) {
				maxHour = i;
				break;
			}
		}
		// ------------------------------------------

		// Shift hours so that the day starts at 4AM
		let scheduleHours = [...Array(maxHour - minHour + 1).keys()].map((offset) => {
			return (minHour + offset) % 24;
		});

		schedule =
			maxHour < 24
				? schedule.slice(minHour, maxHour + 1)
				: schedule.slice(minHour, 24).concat(schedule.slice(0, (maxHour % 24) + 1));
		// ------------------------------------------

		// Calculate the transposed schedule (for table display)
		const depth = Math.max.apply(
			0,
			schedule.map((hour) => {
				return hour.length;
			})
		);

		const transposed = [...Array(depth).keys()].map(() => []);

		for (let i = 0; i < depth; i++) {
			for (let j = 0; j < schedule.length; j++) {
				transposed[i][j] = schedule[j][i];
			}
		}
		// ----------------------------------------------------

		return {
			calendar: calendar,
			departures: schedule,
			transposedDepartures: transposed,
			scheduleHours: scheduleHours
		};
	});

	return processedSchedule.filter((calendar) => calendar !== null);
}
