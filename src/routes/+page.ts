import type { PageLoad } from './$types';
import {
	getCategoriesFromCms,
	getHomeAssetsFromCms,
	getPageBySlugFromCms,
	getProductsFromCms,
	getSectionsBySlugFromCms,
	getSiteSettings
} from '$lib/cms';
import type { UISection } from '$lib/types';

function applyCmsHeroToSections(
	sections: UISection[],
	cmsHeroImage?: string
) {
	if (!cmsHeroImage) return sections;

	let replaced = false;
	return sections.map((section) => {
		if (replaced || section.type !== 'hero') return section;
		replaced = true;
		return {
			...section,
			imageUrl: cmsHeroImage
		};
	});
}

export const load: PageLoad = async ({ fetch }) => {
	const [page, sections, homeAssets, settings, featuredProducts, categories] = await Promise.all([
		getPageBySlugFromCms(fetch, 'home'),
		getSectionsBySlugFromCms(fetch, 'home'),
		getHomeAssetsFromCms(fetch),
		getSiteSettings(fetch),
		getProductsFromCms(fetch, { isFeatured: true }),
		getCategoriesFromCms(fetch)
	]);

	const sectionsWithCmsHero = applyCmsHeroToSections(sections, page?.heroImage);

	return {
		page,
		featuredProducts,
		sections: sectionsWithCmsHero,
		categories,
		homeAssets,
		settings
	};
};
