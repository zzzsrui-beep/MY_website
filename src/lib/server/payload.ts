import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
	Collections,
	NavigationLocationOptions,
	UiAssetsGroupOptions
} from '$lib/pocketbase-types';
import { CONTENT_IMAGES, DEFAULTS, isValidSlug } from '$lib/constants';
import { formatCurrency, parsePrice } from '$lib/utils/price';
import { sanitizeCmsHtml } from '$lib/server/sanitize';
import { computeStockStatus } from '$lib/server/stock-status';
import type {
	Category,
	GlobalSettings,
	NavItem,
	Page,
	Product,
	ProductVariant,
	UIAsset,
	UISection,
	UISectionSettings
} from '$lib/types';

type PayloadDoc = Record<string, unknown>;

type PayloadListResponse = {
	docs?: unknown[];
};

const DEFAULT_COLLECTION_LIMIT = 200;

function asRecord(value: unknown): PayloadDoc | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	return value as PayloadDoc;
}

function asArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
	return typeof value === 'boolean' ? value : undefined;
}

function toStringId(value: unknown, fallback = ''): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return fallback;
}

function nowIso(): string {
	return new Date().toISOString();
}

function getPayloadBaseUrl(): string {
	const base = env.PAYLOAD_URL || publicEnv.PUBLIC_PAYLOAD_URL || '';
	return base.replace(/\/$/, '');
}

export function isPayloadEnabled(): boolean {
	const provider = (env.CMS_PROVIDER || publicEnv.PUBLIC_CMS_PROVIDER || '').toLowerCase();
	return provider === 'payload' && Boolean(getPayloadBaseUrl());
}

function getPayloadHeaders(): HeadersInit {
	const apiKey = env.PAYLOAD_API_KEY || env.PAYLOAD_TOKEN || '';
	return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
}

function makeAbsoluteUrl(raw: string): string {
	if (!raw) return '';
	if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
	const base = getPayloadBaseUrl();
	if (!base) return raw;
	return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
}

function resolveMediaUrl(value: unknown): string {
	if (!value) return '';
	if (typeof value === 'string') return makeAbsoluteUrl(value);

	const media = asRecord(value);
	if (!media) return '';

	const url = asString(media.url);
	if (url) return makeAbsoluteUrl(url);

	const filename = asString(media.filename);
	if (filename) return makeAbsoluteUrl(filename);

	return '';
}

async function payloadRequest(path: string, params?: Record<string, string | number | boolean>) {
	const base = getPayloadBaseUrl();
	if (!base) {
		throw new Error('PAYLOAD_URL/PUBLIC_PAYLOAD_URL is not configured');
	}

	const url = new URL(path.startsWith('/') ? path : `/${path}`, base);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.set(key, String(value));
		});
	}

	const response = await fetch(url.toString(), {
		headers: {
			Accept: 'application/json',
			...getPayloadHeaders()
		}
	});

	if (!response.ok) {
		throw new Error(`Payload request failed (${response.status}): ${url.pathname}`);
	}

	return response.json();
}

async function payloadCollectionDocs(
	collection: string,
	params?: Record<string, string | number | boolean>
): Promise<PayloadDoc[]> {
	const json = (await payloadRequest(`/api/${collection}`, {
		limit: DEFAULT_COLLECTION_LIMIT,
		depth: 2,
		draft: false,
		...params
	})) as PayloadListResponse;

	return asArray(json.docs).map((doc) => asRecord(doc)).filter((doc): doc is PayloadDoc => !!doc);
}

function extractRelatedIds(value: unknown): string[] {
	return asArray(value)
		.map((entry) => {
			const record = asRecord(entry);
			if (record) return toStringId(record.id);
			return toStringId(entry);
		})
		.filter(Boolean);
}

function readString(source: PayloadDoc, keys: string[], fallback = ''): string {
	for (const key of keys) {
		const value = asString(source[key]);
		if (value && value.trim()) return value;
	}
	return fallback;
}

