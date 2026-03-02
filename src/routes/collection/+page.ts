import type { PageLoad } from './$types';
import {
	frontendCategories,
	frontendCollectionImages,
	getProducts,
	parseCatalogFilters
} from '$lib/mock';
import { getPageBySlugFromCms, getSectionsBySlugFromCms } from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'collection');
	const [pageBySlug, sectionsBySlug, fallbackPage, fallbackSections] = await Promise.all([
		getPageBySlugFromCms(fetch, pageSlug),
		getSectionsBySlugFromCms(fetch, pageSlug),
		getPageBySlugFromCms(fetch, 'collection'),
		getSectionsBySlugFromCms(fetch, 'collection')
	]);

	return {
		products: getProducts({ categorySlug, gender, isFeatured: true }),
		page: pageBySlug || fallbackPage,
		sections: sectionsBySlug.length ? sectionsBySlug : fallbackSections,
		categories: frontendCategories,
		collectionImages: frontendCollectionImages,
		filters: {
			category: categorySlug,
			gender
		}
	};
};
