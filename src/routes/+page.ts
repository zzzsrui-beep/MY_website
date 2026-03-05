import type { PageLoad } from './$types';
import {
	getCategoriesFromCms,
	getHomeAssetsFromCms,
	getPageBySlugFromCms,
	getProductsFromCms,
	getSectionsBySlugFromCms,
	getSiteSettings
} from '$lib/cms';

export const load: PageLoad = async ({ fetch }) => {
	const [page, sections, homeAssets, settings, featuredProducts, categories] = await Promise.all([
		getPageBySlugFromCms(fetch, 'home'),
		getSectionsBySlugFromCms(fetch, 'home'),
		getHomeAssetsFromCms(fetch),
		getSiteSettings(fetch),
		getProductsFromCms(fetch, { isFeatured: true }),
		getCategoriesFromCms(fetch)
	]);

	return {
		page,
		featuredProducts,
		sections,
		categories,
		homeAssets,
		settings
	};
};
