import { env } from '$env/dynamic/public';

type FetchLike = typeof fetch;

interface PayloadListResponse<T> {
	docs?: T[];
}

export function getPayloadBaseUrl() {
	const base = env.PUBLIC_PAYLOAD_URL?.trim();
	if (!base) return '';
	return base.replace(/\/$/, '');
}

export function isPayloadConfigured() {
	return Boolean(getPayloadBaseUrl());
}

function buildPayloadUrl(path: string, query?: Record<string, string | undefined>) {
	const base = getPayloadBaseUrl();
	if (!base) {
		throw new Error('PUBLIC_PAYLOAD_URL is not configured');
	}

	const url = new URL(path.startsWith('/') ? path : `/${path}`, base);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value) url.searchParams.set(key, value);
		}
	}
	return url.toString();
}

async function readJson<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Payload request failed (${response.status}): ${body.slice(0, 180)}`);
	}
	return response.json() as Promise<T>;
}

export async function fetchPayloadGlobal<T>(
	fetcher: FetchLike,
	slug: string,
	query?: Record<string, string | undefined>
) {
	const url = buildPayloadUrl(`/api/globals/${slug}`, query);
	const response = await fetcher(url, {
		headers: {
			Accept: 'application/json'
		}
	});
	return readJson<T>(response);
}

export async function fetchPayloadCollection<T>(
	fetcher: FetchLike,
	collection: string,
	query?: Record<string, string | undefined>
) {
	const url = buildPayloadUrl(`/api/${collection}`, query);
	const response = await fetcher(url, {
		headers: {
			Accept: 'application/json'
		}
	});
	const json = await readJson<PayloadListResponse<T> | T[]>(response);
	if (Array.isArray(json)) return json;
	return Array.isArray(json.docs) ? json.docs : [];
}
