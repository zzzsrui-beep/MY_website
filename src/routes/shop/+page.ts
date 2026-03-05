import type { PageLoad } from './$types';
import { parseCatalogFilters } from '$lib/mock';
import {
	getCategoriesFromCms,
	getPageWithSectionsFromCms,
	getNavCategorySlugsFromCms,
	getProductsFromCms
} from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'shop');
	const [{ page, sections }, navCategorySlugs, products, categories] = await Promise.all([
		getPageWithSectionsFromCms(fetch, pageSlug, 'shop'),
		getNavCategorySlugsFromCms(fetch),
		getProductsFromCms(fetch, { categorySlug, gender }),
		getCategoriesFromCms(fetch)
	]);

	return {
		products,
		page,
		sections,
		categories,
		navCategorySlugs,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