function readBoolean(source: PayloadDoc, keys: string[], fallback = false): boolean {
	for (const key of keys) {
		const value = asBoolean(source[key]);
		if (value !== undefined) return value;
	}
	return fallback;
}

function readNumber(source: PayloadDoc, keys: string[], fallback = 0): number {
	for (const key of keys) {
		const value = source[key];
		const direct = asNumber(value);
		if (direct !== undefined) return direct;
		if (typeof value === 'string' && value.trim()) {
			const parsed = Number(value);
			if (Number.isFinite(parsed)) return parsed;
		}
	}
	return fallback;
}

function fallbackNavItems(): NavItem[] {
	const fallbackBase = {
		collectionId: 'payload',
		collectionName: Collections.Navigation,
		is_visible: true,
		parent: '',
		created: nowIso(),
		updated: nowIso()
	};

	return [
		{
			...fallbackBase,
			id: '1',
			location: NavigationLocationOptions.header,
			label: 'Collection',
			url: '/collection',
			order: 1,
			isVisible: true
		},
		{
			...fallbackBase,
			id: '2',
			location: NavigationLocationOptions.header,
			label: 'Mens',
			url: '/shop?gender=mens',
			order: 2,
			isVisible: true
		},
		{
			...fallbackBase,
			id: '3',
			location: NavigationLocationOptions.header,
			label: 'Womens',
			url: '/shop?gender=womens',
			order: 3,
			isVisible: true
		},
		{
			...fallbackBase,
			id: '4',
			location: NavigationLocationOptions.header,
			label: 'Accessories',
			url: '/shop?category=accessories',
			order: 4,
			isVisible: true
		}
	] as NavItem[];
}

function fallbackSettings(): GlobalSettings {
	return {
		id: 'payload_fallback_settings',
		collectionId: 'payload',
		collectionName: Collections.GlobalSettings,
		site_name: DEFAULTS.siteName,
		currency_symbol: DEFAULTS.currencySymbol,
		currency_code: DEFAULTS.currencyCode,
		shipping_threshold: DEFAULTS.freeShippingThreshold,
		maintenance_mode: false,
		siteName: DEFAULTS.siteName,
		currencySymbol: DEFAULTS.currencySymbol,
		currencyCode: DEFAULTS.currencyCode,
		shippingThreshold: DEFAULTS.freeShippingThreshold,
		maintenanceMode: false,
		icon: '',
		storyImage: CONTENT_IMAGES.HOME_STORY,
		aboutHeroImage: CONTENT_IMAGES.ABOUT_HERO,
		aboutSectionImage: CONTENT_IMAGES.ABOUT_SECTION,
		emptyWishlistImage: CONTENT_IMAGES.WISHLIST_EMPTY
	};
}

function mapPayloadCategory(doc: PayloadDoc): Category {
	const id = toStringId(doc.id, crypto.randomUUID());
	const title = readString(doc, ['title', 'name', 'label'], 'Untitled');

	return {
		id,
		collectionId: 'payload',
		collectionName: 'categories',
		title,
		name: readString(doc, ['name'], title),
		slug: readString(doc, ['slug'], id),
		parent: toStringId(doc.parent || ''),
		isVisible: readBoolean(doc, ['isVisible', 'is_visible'], true),
		sortOrder: readNumber(doc, ['sortOrder', 'sort_order', 'order'], 0),
		image: resolveMediaUrl(doc.image)
	};
}

function mapPayloadVariant(doc: PayloadDoc): ProductVariant {
	const id = toStringId(doc.id, crypto.randomUUID());
	const stockQuantity = readNumber(doc, ['stockQuantity', 'stock_quantity', 'stock'], 0);
	const galleryImages = asArray(doc.galleryImages || doc.gallery_images)
		.map((entry) => resolveMediaUrl(entry))
		.filter(Boolean);

	return {
		id,
		collectionId: 'payload',
		collectionName: 'product_variants',
		product: toStringId(doc.product),
		color: readString(doc, ['color'], 'default'),
		colorSwatch: readString(doc, ['colorSwatch', 'color_swatch']),
		size: readString(doc, ['size'], 'One Size'),
		sku: readString(doc, ['sku'], id),
		stockStatus: computeStockStatus(stockQuantity),
		galleryImages,
		image: galleryImages[0],
		stockQuantity
	};
}

