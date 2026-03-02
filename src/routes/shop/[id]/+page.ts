import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProductByIdOrSlug, getRelatedProducts } from '$lib/mock';

export const load: PageLoad = async ({ params }) => {
	const product = getProductByIdOrSlug(params.id);
	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product,
		related: getRelatedProducts(params.id)
	};
};
