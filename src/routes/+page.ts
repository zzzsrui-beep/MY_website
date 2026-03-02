import type { PageLoad } from './$types';
import {
	frontendCategories,
	getFeaturedProducts
} from '$lib/mock';
import {
	getHomeAssetsFromCms,
	getPageBySlugFromCms,
	getSectionsBySlugFromCms,
	getSiteSettings
} from '$lib/cms';

export const load: PageLoad = async ({ fetch }) => {
	const [page, sections, homeAssets, settings] = await Promise.all([
		getPageBySlugFromCms(fetch, 'home'),
		getSectionsBySlugFromCms(fetch, 'home'),
		getHomeAssetsFromCms(fetch),
		getSiteSettings(fetch)
	]);

	return {
		page,
		featuredProducts: getFeaturedProducts(),
		sections,
		categories: frontendCategories,
		homeAssets,
		settings
	};
};