function deriveProductGender(categories: Category[]): 'mens' | 'womens' | 'unisex' {
	if (categories.some((category) => ['mens', 'men'].includes(category.slug))) return 'mens';
	if (categories.some((category) => ['womens', 'women'].includes(category.slug))) return 'womens';
	return 'unisex';
}

function mapPayloadProduct(doc: PayloadDoc, allCategories: Category[]): Product {
	const id = toStringId(doc.id, crypto.randomUUID());
	const slug = readString(doc, ['slug'], id);

	const categoryIds = extractRelatedIds(doc.categories || doc.category);
	const categories = allCategories.filter((category) => categoryIds.includes(category.id));

	const rawVariants = asArray(doc.variants)
		.map((entry) => asRecord(entry))
		.filter((entry): entry is PayloadDoc => !!entry);
	const variants = rawVariants.map((variant) => mapPayloadVariant(variant));
	const hasVariants = variants.length > 0;

	const imageCandidates = [
		resolveMediaUrl(doc.image),
		...asArray(doc.images).map((entry) => resolveMediaUrl(entry))
	].filter(Boolean);
	const image = imageCandidates[0] || '';
	const images = imageCandidates.length > 0 ? imageCandidates : image ? [image] : [];

	const priceCents = readNumber(doc, ['priceCents', 'price_cents'], NaN);
	const rawPrice = Number.isFinite(priceCents)
		? priceCents / 100
		: readNumber(doc, ['priceValue', 'price_value', 'price', 'amount'], NaN);
	const priceValue = Number.isFinite(rawPrice)
		? rawPrice
		: parsePrice(readString(doc, ['priceFormatted', 'price_formatted', 'price'], '0'));

	const price = formatCurrency(priceValue, {
		currency: readString(doc, ['currency', 'currencyCode', 'currency_code'], DEFAULTS.currencyCode)
	});

	const stockQuantity = readNumber(doc, ['stockQuantity', 'stock_quantity', 'stock'], 0);
	const stockStatus = hasVariants
		? computeStockStatus(variants.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0))
		: computeStockStatus(stockQuantity);

	return {
		id: slug,
		collectionId: 'payload',
		collectionName: 'products',
		title: readString(doc, ['title', 'name'], 'Untitled Product'),
		slug,
		description: sanitizeCmsHtml(readString(doc, ['description', 'content'])),
		price,
		priceValue,
		image,
		images,
		variants: hasVariants ? variants : undefined,
		categories: categories.length ? categories : undefined,
		categoryIds: categoryIds.length ? categoryIds : undefined,
		attributes: (asRecord(doc.attributes) as Record<string, unknown> | undefined) || {},
		isFeature: readBoolean(doc, ['isFeature', 'isFeatured', 'is_featured'], false),
		hasVariants,
		stockStatus,
		gender: deriveProductGender(categories),
		stripePriceId: readString(doc, ['stripePriceId', 'stripe_price_id']),
		tag: readString(doc, ['tag'])
	};
}

function mapPayloadPage(doc: PayloadDoc): Page {
	const id = toStringId(doc.id, crypto.randomUUID());
	const slug = readString(doc, ['slug'], id);
	const title = readString(doc, ['title'], slug);

	const heroImage = resolveMediaUrl(doc.heroImage || doc.hero_image);
	const ogImage = resolveMediaUrl(doc.ogImage || doc.og_image);
	const metaDescription = readString(doc, ['metaDescription', 'meta_description']);

	return {
		id,
		collectionId: 'payload',
		collectionName: Collections.Pages,
		slug,
		title,
		content: sanitizeCmsHtml(readString(doc, ['content'])),
		meta_description: metaDescription,
		metaDescription,
		hero_image: heroImage,
		heroImage,
		og_image: ogImage,
		ogImage
	};
}

