import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProductByIdOrSlugFromCms, getRelatedProductsFromCms } from '$lib/cms';

export const load: PageLoad = async ({ params, fetch }) => {
	const product = await getProductByIdOrSlugFromCms(fetch, params.id);
	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product,
		related: await getRelatedProductsFromCms(fetch, params.id)
	};
};
