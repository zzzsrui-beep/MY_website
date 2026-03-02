import type { PageLoad } from './$types';
import {
	frontendCategories,
	getProducts,
	parseCatalogFilters
} from '$lib/mock';
import {
	getNavCategorySlugsFromCms,
	getPageBySlugFromCms,
	getSectionsBySlugFromCms
} from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'shop');
	const [pageBySlug, sectionsBySlug, fallbackPage, fallbackSections, navCategorySlugs] =
		await Promise.all([
			getPageBySlugFromCms(fetch, pageSlug),
			getSectionsBySlugFromCms(fetch, pageSlug),
			getPageBySlugFromCms(fetch, 'shop'),
			getSectionsBySlugFromCms(fetch, 'shop'),
			getNavCategorySlugsFromCms(fetch)
		]);

	return {
		products: getProducts({ categorySlug, gender }),
		page: pageBySlug || fallbackPage,
		sections: sectionsBySlug.length ? sectionsBySlug : fallbackSections,
		categories: frontendCategories,
		navCategorySlugs,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