function normalizeSectionType(value: string): UISection['type'] {
	const allowed: UISection['type'][] = [
		'hero',
		'feature_split',
		'product_grid',
		'category_grid',
		'rich_text',
		'cta_banner'
	];
	return allowed.includes(value as UISection['type']) ? (value as UISection['type']) : 'rich_text';
}

function mapPayloadSection(doc: PayloadDoc, pageId: string): UISection {
	const id = toStringId(doc.id, crypto.randomUUID());
	const settings = (asRecord(doc.settings) as UISectionSettings | null) || {};

	return {
		id,
		collectionId: 'payload',
		collectionName: Collections.UiSections,
		content: sanitizeCmsHtml(readString(doc, ['content'])),
		heading: readString(doc, ['heading']),
		subheading: readString(doc, ['subheading']),
		is_active: readBoolean(doc, ['isActive', 'is_active'], true),
		page: pageId,
		settings,
		sort_order: readNumber(doc, ['sortOrder', 'sort_order'], 0),
		schedule_start: readString(doc, ['scheduleStart', 'schedule_start']),
		schedule_end: readString(doc, ['scheduleEnd', 'schedule_end']),
		pageId,
		type: normalizeSectionType(readString(doc, ['type', 'blockType'], 'rich_text')),
		imageUrl: resolveMediaUrl(doc.image),
		videoUrl: resolveMediaUrl(doc.video),
		imageGallery: asArray(doc.imageGallery || doc.images)
			.map((entry) => resolveMediaUrl(entry))
			.filter(Boolean),
		videoGallery: asArray(doc.videoGallery || doc.videos)
			.map((entry) => resolveMediaUrl(entry))
			.filter(Boolean),
		sortOrder: readNumber(doc, ['sortOrder', 'sort_order'], 0),
		isActive: readBoolean(doc, ['isActive', 'is_active'], true)
	};
}

function mapPayloadAsset(doc: PayloadDoc): UIAsset {
	const groupRaw = readString(doc, ['group'], 'common');
	const group =
		groupRaw === UiAssetsGroupOptions.home ||
		groupRaw === UiAssetsGroupOptions.about ||
		groupRaw === UiAssetsGroupOptions.cart ||
		groupRaw === UiAssetsGroupOptions.wishlist
			? groupRaw
			: UiAssetsGroupOptions.common;

	return {
		id: toStringId(doc.id, crypto.randomUUID()),
		collectionId: 'payload',
		collectionName: Collections.UiAssets,
		key: readString(doc, ['key'], ''),
		group,
		alt_text: readString(doc, ['altText', 'alt_text']),
		description: readString(doc, ['description']),
		url: resolveMediaUrl(doc.image || doc.url),
		altText: readString(doc, ['altText', 'alt_text']),
		image: resolveMediaUrl(doc.image || doc.url)
	};
}

