import type { PageLoad } from './$types';
import {
	frontendCategories,
	frontendCollectionImages,
	getProducts,
	parseCatalogFilters
} from '$lib/mock';
import { getPageWithSectionsFromCms } from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'collection');
	const { page, sections } = await getPageWithSectionsFromCms(fetch, pageSlug, 'collection');

	return {
		products: getProducts({ categorySlug, gender, isFeatured: true }),
		page,
		sections,
		categories: frontendCategories,
		collectionImages: frontendCollectionImages,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
