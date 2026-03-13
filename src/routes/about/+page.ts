import type { PageLoad } from './$types';
import { getPageBySlugFromCms, getSectionsBySlugFromCms } from '$lib/cms';

export const load: PageLoad = async ({ fetch }) => {
	const [page, sections] = await Promise.all([
		getPageBySlugFromCms(fetch, 'about', { fallback: false }),
		getSectionsBySlugFromCms(fetch, 'about', { fallback: false })
	]);

	return {
		page,
		sections
	};
};
