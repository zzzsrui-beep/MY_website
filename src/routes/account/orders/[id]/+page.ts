import type { PageLoad } from './$types';
import { getOrderDetailOr404 } from '$lib/mock';

export const load: PageLoad = async ({ params }) => {
	return {
		order: getOrderDetailOr404(params.id)
	};
};
