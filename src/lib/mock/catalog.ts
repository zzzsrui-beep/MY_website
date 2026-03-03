import type { Category, Product } from '$lib/types';

const makePriceLabel = (value: number) => `$${value.toFixed(2)}`;

export const frontendCategories: Category[] = [
	{
		id: 'cat-plushies',
		title: 'Plushies',
		name: 'Plushies',
		slug: 'plushies',
		isVisible: true,
		sortOrder: 1
	},
	{
		id: 'cat-stationery',
		title: 'Stationery',
		name: 'Stationery',
		slug: 'stationery',
		isVisible: true,
		sortOrder: 2
	},
	{
		id: 'cat-lifestyle',
		title: 'Lifestyle',
		name: 'Lifestyle',
		slug: 'lifestyle',
		isVisible: true,
		sortOrder: 3
	}
];

export const frontendProducts: Product[] = [
	{
		id: 'giant-panda-plush',
		slug: 'giant-panda-plush',
		title: 'Giant Huggable Panda',
		description: 'A super soft, oversized panda plush perfect for cuddling. Made with premium marshmallow fluff.',
		priceValue: 45,
		price: makePriceLabel(45),
		image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: '100% Polyester Fluff',
			care: 'Spot clean only'
		},
		variants: [],
		categories: [frontendCategories[0]],
		categoryIds: ['cat-plushies'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex',
		tag: 'Bestseller'
	},
    {
		id: 'panda-notebook-set',
		slug: 'panda-notebook-set',
		title: 'Bamboo Forest Notebook Set',
		description: 'Set of 3 A5 notebooks with adorable panda illustrations. Dotted, lined, and blank pages.',
		priceValue: 18,
		price: makePriceLabel(18),
		image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['100 gsm paper', 'Eco-friendly']
		},
		variants: [],
		categories: [frontendCategories[1]],
		categoryIds: ['cat-stationery'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
    {
		id: 'panda-ceramic-mug',
		slug: 'panda-ceramic-mug',
		title: 'Chubby Panda Ceramic Mug',
		description: 'Start your morning with a smile. This 12oz ceramic mug features a 3D panda face.',
		priceValue: 22,
		price: makePriceLabel(22),
		image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Ceramic',
			care: 'Microwave and dishwasher safe'
		},
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-lifestyle'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
    {
		id: 'panda-keychain',
		slug: 'panda-keychain',
		title: 'Enamel Panda Keychain',
		description: 'A cute little enamel keychain to accompany your keys or backpack.',
		priceValue: 12,
		price: makePriceLabel(12),
		image: 'https://images.unsplash.com/photo-1620063238128-4081cde3bd88?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1620063238128-4081cde3bd88?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Enamel & Zinc Alloy'
		},
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-lifestyle'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex',
        tag: 'New'
	},
	{
		id: 'bamboo-tote-bag',
		slug: 'bamboo-tote-bag',
		title: 'Bamboo Canvas Tote Bag',
		description: 'Everyday reusable canvas tote bag with a minimalist bamboo and panda print.',
		priceValue: 25,
		price: makePriceLabel(25),
		image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: '100% Organic Cotton',
			care: 'Machine wash cold'
		},
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-lifestyle'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	}
];

export function getFeaturedProducts() {
	return frontendProducts.filter((product) => product.isFeature);
}

export function getProducts(options?: {
	categorySlug?: string | null;
	gender?: string | null;
	isFeatured?: boolean;
}) {
	let products = [...frontendProducts];

	if (options?.isFeatured) {
		products = products.filter((product) => product.isFeature);
	}

	if (options?.gender) {
		products = products.filter((product) => product.gender === options.gender);
	}

	if (options?.categorySlug) {
		products = products.filter((product) =>
			(product.categoryIds ?? []).some((categoryId) =>
				frontendCategories.some(
					(category) => category.id === categoryId && category.slug === options.categorySlug
				)
			)
		);
	}

	return products;
}

export function getProductByIdOrSlug(idOrSlug: string) {
	return frontendProducts.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;
}

export function getRelatedProducts(idOrSlug: string, limit = 4) {
	const current = getProductByIdOrSlug(idOrSlug);
	if (!current) return frontendProducts.slice(0, limit);

	const related = frontendProducts.filter(
		(product) =>
			product.id !== current.id &&
			(product.gender === current.gender ||
				(product.categoryIds ?? []).some((id) => (current.categoryIds ?? []).includes(id)))
	);

	return (related.length > 0 ? related : frontendProducts.filter((product) => product.id !== current.id)).slice(
		0,
		limit
	);
}

export function parseCatalogFilters(url: URL, fallbackSlug: 'shop' | 'collection') {
	return {
		categorySlug: url.searchParams.get('category'),
		gender: url.searchParams.get('gender'),
		pageSlug: url.searchParams.get('page') || fallbackSlug
	};
}
