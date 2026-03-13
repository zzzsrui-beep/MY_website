import { getProductsPageFromCms } from '$lib/cms';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function readPositiveInt(value: string | null, fallback: number) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(1, Math.floor(parsed));
}

export const prerender = false;

export const GET: RequestHandler = async ({ url, fetch }) => {
	const page = readPositiveInt(url.searchParams.get('page'), 1);
	const limit = readPositiveInt(url.searchParams.get('limit'), 12);
	const categorySlug = url.searchParams.get('category');
	const gender = url.searchParams.get('gender');

	const result = await getProductsPageFromCms(fetch, {
		page,
		limit,
		categorySlug,
		gender
	});

	return json(result);
};