export async function getPayloadGlobalSettings(): Promise<GlobalSettings> {
	const fallback = fallbackSettings();
	const candidates = ['global-settings', 'site-settings', 'settings'];

	for (const slug of candidates) {
		try {
			const raw = await payloadRequest(`/api/globals/${slug}`);
			const doc = asRecord(raw);
			if (!doc) continue;

			const settings: GlobalSettings = {
				...fallback,
				id: toStringId(doc.id, fallback.id),
				site_name: readString(doc, ['site_name', 'siteName'], fallback.site_name),
				currency_symbol: readString(
					doc,
					['currency_symbol', 'currencySymbol'],
					fallback.currency_symbol
				),
				currency_code: readString(doc, ['currency_code', 'currencyCode'], fallback.currency_code),
				shipping_threshold: readNumber(
					doc,
					['shipping_threshold', 'shippingThreshold'],
					fallback.shipping_threshold || DEFAULTS.freeShippingThreshold
				),
				maintenance_mode: readBoolean(doc, ['maintenance_mode', 'maintenanceMode'], false),
				siteName: readString(doc, ['siteName', 'site_name'], fallback.siteName),
				currencySymbol: readString(
					doc,
					['currencySymbol', 'currency_symbol'],
					fallback.currencySymbol
				),
				currencyCode: readString(doc, ['currencyCode', 'currency_code'], fallback.currencyCode),
				shippingThreshold: readNumber(
					doc,
					['shippingThreshold', 'shipping_threshold'],
					fallback.shippingThreshold
				),
				maintenanceMode: readBoolean(doc, ['maintenanceMode', 'maintenance_mode'], false),
				icon: resolveMediaUrl(doc.icon || doc.favicon),
				storyImage: resolveMediaUrl(doc.storyImage) || fallback.storyImage,
				aboutHeroImage: resolveMediaUrl(doc.aboutHeroImage) || fallback.aboutHeroImage,
				aboutSectionImage: resolveMediaUrl(doc.aboutSectionImage) || fallback.aboutSectionImage,
				emptyWishlistImage:
					resolveMediaUrl(doc.emptyWishlistImage) || fallback.emptyWishlistImage
			};

			return settings;
		} catch {
			// Try next global slug.
		}
	}

	return fallback;
}

export async function getPayloadNavigation(
	location?: 'header' | 'footer' | 'mobile'
): Promise<NavItem[]> {
	const fallback = fallbackNavItems();

	try {
		const docs = await payloadCollectionDocs('navigation');
		const navItems = docs
			.map((doc) => {
				const id = toStringId(doc.id, crypto.randomUUID());
				const navLocation = readString(doc, ['location'], location || 'header');
				const itemLocation =
					navLocation === 'footer'
						? NavigationLocationOptions.footer
						: navLocation === 'mobile'
							? NavigationLocationOptions.mobile
							: NavigationLocationOptions.header;

				return {
					id,
					collectionId: 'payload',
					collectionName: Collections.Navigation,
					label: readString(doc, ['label', 'title'], ''),
					url: readString(doc, ['url', 'link'], '/'),
					location: itemLocation,
					order: readNumber(doc, ['order', 'sortOrder', 'sort_order'], 0),
					parent: toStringId(doc.parent),
					is_visible: readBoolean(doc, ['isVisible', 'is_visible'], true),
					isVisible: readBoolean(doc, ['isVisible', 'is_visible'], true),
					children: undefined
				} as NavItem;
			})
			.filter((item) => item.isVisible)
			.filter((item) => (location ? item.location === location : true))
			.sort((a, b) => (a.order || 0) - (b.order || 0));

		if (navItems.length === 0) return fallback;

		const roots = navItems.filter((item) => !item.parent);
		roots.forEach((root) => {
			root.children = navItems.filter((child) => child.parent === root.id);
		});
		return roots;
	} catch {
		return fallback;
	}
}

export async function getPayloadCategories(): Promise<Category[]> {
	try {
		const docs = await payloadCollectionDocs('categories');
		return docs
			.map((doc) => mapPayloadCategory(doc))
			.filter((category) => category.isVisible)
			.sort((a, b) => a.sortOrder - b.sortOrder);
	} catch {
		return [];
	}
}

export async function getPayloadCategoryBySlug(slug: string): Promise<Category | null> {
	if (!isValidSlug(slug)) return null;
	const categories = await getPayloadCategories();
	return categories.find((category) => category.slug === slug) || null;
}

interface PayloadProductFilterOptions {
	categorySlug?: string;
	gender?: string;
	isFeatured?: boolean;
}

