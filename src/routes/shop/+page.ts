import type { PageLoad } from './$types';
import { parseCatalogFilters } from '$lib/mock';
import {
	getCategoriesFromCms,
	getPageWithSectionsFromCms,
	getNavCategorySlugsFromCms,
	getProductsPageFromCms,
	getProductsFromCms
} from '$lib/cms';

export const load: PageLoad = async ({ url, fetch }) => {
	const { categorySlug, gender, pageSlug } = parseCatalogFilters(url, 'shop');
	const search = url.searchParams.get('search')?.trim() || '';
	const pageSize = 12;
	const useLazyProducts = !search;

	const productsPromise = useLazyProducts
		? getProductsPageFromCms(fetch, { categorySlug, gender, page: 1, limit: pageSize })
		: getProductsFromCms(fetch, { categorySlug, gender });

	const [{ page, sections }, navCategorySlugs, productsResult, categories] = await Promise.all([
		getPageWithSectionsFromCms(fetch, pageSlug, 'shop'),
		getNavCategorySlugsFromCms(fetch),
		productsPromise,
		getCategoriesFromCms(fetch)
	]);

	const initialProducts = Array.isArray(productsResult)
		? productsResult
		: productsResult.products;
	const productsHasNextPage = Array.isArray(productsResult) ? false : productsResult.hasNextPage;
	const productsPage = Array.isArray(productsResult) ? 1 : productsResult.page;

	return {
		products: initialProducts,
		productsHasNextPage,
		productsPage,
		productsPageSize: pageSize,
		useLazyProducts,
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
