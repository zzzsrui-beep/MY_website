import type { Category, Product } from '$lib/types';

const makePriceLabel = (value: number) => `$${value.toFixed(2)}`;

export const frontendCategories: Category[] = [
	{
		id: 'cat-mens',
		title: 'Mens',
		name: 'Mens',
		slug: 'mens',
		isVisible: true,
		sortOrder: 1
	},
	{
		id: 'cat-womens',
		title: 'Womens',
		name: 'Womens',
		slug: 'womens',
		isVisible: true,
		sortOrder: 2
	},
	{
		id: 'cat-accessories',
		title: 'Accessories',
		name: 'Accessories',
		slug: 'accessories',
		isVisible: true,
		sortOrder: 3
	}
];

export const frontendProducts: Product[] = [
	{
		id: 'obsidian-trench',
		slug: 'obsidian-trench',
		title: 'Obsidian Trench',
		description: 'Structured long coat with clean tailoring.',
		priceValue: 420,
		price: makePriceLabel(420),
		image:
			'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			colors: ['Black', 'Stone'],
			sizes: ['S', 'M', 'L'],
			details: ['Double-breasted closure', 'Soft lining'],
			material: 'Wool blend',
			care: 'Dry clean only',
			shipping: 'Ships in 1-2 business days'
		},
		variants: [
			{
				id: 'v-obsidian-black-s',
				product: 'obsidian-trench',
				color: 'Black',
				colorSwatch: '#111111',
				size: 'S',
				sku: 'OBS-BLK-S',
				stockQuantity: 4,
				stockStatus: 'in_stock',
				image:
					'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
				galleryImages: [
					'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
					'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'
				]
			},
			{
				id: 'v-obsidian-black-m',
				product: 'obsidian-trench',
				color: 'Black',
				colorSwatch: '#111111',
				size: 'M',
				sku: 'OBS-BLK-M',
				stockQuantity: 7,
				stockStatus: 'in_stock',
				image:
					'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
				galleryImages: [
					'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
				]
			}
		],
		categories: [frontendCategories[0]],
		categoryIds: ['cat-mens'],
		isFeature: true,
		hasVariants: true,
		stockStatus: 'in_stock',
		gender: 'mens',
		tag: 'New'
	},
	{
		id: 'ivory-knit',
		slug: 'ivory-knit',
		title: 'Ivory Knit Set',
		description: 'Soft layering knit for transitional weather.',
		priceValue: 260,
		price: makePriceLabel(260),
		image:
			'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: {
			colors: ['Ivory'],
			sizes: ['XS', 'S', 'M'],
			details: ['Relaxed knit silhouette'],
			material: 'Merino wool blend',
			care: 'Hand wash cold'
		},
		variants: [
			{
				id: 'v-ivory-knit-s',
				product: 'ivory-knit',
				color: 'Ivory',
				colorSwatch: '#F2EFE8',
				size: 'S',
				sku: 'IVR-S',
				stockQuantity: 8,
				stockStatus: 'in_stock',
				image:
					'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
				galleryImages: [
					'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop'
				]
			}
		],
		categories: [frontendCategories[1]],
		categoryIds: ['cat-womens'],
		isFeature: true,
		hasVariants: true,
		stockStatus: 'in_stock',
		gender: 'womens',
		tag: 'Bestseller'
	},
	{
		id: 'city-hoodie',
		slug: 'city-hoodie',
		title: 'City Hoodie',
		description: 'Heavyweight cotton hoodie with relaxed cut.',
		priceValue: 180,
		price: makePriceLabel(180),
		image:
			'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: { colors: ['Graphite'], sizes: ['S', 'M', 'L', 'XL'] },
		variants: [],
		categories: [frontendCategories[0]],
		categoryIds: ['cat-mens'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'mens'
	},
	{
		id: 'silk-slip',
		slug: 'silk-slip',
		title: 'Silk Slip Dress',
		description: 'Fluid silhouette in washed silk blend.',
		priceValue: 340,
		price: makePriceLabel(340),
		image:
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: { colors: ['Midnight'], sizes: ['XS', 'S', 'M'] },
		variants: [],
		categories: [frontendCategories[1]],
		categoryIds: ['cat-womens'],
		isFeature: false,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'womens'
	},
	{
		id: 'leather-tote',
		slug: 'leather-tote',
		title: 'Leather Tote',
		description: 'Everyday tote with reinforced base.',
		priceValue: 230,
		price: makePriceLabel(230),
		image:
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: { colors: ['Brown'], sizes: ['O/S'] },
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-accessories'],
		isFeature: true,
		hasVariants: false,
		stockStatus: 'in_stock',
		gender: 'unisex'
	},
	{
		id: 'minimal-sneaker',
		slug: 'minimal-sneaker',
		title: 'Minimal Sneaker',
		description: 'Clean low-top with premium leather upper.',
		priceValue: 210,
		price: makePriceLabel(210),
		image:
			'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop',
		images: [
			'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop'
		],
		attributes: { colors: ['White'], sizes: ['40', '41', '42', '43'] },
		variants: [],
		categories: [frontendCategories[2]],
		categoryIds: ['cat-accessories'],
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
