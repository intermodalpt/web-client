import { writable, derived, get } from 'svelte/store';
import { Dexie } from 'dexie';
import { cacheInvalidationTime } from '$lib/settings';
import { browser } from '$app/environment';
import {
	getCalendars,
	getOperators,
	getRegions,
	getRegionStops,
	getRegionParishes,
	getRegionRoutes
} from './api';

interface Region {
	id: number;
	name: string;
}

interface Parish {
	id: number;
	name: string;
}

interface Stop {
	id: number;
	name: string;
	lat: number;
	lon: number;
}

interface Route {
	id: number;
	name: string;
}

interface Calendar {
	id: number;
	name: string;
}

interface Operator {
	id: number;
	name: string;
}

interface Setting {
	key: string;
	value: string;
}

export const db = new Dexie('intermodal-client') as Dexie & {
	regions: Dexie.Table<Region, number>;
	parishes: Dexie.Table<Parish, number>;
	stops: Dexie.Table<Stop, number>;
	routes: Dexie.Table<Route, number>;
	calendars: Dexie.Table<Calendar, number>;
	operators: Dexie.Table<Operator, number>;
	settings: Dexie.Table<Setting, string>;
};

db.version(1).stores({
	regions: '&id',
	parishes: '&id',
	stops: '&id',
	routes: '&id',
	calendars: '&id',
	operators: '&id',
	settings: 'key'
});

export const regionId = writable(
	browser
		? localStorage.getItem('region')
			? parseInt(localStorage.getItem('region'))
			: null
		: null
);
let _regionId: number | null = null;
regionId.subscribe((id) => {
	console.log('Region id is', id);
	_regionId = id;
});

export async function setRegion(id: number) {
	if (!id) {
		console.error('Attempted to nullify the region id');
		return;
	}
	if (id == _regionId) {
		// Prevent cache invalidation over nothing
		console.log('Region id unchanged');
		return;
	}
	await wipeVolatileCachedData();
	localStorage.setItem('region', id);
	regionId.set(id);
}

let _regionsLoaded: boolean;
let _operatorsLoaded: boolean;
let _stopsLoaded: boolean;
let _routesLoaded: boolean;
let _calendarsLoaded: boolean;
let _parishesLoaded: boolean;

export let regionsLoaded = writable(false);
export let operatorsLoaded = writable(false);
export let stopsLoaded = writable(false);
export let routesLoaded = writable(false);
export let calendarsLoaded = writable(false);
export let parishesLoaded = writable(false);

regionsLoaded.subscribe((v) => (_regionsLoaded = v));
operatorsLoaded.subscribe((v) => (_operatorsLoaded = v));
stopsLoaded.subscribe((v) => (_stopsLoaded = v));
routesLoaded.subscribe((v) => (_routesLoaded = v));
calendarsLoaded.subscribe((v) => (_calendarsLoaded = v));
parishesLoaded.subscribe((v) => (_parishesLoaded = v));

export const selectedRegion = derived(regionId, async ($regionId, set) => {
	if (!$regionId) {
		console.log('No selected region');
		return null;
	}

	let regionIdInt = parseInt($regionId);
	if (!regionIdInt) {
		console.error('Invalid region id', $regionId);
		return;
	}

	let region = await db.regions.get(regionIdInt);
	console.log('Selected region', region);
	set(region);
});

selectedRegion.subscribe((region) => {
	console.log('Selected region', region);
});

function timestampKey(tableName: string) {
	return `${tableName}_updated`;
}

async function isCacheInvalidated(tableName: string) {
	const now = new Date();
	let updateDate = await db.settings.get(timestampKey(tableName));
	if (updateDate !== undefined) {
		updateDate = new Date(updateDate.value);
		const diff = now.getTime() - updateDate.getTime();
		return diff > cacheInvalidationTime;
	}
	return true;
}

async function updateCacheTimestamp(tableName: string) {
	const now = new Date().toISOString();
	await db.settings.put({ key: timestampKey(tableName), value: now });
}

async function invalidateCacheTimestamp(tableName: string) {
	await db.settings.delete(timestampKey(tableName));
}

export async function fetchLocalRegions({ fetcher = fetch, ifMissing = true } = {}) {
	if (!browser) return;

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('regions');
	} else {
		cacheInvalidated = await isCacheInvalidated('regions');
	}

	if (!cacheInvalidated) {
		const count = await db.regions.count();
		if (count > 0 && ifMissing) {
			regionsLoaded.set(true);
			return;
		}
	}

	getRegions({
		onSuccess: async (regions) => {
			await db.regions.clear();
			await db.regions.bulkPut(regions);
			updateCacheTimestamp('regions');
			regionsLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch regions', error);
		},
		fetch: fetcher
	});
}

export async function fetchLocalOperators({ fetcher = fetch, ifMissing = true } = {}) {
	if (!browser) return;

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('operators');
	} else {
		cacheInvalidated = await isCacheInvalidated('operators');
	}

	if (!cacheInvalidated) {
		const count = await db.operators.count();
		if (count > 0 && ifMissing) {
			operatorsLoaded.set(true);
			return;
		}
	}

	await getOperators({
		onSuccess: async (operators) => {
			await db.operators.clear();
			await db.operators.bulkPut(operators);
			updateCacheTimestamp('operators');
			operatorsLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch operators', error);
		},
		fetch: fetcher
	});
}

