import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getPageBySlugFromCms, getSectionsBySlugFromCms } from '$lib/cms';

export const load: PageLoad = async ({ params, fetch }) => {
	const page = await getPageBySlugFromCms(fetch, params.slug);
	if (!page) {
		throw error(404, 'Page not found');
	}

	return {
		page,
		sections: await getSectionsBySlugFromCms(fetch, params.slug)
	};
};
