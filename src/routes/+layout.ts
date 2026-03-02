import type { LayoutLoad } from './$types';
import { getSiteLayoutData } from '$lib/cms';

export const load: LayoutLoad = async ({ fetch }) => {
	return getSiteLayoutData(fetch);
};