export async function fetchLocalStops({ fetcher = fetch, ifMissing = true }) {
	if (!browser) return;

	if (_regionId == null) {
		await invalidateCacheTimestamp('stops');
		await db.stops.clear();
		stopsLoaded.set(true);
		return;
	}

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('stops');
	} else {
		cacheInvalidated = await isCacheInvalidated('stops');
	}

	if (!cacheInvalidated) {
		const count = await db.stops.count();
		if (count > 0 && ifMissing) {
			stopsLoaded.set(true);
			return;
		}
	}

	await getRegionStops(_regionId, {
		onSuccess: async (stops) => {
			await db.stops.clear();
			await db.stops.bulkPut(stops);
			updateCacheTimestamp('stops');
			stopsLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch stops', error);
		},
		fetch: fetcher
	});
}

export async function fetchLocalRoutes({ fetcher = fetch, ifMissing = true } = {}) {
	if (!browser) return;

	if (_regionId === null) {
		await invalidateCacheTimestamp('routes');
		regionsLoaded.set(true);
		return;
	}

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('routes');
	} else {
		cacheInvalidated = await isCacheInvalidated('routes');
	}

	if (!cacheInvalidated) {
		const count = await db.routes.count();
		if (count > 0 && ifMissing) {
			routesLoaded.set(true);
			return;
		}
	}

	getRegionRoutes(_regionId, {
		onSuccess: async (routes) => {
			await db.routes.clear();
			await db.routes.bulkPut(routes);
			updateCacheTimestamp('routes');
			routesLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch routes', error);
		},
		fetch: fetcher
	});
}

export async function fetchLocalCalendars({ fetcher = fetch, ifMissing = true } = {}) {
	if (!browser) return;

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('calendars');
	} else {
		cacheInvalidated = await isCacheInvalidated('calendars');
	}

	if (!cacheInvalidated) {
		const count = await db.calendars.count();
		if (count > 0 && ifMissing) {
			calendarsLoaded.set(true);
			return;
		}
	}

	getCalendars({
		onSuccess: async (calendars) => {
			await db.calendars.clear();
			await db.calendars.bulkPut(calendars);
			updateCacheTimestamp('calendars');
			calendarsLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch calendars', error);
		},
		fetch: fetcher
	});
}

export async function fetchLocalParishes({ fetcher = fetch, ifMissing = true } = {}) {
	if (!browser) return;

	if (_regionId === null) {
		await invalidateCacheTimestamp('parishes');
		parishesLoaded.set(true);
		return;
	}

	let cacheInvalidated = true;
	if (!ifMissing) {
		await invalidateCacheTimestamp('parishes');
	} else {
		cacheInvalidated = await isCacheInvalidated('parishes');
	}

	if (!cacheInvalidated) {
		const count = await db.parishes.count();
		if (count > 0 && ifMissing) {
			parishesLoaded.set(true);
			return;
		}
	}

	await getRegionParishes(_regionId, {
		onSuccess: async (parishes) => {
			await db.parishes.clear();
			await db.parishes.bulkPut(parishes);
			updateCacheTimestamp('parishes');
			parishesLoaded.set(true);
		},
		onError: (error) => {
			console.error('Failed to fetch parishes', error);
		},
		fetch: fetcher
	});
}

export async function getLocalRegions() {
	return await db.regions.toArray();
}

export async function getLocalRegion(id: number): Promise<Region | undefined> {
	return await db.regions.get(id);
}

export async function getLocalOperators() {
	const operators = await db.operators.toArray();
	const operatorsObject = Object.fromEntries(operators.map((o) => [o.id, o]));
	return operatorsObject;
}

export async function getLocalOperator(id: number) {
	return await db.operators.get(id);
}

export async function getLocalStops() {
	const stops = await db.stops.toArray();
	const stopsObject = Object.fromEntries(stops.map((s) => [s.id, s]));
	return stopsObject;
}

export async function getLocalRoutes() {
	const routes = await db.routes.toArray();
	const routesObject = Object.fromEntries(routes.map((r) => [r.id, r]));
	return routesObject;
}

export async function getLocalCalendars() {
	const calendars = await db.calendars.toArray();
	const calendarsObject = Object.fromEntries(calendars.map((c) => [c.id, c]));
	return calendarsObject;
}

export async function getLocalParishes() {
	const parishes = await db.parishes.toArray();
	const parishesObject = Object.fromEntries(parishes.map((c) => [c.id, c]));
	return parishesObject;
}

export async function softInvalidateStops() {
	await invalidateCacheTimestamp('stops');
}

export async function softInvalidateRoutes() {
	await invalidateCacheTimestamp('routes');
}

export async function loadMissing() {
	const missing = [];

	if (!_operatorsLoaded) {
		missing.push(fetchLocalOperators({}));
	}

	if (!_stopsLoaded) {
		missing.push(fetchLocalStops({}));
	}

	if (!_routesLoaded) {
		missing.push(fetchLocalRoutes({}));
	}

	if (!_calendarsLoaded) {
		missing.push(fetchLocalCalendars({}));
	}

	if (!_parishesLoaded) {
		missing.push(fetchLocalParishes({}));
	}

	await Promise.all(missing);
}

export async function wipeRegionCachedData() {
	await Promise.all([
		db.stops.clear(),
		db.routes.clear()
		// db.calendars.clear(),
	]).then(() => {
		stopsLoaded.set(false);
		routesLoaded.set(false);
		// calendarsLoaded.set(false);
	});
}

export async function wipeVolatileCachedData() {
	await Promise.all([
		db.operators.clear(),
		db.stops.clear(),
		db.routes.clear(),
		// db.calendars.clear(),
		db.parishes.clear()
	]).then(() => {
		stopsLoaded.set(false);
		routesLoaded.set(false);
		// calendarsLoaded.set(false);
		parishesLoaded.set(false);
	});
}
