import type { PageLoad } from './$types';
import { getOrderSummaries } from '$lib/mock';

export const load: PageLoad = async () => {
	return {
		orders: getOrderSummaries(),
		user: {
			id: 'frontend-user',
			email: 'demo@example.com'
		}
	};
};
