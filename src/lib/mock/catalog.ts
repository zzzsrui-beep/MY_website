import type { Category, Product } from '$lib/types';

const makePriceLabel = (value: number) => `$${value.toFixed(2)}`;

export const frontendCategories: Category[] = [
	{
		id: 'cat-plush-toys',
		title: 'Plush Toys',
		name: 'Plush Toys',
		slug: 'plush-toys',
		isVisible: true,
		sortOrder: 1
	},
	{
		id: 'cat-art-pieces',
		title: 'Art Pieces',
		name: 'Art Pieces',
		slug: 'art-pieces',
		isVisible: true,
		sortOrder: 2
	},
	{
		id: 'cat-apparel-accessories',
		title: 'Apparel Accessories',
		name: 'Apparel Accessories',
		slug: 'apparel-accessories',
		isVisible: true,
		sortOrder: 3
	},
	{
		id: 'cat-souvenirs',
		title: 'Souvenirs',
		name: 'Souvenirs',
		slug: 'souvenirs',
		isVisible: true,
		sortOrder: 4
	},
	{
		id: 'cat-daily-products',
		title: 'Daily Products',
		name: 'Daily Products',
		slug: 'daily-products',
		isVisible: true,
		sortOrder: 5
	},
	{
		id: 'cat-digital-products',
		title: 'Digital Products',
		name: 'Digital Products',
		slug: 'digital-products',
		isVisible: true,
		sortOrder: 6
	},
	{
		id: 'cat-promo-products',
		title: 'Promo Products',
		name: 'Promo Products',
		slug: 'promo-products',
		isVisible: true,
		sortOrder: 7
	}
];

export const frontendProducts: Product[] = [
	{
		id: 'giant-panda-plush',
		slug: 'giant-panda-plush',
		title: 'Giant Huggable Panda',
		description: 'A super soft oversized panda plush perfect for cuddling.',
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
		categoryIds: ['cat-plush-toys'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex',
		tag: 'Bestseller'
	},
	{
		id: 'mini-panda-key-plush',
		slug: 'mini-panda-key-plush',
		title: 'Mini Panda Key Plush',
		description: 'Pocket-size panda plush with keyring clip.',
		priceValue: 14,
		price: makePriceLabel(14),
		image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Plush + Alloy Clip'
		},
		variants: [],
		categories: [frontendCategories[0]],
		categoryIds: ['cat-plush-toys'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-wall-art-print',
		slug: 'panda-wall-art-print',
		title: 'Panda Wall Art Print',
		description: 'Museum-grade panda illustration print for studio walls.',
		priceValue: 39,
		price: makePriceLabel(39),
		image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['A2 Size', 'Matte Finish']
		},
		variants: [],
		categories: [frontendCategories[1]],
		categoryIds: ['cat-art-pieces'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'ink-panda-sketchbook',
		slug: 'ink-panda-sketchbook',
		title: 'Ink Panda Sketchbook',
		description: 'Artist sketchbook with panda-themed cover art.',
		priceValue: 24,
		price: makePriceLabel(24),
		image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['120 gsm paper', 'Hardcover']
		},
		variants: [],
		categories: [frontendCategories[1]],
		categoryIds: ['cat-art-pieces'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'bamboo-hoodie',
		slug: 'bamboo-hoodie',
		title: 'Bamboo Panda Hoodie',
		description: 'Heavyweight hoodie with embroidered panda icon.',
		priceValue: 62,
		price: makePriceLabel(62),
		image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Cotton Fleece'
		},
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-apparel-accessories'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-bamboo-cap',
		slug: 'panda-bamboo-cap',
		title: 'Panda Bamboo Cap',
		description: 'Low-profile cap with stitched panda patch.',
		priceValue: 28,
		price: makePriceLabel(28),
		image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Cotton Twill'
		},
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-apparel-accessories'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-city-magnet',
		slug: 'panda-city-magnet',
		title: 'Panda City Magnet',
		description: 'Travel magnet featuring panda skyline artwork.',
		priceValue: 9,
		price: makePriceLabel(9),
		image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Resin'
		},
		variants: [],
		categories: [frontendCategories[3]],
		categoryIds: ['cat-souvenirs'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-travel-pin-set',
		slug: 'panda-travel-pin-set',
		title: 'Panda Travel Pin Set',
		description: 'Set of 4 enamel pins inspired by panda adventures.',
		priceValue: 16,
		price: makePriceLabel(16),
		image: 'https://images.unsplash.com/photo-1620063238128-4081cde3bd88?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1620063238128-4081cde3bd88?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Enamel'
		},
		variants: [],
		categories: [frontendCategories[3]],
		categoryIds: ['cat-souvenirs'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex',
		tag: 'New'
	},
	{
		id: 'panda-ceramic-mug',
		slug: 'panda-ceramic-mug',
		title: 'Chubby Panda Ceramic Mug',
		description: '12oz ceramic mug with 3D panda face detail.',
		priceValue: 22,
		price: makePriceLabel(22),
		image: 'https://images.unsplash.com/photo-1514228742587-a6fdfaac4f7d?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1514228742587-a6fdfaac4f7d?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			material: 'Ceramic',
			care: 'Microwave safe'
		},
		variants: [],
		categories: [frontendCategories[4]],
		categoryIds: ['cat-daily-products'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'bamboo-notebook-set',
		slug: 'bamboo-notebook-set',
		title: 'Bamboo Forest Notebook Set',
		description: 'Set of 3 notebooks with panda line art.',
		priceValue: 18,
		price: makePriceLabel(18),
		image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['A5 Size', 'Eco Paper']
		},
		variants: [],
		categories: [frontendCategories[4]],
		categoryIds: ['cat-daily-products'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-wireless-mouse',
		slug: 'panda-wireless-mouse',
		title: 'Panda Wireless Mouse',
		description: 'Silent click mouse with panda shell design.',
		priceValue: 34,
		price: makePriceLabel(34),
		image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['2.4G Wireless', 'Rechargeable']
		},
		variants: [],
		categories: [frontendCategories[5]],
		categoryIds: ['cat-digital-products'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-usb-lamp',
		slug: 'panda-usb-lamp',
		title: 'Panda USB Night Lamp',
		description: 'Soft warm desk lamp powered by USB.',
		priceValue: 26,
		price: makePriceLabel(26),
		image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['USB-C', '3 Brightness Levels']
		},
		variants: [],
		categories: [frontendCategories[5]],
		categoryIds: ['cat-digital-products'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'panda-mystery-blind-box',
		slug: 'panda-mystery-blind-box',
		title: 'Panda Mystery Blind Box',
		description: 'Random panda mini figure from promo series.',
		priceValue: 11,
		price: makePriceLabel(11),
		image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['Limited Promo']
		},
		variants: [],
		categories: [frontendCategories[6]],
		categoryIds: ['cat-promo-products'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex',
		tag: 'Promo'
	},
	{
		id: 'panda-festival-bundle',
		slug: 'panda-festival-bundle',
		title: 'Panda Festival Bundle',
		description: 'Special discount combo with panda daily goods.',
		priceValue: 49,
		price: makePriceLabel(49),
		image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			details: ['Bundle Offer']
		},
		variants: [],
		categories: [frontendCategories[6]],
		categoryIds: ['cat-promo-products'],
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
