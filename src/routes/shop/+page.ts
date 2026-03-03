import type { PageLoad } from './$types';
import {
	frontendCategories,
	getProducts,
	parseCatalogFilters
} from '$lib/mock';
import {
	getPageWithSectionsFromCms,
	getNavCategorySlugsFromCms,
} from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'shop');
	const [{ page, sections }, navCategorySlugs] = await Promise.all([
		getPageWithSectionsFromCms(fetch, pageSlug, 'shop'),
		getNavCategorySlugsFromCms(fetch)
	]);

	return {
		products: getProducts({ categorySlug, gender }),
		page,
		sections,
		categories: frontendCategories,
		navCategorySlugs,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