export async function getPayloadProducts(options?: PayloadProductFilterOptions): Promise<Product[]> {
	try {
		const [docs, categories] = await Promise.all([
			payloadCollectionDocs('products'),
			getPayloadCategories()
		]);

		let products = docs.map((doc) => mapPayloadProduct(doc, categories));

		if (options?.categorySlug) {
			const target = categories.find((category) => category.slug === options.categorySlug);
			if (target) {
				products = products.filter((product) => product.categoryIds?.includes(target.id));
			}
		}

		if (options?.gender) {
			const target = categories.find((category) => category.slug === options.gender);
			if (target) {
				products = products.filter((product) => product.categoryIds?.includes(target.id));
			}
		}

		if (options?.isFeatured) {
			products = products.filter((product) => product.isFeature);
		}

		return products;
	} catch {
		return [];
	}
}

export async function getPayloadProductBySlug(slug: string): Promise<Product | undefined> {
	if (!isValidSlug(slug)) return undefined;
	const products = await getPayloadProducts();
	return products.find((product) => product.slug === slug || product.id === slug);
}

export async function getPayloadProductsByCategory(categorySlug: string): Promise<Product[]> {
	return getPayloadProducts({ categorySlug });
}

export async function getPayloadFeaturedProducts(): Promise<Product[]> {
	const featured = await getPayloadProducts({ isFeatured: true });
	if (featured.length) return featured;
	return getPayloadProducts();
}

export async function getPayloadRelatedProducts(currentId: string, limit = 4): Promise<Product[]> {
	const products = await getPayloadProducts();
	return products.filter((product) => product.slug !== currentId).slice(0, limit);
}

export async function getPayloadPage(slug: string): Promise<Page | null> {
	if (!isValidSlug(slug)) return null;

	try {
		const docs = await payloadCollectionDocs('pages');
		const matched = docs.find((doc) => readString(doc, ['slug']) === slug);
		if (!matched) return null;
		return mapPayloadPage(matched);
	} catch {
		return null;
	}
}

export async function getPayloadPageSections(pageSlug: string): Promise<UISection[]> {
	try {
		const page = await getPayloadPage(pageSlug);
		if (!page) return [];

		const pageRecord = asRecord(await payloadRequest(`/api/pages/${page.id}`, { depth: 2 }));
		const blockSections = asArray(pageRecord?.layout || pageRecord?.sections);

		if (blockSections.length > 0) {
			return blockSections
				.map((block) => asRecord(block))
				.filter((block): block is PayloadDoc => !!block)
				.map((block, index) => {
					const section = mapPayloadSection(block, page.id);
					section.sortOrder = section.sort_order || index;
					section.sort_order = section.sortOrder;
					return section;
				})
				.sort((a, b) => a.sortOrder - b.sortOrder);
		}

		const docs = await payloadCollectionDocs('ui-sections');
		return docs
			.filter((doc) => {
				const pageRef = doc.page;
				const record = asRecord(pageRef);
				const relatedPageId = record ? toStringId(record.id) : toStringId(pageRef);
				return relatedPageId === page.id;
			})
			.map((doc) => mapPayloadSection(doc, page.id))
			.filter((section) => section.isActive)
			.sort((a, b) => a.sortOrder - b.sortOrder);
	} catch {
		return [];
	}
}

export async function getPayloadAssetsByGroup(group: UIAsset['group']): Promise<UIAsset[]> {
	try {
		const docs = await payloadCollectionDocs('ui-assets');
		return docs
			.map((doc) => mapPayloadAsset(doc))
			.filter((asset) => (group ? asset.group === group : true));
	} catch {
		return [];
	}
}

export async function getPayloadCollectionImages() {
	try {
		const docs = await payloadCollectionDocs('collection-images');
		return docs
			.map((doc) => ({
				id: toStringId(doc.id, crypto.randomUUID()),
				collectionId: 'payload',
				title: readString(doc, ['title'], ''),
				image: resolveMediaUrl(doc.image),
				position: readString(doc, ['position'], 'left'),
				link: readString(doc, ['link'], ''),
				active: readBoolean(doc, ['active', 'isActive', 'is_active'], true)
			}))
			.filter((doc) => doc.active);
	} catch {
		return [];
	}
}
