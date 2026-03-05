import type { PageLoad } from './$types';
import {
	parseCatalogFilters
} from '$lib/mock';
import {
	getCategoriesFromCms,
	getCollectionPanelsFromCms,
	getPageWithSectionsFromCms,
	getProductsFromCms
} from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'collection');
	const [{ page, sections }, products, categories, collectionImages] = await Promise.all([
		getPageWithSectionsFromCms(fetch, pageSlug, 'collection'),
		getProductsFromCms(fetch, { categorySlug, gender, isFeatured: true }),
		getCategoriesFromCms(fetch),
		getCollectionPanelsFromCms(fetch)
	]);

	return {
		products,
		page,
		sections,
		categories,
		collectionImages,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
