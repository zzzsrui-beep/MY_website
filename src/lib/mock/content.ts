import { CONTENT_IMAGES, FALLBACK_IMAGE_FILES } from '$lib/constants';
import type { Page, UIAsset, UISection } from '$lib/types';

export const frontendHomeAssets: UIAsset[] = [
	{
		id: 'asset-plushies',
		key: 'hero_category_plushies',
		url: FALLBACK_IMAGE_FILES.CARD
	},
	{
		id: 'asset-stationery',
		key: 'hero_category_stationery',
		url: FALLBACK_IMAGE_FILES.CARD
	},
	{
		id: 'asset-lifestyle',
		key: 'hero_category_lifestyle',
		url: FALLBACK_IMAGE_FILES.CARD
	}
];

export const frontendCollectionImages = [
	{
		id: 'collection-left',
		position: 'left',
		image: FALLBACK_IMAGE_FILES.HERO,
		link: '/shop?category=plush-toys',
		title: 'Plush Toys > New Arrivals'
	},
	{
		id: 'collection-right',
		position: 'right',
		image: FALLBACK_IMAGE_FILES.SECTION,
		link: '/shop?category=art-pieces',
		title: 'Art Pieces'
	}
];

export const frontendPages: Record<string, Page> = {
	home: {
		id: 'page-home',
		slug: 'home',
		title: 'Panda Wonderland',
		metaDescription: 'Cute and playful panda cultural creative products.',
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	shop: {
		id: 'page-shop',
		slug: 'shop',
		title: 'Panda Shop',
		metaDescription: 'Explore the full panda catalog.',
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	collection: {
		id: 'page-collection',
		slug: 'collection',
		title: 'Panda Collection',
		metaDescription: 'Visual curation of our newest panda arrivals.',
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	account: {
		id: 'page-account',
		slug: 'account',
		title: 'Account',
		metaDescription: 'Frontend-only account shell.',
		heroImage: CONTENT_IMAGES.ABOUT_HERO,
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	about: {
		id: 'page-about',
		slug: 'about',
		title: 'About Us',
		metaDescription: 'Spreading joy with cute pandas.',
		ogImage: CONTENT_IMAGES.ABOUT_HERO,
		content:
			'<p>We are dedicated to bringing you the most adorable panda-themed lifestyle and cultural products.</p>'
	}
};

export const frontendSections: Record<string, UISection[]> = {
	home: [
		{
			id: 'home-hero',
			type: 'hero',
			heading: 'PANDA CREATIVE',
			subheading: 'Welcome to the Bamboo Forest',
			imageUrl: CONTENT_IMAGES.HOME_HERO,
			sortOrder: 1,
			isActive: true,
			settings: {
				actions: [
					{ text: 'Collection', link: '/collection' },
					{ text: 'Shop', link: '/shop' }
				]
			}
		},
		{
			id: 'home-categories',
			type: 'category_grid',
			heading: 'Our Collections',
			sortOrder: 2,
			isActive: true,
			settings: {}
		},
		{
			id: 'home-products',
			type: 'product_grid',
			heading: 'Panda Favorites',
			subheading: 'Most Loved',
			sortOrder: 3,
			isActive: true,
			settings: {
				actions: [{ text: 'View All', link: '/shop' }]
			}
		},
		{
			id: 'home-story',
			type: 'feature_split',
			heading: 'Designed For Joy',
			content:
				'<p>Every piece is crafted to bring a smile to your face. From soft plushies to beautifully illustrated stationery.</p>',
			imageUrl: CONTENT_IMAGES.HOME_STORY,
			sortOrder: 4,
			isActive: true,
			settings: {
				actions: [{ text: 'Read Our Story', link: '/about' }]
			}
		},
		{
			id: 'home-cta',
			type: 'cta_banner',
			heading: 'Join the Panda Club',
			subheading: 'Exclusive Perks',
			content: '<p>Get early access to new blind boxes and special plushie drops.</p>',
			sortOrder: 5,
			isActive: true,
			settings: {
				actions: [{ text: 'Sign Up', link: '/account' }]
			}
		}
	],
	shop: [
		{
			id: 'shop-hero',
			type: 'hero',
			heading: 'Shop All Pandas',
			subheading: 'Find your new friend',
			imageUrl: CONTENT_IMAGES.HOME_HERO,
			sortOrder: 1,
			isActive: true,
			settings: {
				actions: [{ text: 'See Collection', link: '/collection' }]
			}
		}
	],
	collection: []
};

export function getPageBySlug(slug: string) {
	return frontendPages[slug] ?? null;
}

export function getSectionsBySlug(slug: string) {
	return frontendSections[slug] ?? [];
}
