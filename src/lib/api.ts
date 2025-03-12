import { apiServer } from '$lib/settings';

// Boilerplate reduction

type SuccessCallback = (res: any) => void | Promise<void> | undefined;
type ErrorCallback = (res: Response) => void | Promise<void> | undefined;
type AfterCallback = (res: Response) => void | Promise<void> | undefined;

interface ReqOpts {
	onSuccess?: SuccessCallback;
	onError?: ErrorCallback;
	onAfter?: AfterCallback;
	fetch?: (url: string, params?: any) => Promise<Response>;
	toJson?: boolean;
}

async function handleResponse(
	res: Response,
	{ onSuccess, onError, onAfter, toJson = true }: ReqOpts
): Promise<any> {
	let ret;
	let goodParse = true;

	if (res.ok) {
		if (toJson) {
			try {
				ret = await res.json();
			} catch (e) {
				console.error('Json conversion error', e);
				goodParse = false;
			}
		} else {
			ret = res;
		}
	}

	if (res.ok && goodParse) {
		if (onSuccess) {
			await ensureAwaited(onSuccess(toJson ? ret : res));
		}
	} else {
		console.error(`${res.status} - ${res.statusText} (${res.url})`);
		if (onError) {
			await ensureAwaited(onError(res));
		}
	}

	if (onAfter) {
		await ensureAwaited(onAfter(res));
	}

	return ret;
}

async function ensureAwaited(maybePromise: Promise<any> | any): Promise<any> {
	if (maybePromise instanceof Promise) {
		return await maybePromise;
	} else {
		return maybePromise;
	}
}

interface SimpleFetchOpts {
	method?: string;
	body?: any;
	isJson?: boolean;
	opts: ReqOpts;
}

// A better fetch that gracefully deals with SSR
async function f(
	url: string,
	{ method = 'GET', body, isJson = false, opts }: SimpleFetchOpts
): Promise<Response> {
	return await (opts?.fetch ? opts.fetch : fetch)(apiServer + url, {
		method: method,
		headers: isJson ? { 'Content-Type': 'application/json' } : {},
		credentials: 'include',
		body: isJson ? JSON.stringify(body) : body
	});
}

export async function getStop(stopId: number, opts: ReqOpts) {
	const res = await f(`/v1/stops/${stopId}`, { opts });
	return await handleResponse(res, opts);
}

export async function getStopPictures(stopId: number, opts: ReqOpts) {
	const res = await f(`/v1/stops/${stopId}/pictures`, { opts });
	return await handleResponse(res, opts);
}

export async function getStopSpider(stopId: number, opts: ReqOpts) {
	const res = await f(`/v1/stops/${stopId}/spider`, { opts });
	return await handleResponse(res, opts);
}

export async function getOperators(opts: ReqOpts) {
	const res = await f(`/v1/operators`, { opts });
	return await handleResponse(res, opts);
}

export async function getOperatorRoutes(operatorId: number, opts: ReqOpts) {
	const res = await f(`/v1/operators/${operatorId}/routes`, { opts });
	return await handleResponse(res, opts);
}

export async function getOperatorCalendars(operatorId: number, date: string, opts: ReqOpts) {
	const res = await f(`/v1/operators/${operatorId}/calendars/date/${date}`, { opts });
	return await handleResponse(res, opts);
}

export async function getRegions(opts: ReqOpts) {
	const res = await f(`/v1/regions`, { opts });
	return await handleResponse(res, opts);
}

export async function getRegion(regionId: number, opts: ReqOpts) {
	const res = await f(`/v1/regions/${regionId}`, { opts });
	return await handleResponse(res, opts);
}

export async function getRegionStops(regionId: number, opts: ReqOpts) {
	const res = await f(`/v1/regions/${regionId}/stops`, { opts });
	return await handleResponse(res, opts);
}

export async function getRegionRoutes(regionId: number, opts: ReqOpts) {
	const res = await f(`/v1/regions/${regionId}/routes`, { opts });
	return await handleResponse(res, opts);
}

export async function getRegionParishes(regionId: number, opts: ReqOpts) {
	const res = await f(`/v1/regions/${regionId}/parishes`, { opts });
	return await handleResponse(res, opts);
}

export async function getCalendars(opts: ReqOpts) {
	const res = await f(`/v1/calendars`, { opts });
	return await handleResponse(res, opts);
}

export async function getRouteStops(routeId: number, opts: ReqOpts) {
	const res = await f(`/v1/routes/${routeId}/stops`, { opts });
	return await handleResponse(res, opts);
}

export async function getRouteSchedule(routeId: number, opts: ReqOpts) {
	const res = await f(`/v1/routes/${routeId}/schedule`, { opts });
	return await handleResponse(res, opts);
}
