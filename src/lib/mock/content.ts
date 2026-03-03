import { CONTENT_IMAGES } from '$lib/constants';
import type { Page, UIAsset, UISection } from '$lib/types';

export const frontendHomeAssets: UIAsset[] = [
	{
		id: 'asset-mens',
		key: 'hero_category_mens',
		url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop'
	},
	{
		id: 'asset-womens',
		key: 'hero_category_womens',
		url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop'
	},
	{
		id: 'asset-accessories',
		key: 'hero_category_accessories',
		url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop'
	}
];

export const frontendCollectionImages = [
	{
		id: 'collection-left',
		position: 'left',
		image:
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
		link: '/shop?gender=womens',
		title: 'Shop Woman > New Arrivals'
	},
	{
		id: 'collection-right',
		position: 'right',
		image:
			'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
		link: '/shop?gender=mens',
		title: 'Shop Man'
	}
];

export const frontendPages: Record<string, Page> = {
	home: {
		id: 'page-home',
		slug: 'home',
		title: 'Modern Essentials',
		metaDescription: 'Curated pieces built for everyday luxury.',
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	shop: {
		id: 'page-shop',
		slug: 'shop',
		title: 'Shop',
		metaDescription: 'Explore the full catalog.',
		ogImage: CONTENT_IMAGES.OG_DEFAULT,
		content: ''
	},
	collection: {
		id: 'page-collection',
		slug: 'collection',
		title: 'Collection',
		metaDescription: 'Visual curation of our newest arrivals.',
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
		title: 'About',
		metaDescription: 'Design-first wardrobe essentials.',
		ogImage: CONTENT_IMAGES.ABOUT_HERO,
		content:
			'<p>We are running in frontend-only mode. This project now focuses on UI structure and style, ready for a new backend integration later.</p>'
	}
};

export const frontendSections: Record<string, UISection[]> = {
	home: [
		{
			id: 'home-hero',
			type: 'hero',
			heading: 'PANDASHOP',
			subheading: '',
			imageUrl: CONTENT_IMAGES.HOME_HERO,
			sortOrder: 1,
			isActive: true,
			settings: {
				actions: [
					{ text: 'Shop Mens', link: '/shop?gender=mens' },
					{ text: 'Shop Womens', link: '/shop?gender=womens' }
				]
			}
		},
		{
			id: 'home-categories',
			type: 'category_grid',
			heading: 'Categories',
			sortOrder: 2,
			isActive: true,
			settings: {}
		},
		{
			id: 'home-products',
			type: 'product_grid',
			heading: 'Featured Selection',
			subheading: 'Curated Edit',
			sortOrder: 3,
			isActive: true,
			settings: {
				actions: [{ text: 'View All', link: '/shop' }]
			}
		},
		{
			id: 'home-story',
			type: 'feature_split',
			heading: 'Built For Quiet Confidence',
			content:
				'<p>Tailored silhouettes, restrained palettes, and premium fabrics define our direction.</p>',
			imageUrl: CONTENT_IMAGES.HOME_STORY,
			sortOrder: 4,
			isActive: true,
			settings: {
				actions: [{ text: 'Read About', link: '/about' }]
			}
		},
		{
			id: 'home-cta',
			type: 'cta_banner',
			heading: 'Stay In The Loop',
			subheading: 'Members Access',
			content: '<p>Get early access to drops and seasonal edits.</p>',
			sortOrder: 5,
			isActive: true,
			settings: {
				actions: [{ text: 'Contact Us', link: '/contact' }]
			}
		}
	],
	shop: [
		{
			id: 'shop-hero',
			type: 'hero',
			heading: 'Shop',
			subheading: 'All Products',
			imageUrl:
				'https://images.unsplash.com/photo-1462396240927-52058a6a84ec?q=80&w=1600&auto=format&fit=crop',
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
