import { getProductsPageFromCms } from '$lib/cms';
import type { LanguageCode } from '$lib/stores/i18n.svelte';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function readPositiveInt(value: string | null, fallback: number) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(1, Math.floor(parsed));
}

function readLocale(value: string | null): LanguageCode | undefined {
	if (value === 'en' || value === 'ja' || value === 'zh') return value;
	return undefined;
}

export const prerender = false;

export const GET: RequestHandler = async ({ url, fetch }) => {
	const page = readPositiveInt(url.searchParams.get('page'), 1);
	const limit = readPositiveInt(url.searchParams.get('limit'), 12);
	const categorySlug = url.searchParams.get('category');
	const gender = url.searchParams.get('gender');
	const locale = readLocale(url.searchParams.get('locale'));

	const result = await getProductsPageFromCms(fetch, {
		page,
		limit,
		categorySlug,
		gender,
		locale
	});

	return json(result);
};
