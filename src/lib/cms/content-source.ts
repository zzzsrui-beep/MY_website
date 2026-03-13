import { env } from '$env/dynamic/public';
import { CONTENT_IMAGES } from '$lib/constants';
import {
	frontendCategories,
	frontendCollectionImages,
	frontendFooterNav,
	frontendHeaderNav,
	frontendHomeAssets,
	frontendPages,
	frontendSections,
	frontendSettings,
	getProductByIdOrSlug as getMockProductByIdOrSlug,
	getRelatedProducts as getMockRelatedProducts,
	getProducts as getMockProducts
} from '$lib/mock';
import type { Category, GlobalSettings, NavItem, Page, Product, UIAsset, UISection } from '$lib/types';
import { fetchPayloadCollection, fetchPayloadGlobal, isPayloadConfigured } from './payload-client';
import { isPayloadProvider } from './provider';

type FetchLike = typeof fetch;
type UnknownRecord = Record<string, unknown>;
type CollectionImageRecord = {
	id: string;
	position: string;
	image: string;
	link?: string;
	title?: string;
	order?: number;
	isActive?: boolean;
};

type ProductQueryOptions = {
	categorySlug?: string | null;
	gender?: string | null;
	isFeatured?: boolean;
};

const warnedContexts = new Set<string>();

function warnPayloadFallback(context: string, error: unknown) {
	if (warnedContexts.has(context)) return;
	warnedContexts.add(context);
	console.warn(`[cms] payload fallback for ${context}`, error);
}

function asRecord(value: unknown): UnknownRecord | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	return value as UnknownRecord;
}

function asString(value: unknown, fallback = '') {
	return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return fallback;
}

function asBoolean(value: unknown, fallback = false) {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') {
		if (value === 'true') return true;
		if (value === 'false') return false;
	}
	return fallback;
}

function escapeHtml(input: string) {
	return input
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function collectLexicalText(node: unknown): string {
	const record = asRecord(node);
	if (!record) return '';

	if (typeof record.text === 'string') return record.text;

	const children = Array.isArray(record.children) ? record.children : [];
	return children.map((child) => collectLexicalText(child)).join('');
}

function richTextToHtml(value: unknown): string {
	const record = asRecord(value);
	const root = asRecord(record?.root);
	const children = Array.isArray(root?.children) ? root.children : [];
	if (!children.length) return '';

	const chunks: string[] = [];

	for (const child of children) {
		const childRecord = asRecord(child);
		if (!childRecord) continue;

		const text = collectLexicalText(childRecord).trim();
		if (!text) continue;

		const type = asString(childRecord.type, 'paragraph');
		const safeText = escapeHtml(text);

		if (type === 'heading') {
			const tag = asString(childRecord.tag, 'h2');
			const validTag = /^h[1-6]$/.test(tag) ? tag : 'h2';
			chunks.push(`<${validTag}>${safeText}</${validTag}>`);
			continue;
		}

		if (type === 'quote') {
			chunks.push(`<blockquote>${safeText}</blockquote>`);
			continue;
		}

		chunks.push(`<p>${safeText}</p>`);
	}

	return chunks.join('');
}

function readLayoutRichText(value: unknown): string {
	if (!Array.isArray(value)) return '';

	const chunks: string[] = [];

	for (const block of value) {
		const record = asRecord(block);
		if (!record) continue;

		const richTextCandidates = [
			record.richText,
			record.introContent,
			record.content,
			record.body
		];

		for (const candidate of richTextCandidates) {
			const html = richTextToHtml(candidate);
			if (html) chunks.push(html);
		}

		const columns = Array.isArray(record.columns) ? record.columns : [];
		for (const column of columns) {
			const columnRecord = asRecord(column);
			if (!columnRecord) continue;
			const html = richTextToHtml(columnRecord.richText);
			if (html) chunks.push(html);
		}
	}

	return chunks.join('');
}

function normalizeNavUrl(url: string) {
	const value = url.trim();
	if (!value) return '/';
	if (/^(https?:\/\/|mailto:|tel:|#)/i.test(value)) return value;
	return value.startsWith('/') ? value : `/${value}`;
}

function parseUrlArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	const output: string[] = [];
	for (const item of value) {
		if (typeof item === 'string') {
			const url = item.trim();
			if (url) output.push(url);
			continue;
		}

		const record = asRecord(item);
		if (!record) continue;
		const url = asString(record.url, asString(record.image, asString(record.value)));
		if (url) output.push(url);
	}
	return output;
}

function uniqueStrings(values: string[]) {
	return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function readRelationshipId(value: unknown) {
	if (typeof value === 'string' || typeof value === 'number') return String(value);

	const record = asRecord(value);
	if (!record) return '';

	if (typeof record.id === 'string' || typeof record.id === 'number') {
		return String(record.id);
	}

	const nestedValue = asRecord(record.value);
	if (!nestedValue) return '';
	if (typeof nestedValue.id === 'string' || typeof nestedValue.id === 'number') {
		return String(nestedValue.id);
	}

	return '';
}

function readMediaUrl(value: unknown) {
	if (typeof value === 'string') return value;
	const record = asRecord(value);
	if (!record) return '';
	return asString(record.url, asString(record.image, asString(record.filename)));
}

function toPriceLabel(priceValue: number) {
	return `$${priceValue.toFixed(2)}`;
}

function filterProductsByOptions(
	products: Product[],
	options?: ProductQueryOptions,
	categoryById?: Map<string, Category>
) {
	let filtered = [...products];

	if (options?.isFeatured) {
		filtered = filtered.filter((product) => product.isFeature);
	}

	if (options?.gender) {
		filtered = filtered.filter((product) => product.gender === options.gender);
	}

	if (options?.categorySlug) {
		const slug = options.categorySlug;
		filtered = filtered.filter((product) => {
			const fromCategoryObjects = (product.categories ?? []).some((category) => category.slug === slug);
			if (fromCategoryObjects) return true;

			const fromCategoryIds = (product.categoryIds ?? []).some(
				(categoryId) => categoryById?.get(categoryId)?.slug === slug
			);
			return fromCategoryIds;
		});
	}

	return filtered;
}

function getConfig() {
	return {
		settingsGlobal: env.PUBLIC_PAYLOAD_SETTINGS_GLOBAL || 'site-settings',
		navigationCollection: env.PUBLIC_PAYLOAD_NAV_COLLECTION || 'navigation',
		pagesCollection: env.PUBLIC_PAYLOAD_PAGE_COLLECTION || 'pages',
		sectionsCollection: env.PUBLIC_PAYLOAD_SECTION_COLLECTION || 'ui-sections',
		assetsCollection: env.PUBLIC_PAYLOAD_ASSET_COLLECTION || 'ui-assets',
		categoryCollection: env.PUBLIC_PAYLOAD_CATEGORY_COLLECTION || 'categories',
		productCollection: env.PUBLIC_PAYLOAD_PRODUCT_COLLECTION || 'products',
		collectionPanelCollection:
			env.PUBLIC_PAYLOAD_COLLECTION_PANEL_COLLECTION || 'collection-panels'
	};
}

function canUsePayload() {
	return isPayloadProvider() && isPayloadConfigured();
}

function mapPayloadSettings(input: UnknownRecord | null): GlobalSettings {
	if (!input) return frontendSettings;
	return {
		...frontendSettings,
		id: asString(input.id, frontendSettings.id),
		siteName: asString(input.siteName, asString(input.site_name, frontendSettings.siteName)),
		currencyCode: asString(
			input.currencyCode,
			asString(input.currency_code, frontendSettings.currencyCode)
		),
		currencySymbol: asString(
			input.currencySymbol,
			asString(input.currency_symbol, frontendSettings.currencySymbol)
		),
		shippingThreshold: asNumber(
			input.shippingThreshold,
			asNumber(input.shipping_threshold, frontendSettings.shippingThreshold)
		),
		maintenanceMode: asBoolean(
			input.maintenanceMode,
			asBoolean(input.maintenance_mode, frontendSettings.maintenanceMode)
		),
		icon: readMediaUrl(input.icon) || asString(input.icon, frontendSettings.icon),
		storyImage:
			readMediaUrl(input.storyImage) ||
			asString(input.storyImage, asString(input.story_image, frontendSettings.storyImage)),
		aboutHeroImage:
			readMediaUrl(input.aboutHeroImage) ||
			asString(input.aboutHeroImage, asString(input.about_hero_image, frontendSettings.aboutHeroImage)),
		aboutSectionImage:
			readMediaUrl(input.aboutSectionImage) ||
			asString(
				input.aboutSectionImage,
				asString(input.about_section_image, frontendSettings.aboutSectionImage)
			),
		emptyWishlistImage:
			readMediaUrl(input.emptyWishlistImage) ||
			asString(
				input.emptyWishlistImage,
				asString(input.empty_wishlist_image, frontendSettings.emptyWishlistImage)
			)
	};
}

function mapPayloadNavItem(input: UnknownRecord, index: number): NavItem {
	return {
		id: asString(input.id, `payload-nav-${index + 1}`),
		label: asString(input.label, asString(input.title, 'Untitled')),
		url: normalizeNavUrl(asString(input.url, '/')),
		location: asString(input.location, 'header'),
		order: asNumber(input.order, index + 1),
		parent: asString(input.parent, ''),
		isVisible: asBoolean(input.isVisible, asBoolean(input.is_visible, true))
	};
}

function resolvePayloadLinkUrl(link: UnknownRecord | null) {
	if (!link) return '/';
	const direct = asString(link.url);
	if (direct) return normalizeNavUrl(direct);

	const reference = asRecord(link.reference);
	const referenceValue = asRecord(reference?.value);
	const slug = asString(referenceValue?.slug);
	if (!slug) return '/';
	return slug === 'home' ? '/' : normalizeNavUrl(slug);
}

function mapPayloadGlobalNavItem(
	input: UnknownRecord,
	index: number,
	location: 'header' | 'footer'
): NavItem {
	const link = asRecord(input.link) ?? input;
	return {
		id: asString(input.id, `payload-${location}-nav-${index + 1}`),
		label: asString(link?.label, asString(link?.title, 'Untitled')),
		url: resolvePayloadLinkUrl(link),
		location,
		order: asNumber(input.order, index + 1),
		parent: '',
		isVisible: asBoolean(input.isVisible, true)
	};
}

function mapPayloadGlobalNavItems(raw: UnknownRecord | null, location: 'header' | 'footer') {
	const navItems = Array.isArray(raw?.navItems) ? raw.navItems : [];
	return navItems
		.map((item, index) => {
			const record = asRecord(item);
			if (!record) return null;
			return mapPayloadGlobalNavItem(record, index, location);
		})
		.filter((item): item is NavItem => Boolean(item && item.isVisible))
		.sort((a, b) => (a.order || 0) - (b.order || 0));
}

function mapPayloadPage(input: UnknownRecord): Page {
	const meta = asRecord(input.meta);
	const hero = asRecord(input.hero);

	const pageContent =
		asString(input.content) ||
		richTextToHtml(input.content) ||
		richTextToHtml(hero?.richText) ||
		readLayoutRichText(input.layout);

	return {
		id: asString(input.id),
		slug: asString(input.slug),
		title: asString(input.title, 'Untitled'),
		content: pageContent,
		metaDescription: asString(
			input.metaDescription,
			asString(input.meta_description, asString(meta?.description, 'Curated page content.'))
		),
		ogImage: asString(
			input.ogImage,
			asString(input.og_image, readMediaUrl(meta?.image) || CONTENT_IMAGES.OG_DEFAULT)
		),
		heroImage: asString(input.heroImage, asString(input.hero_image, readMediaUrl(hero?.media)))
	};
}

function mapPayloadSection(input: UnknownRecord, index: number): UISection {
	const settings = asRecord(input.settings) ?? {};
	const imageArray = parseUrlArray(input.image);
	const videoArray = parseUrlArray(input.video);

	return {
		id: asString(input.id, `payload-section-${index + 1}`),
		type: asString(input.type, 'rich_text'),
		heading: asString(input.heading),
		subheading: asString(input.subheading),
		content: asString(input.content),
		settings,
		imageUrl: asString(input.imageUrl, asString(input.image_url, imageArray[0] || '')),
		videoUrl: asString(input.videoUrl, asString(input.video_url, videoArray[0] || '')),
		imageGallery: imageArray,
		videoGallery: videoArray,
		sortOrder: asNumber(input.sortOrder, asNumber(input.sort_order, index + 1)),
		isActive: asBoolean(input.isActive, asBoolean(input.is_active, true))
	};
}

function mapPayloadAsset(input: UnknownRecord, index: number): UIAsset {
	return {
		id: asString(input.id, `payload-asset-${index + 1}`),
		key: asString(input.key),
		url: asString(input.url, asString(input.image_url, asString(input.image))),
		altText: asString(input.altText, asString(input.alt_text))
	};
}

function mapPayloadCategory(input: UnknownRecord, index: number): Category {
	const id = asString(input.id, `payload-category-${index + 1}`);
	const title = asString(input.title, asString(input.name, 'Untitled'));
	const image = readMediaUrl(input.image) || asString(input.imageUrl);

	return {
		id,
		title,
		name: asString(input.name, title),
		slug: asString(input.slug, id),
		parent: readRelationshipId(input.parent) || undefined,
		isVisible: asBoolean(input.isVisible, true),
		sortOrder: asNumber(input.sortOrder, asNumber(input.sort_order, index)),
		image: image || undefined
	};
}

function mapPayloadProductVariant(
	input: UnknownRecord,
	productId: string,
	index: number
) {
	return {
		id: asString(input.id, `${productId}-variant-${index + 1}`),
		product: productId,
		color: asString(input.color, 'Default'),
		colorSwatch: asString(input.colorSwatch, asString(input.color_swatch)) || undefined,
		size: asString(input.size, 'O/S'),
		sku: asString(input.sku, `${productId}-SKU-${index + 1}`),
		stockStatus: asString(input.stockStatus, asString(input.stock_status, 'in_stock')) || undefined,
		galleryImages: uniqueStrings(parseUrlArray(input.galleryImages)),
		image: readMediaUrl(input.image) || undefined,
		stockQuantity: asNumber(input.stockQuantity, asNumber(input.stock_quantity, 0))
	};
}

function mapPayloadProduct(
	input: UnknownRecord,
	index: number,
	categoryById: Map<string, Category>
): Product {
	const id = asString(input.id, `payload-product-${index + 1}`);
	const priceValue = asNumber(input.priceValue, asNumber(input.price_value, 0));
	const mappedVariants = Array.isArray(input.variants)
		? input.variants
				.map((variant, variantIndex) => {
					const record = asRecord(variant);
					if (!record) return null;
					return mapPayloadProductVariant(record, id, variantIndex);
				})
				.filter((variant): variant is NonNullable<typeof variant> => Boolean(variant))
		: [];

	const relationCategories = Array.isArray(input.categories) ? input.categories : [];
	const categoryIds: string[] = [];
	const categories: Category[] = [];

	for (const categoryRef of relationCategories) {
		const categoryRecord = asRecord(categoryRef);
		if (categoryRecord) {
			const categoryId = readRelationshipId(categoryRecord) || asString(categoryRecord.id);
			if (categoryId) categoryIds.push(categoryId);

			const mapped =
				categoryById.get(categoryId) ||
				(categoryRecord ? mapPayloadCategory(categoryRecord, categories.length) : null);
			if (mapped) categories.push(mapped);
			continue;
		}

		const rawId = readRelationshipId(categoryRef);
		if (rawId) categoryIds.push(rawId);
		const mapped = categoryById.get(rawId);
		if (mapped) categories.push(mapped);
	}

	const gallery = uniqueStrings(parseUrlArray(input.images));
	const mainImage = readMediaUrl(input.image) || gallery[0] || '';
	const images = uniqueStrings([mainImage, ...gallery]);

	return {
		id,
		title: asString(input.title, 'Untitled'),
		slug: asString(input.slug, id),
		description: asString(input.description),
		priceValue,
		price: asString(input.price, toPriceLabel(priceValue)),
		image: mainImage,
		images,
		variants: mappedVariants,
		categories,
		categoryIds: uniqueStrings(categoryIds),
		attributes: asRecord(input.attributes) ?? {},
		isFeature: asBoolean(input.isFeature, asBoolean(input.is_feature, false)),
		hasVariants: asBoolean(input.hasVariants, mappedVariants.length > 0),
		stockStatus: asString(input.stockStatus, asString(input.stock_status, 'in_stock')),
		gender: asString(input.gender, 'unisex'),
		stripePriceId: asString(input.stripePriceId, asString(input.stripe_price_id)) || undefined,
		tag: asString(input.tag) || undefined
	};
}

function mapPayloadCollectionPanel(input: UnknownRecord, index: number): CollectionImageRecord {
	return {
		id: asString(input.id, `collection-panel-${index + 1}`),
		position: asString(input.position, index === 0 ? 'left' : 'right'),
		image: readMediaUrl(input.image) || asString(input.imageUrl, asString(input.image_url)),
		link: asString(input.link, '/shop'),
		title: asString(input.title),
		order: asNumber(input.order, index + 1),
		isActive: asBoolean(input.isActive, asBoolean(input.is_active, true))
	};
}

async function getPayloadPageBySlug(fetcher: FetchLike, slug: string): Promise<Page | null> {
	const config = getConfig();
	const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.pagesCollection, {
		'where[slug][equals]': slug,
		limit: '1'
	});
	const first = docs[0];
	if (!first) return null;
	return mapPayloadPage(first);
}

export async function getSiteLayoutData(fetcher: FetchLike) {
	if (!canUsePayload()) {
		return {
			settings: frontendSettings,
			headerNav: frontendHeaderNav,
			footerNav: frontendFooterNav
		};
	}

	const config = getConfig();
	let settings = frontendSettings;
	try {
		const settingsRaw = await fetchPayloadGlobal<UnknownRecord>(fetcher, config.settingsGlobal);
		settings = mapPayloadSettings(asRecord(settingsRaw));
	} catch (error) {
		warnPayloadFallback('layout:settings', error);
	}

	try {
		const navRaw = await fetchPayloadCollection<UnknownRecord>(fetcher, config.navigationCollection, {
			limit: '200',
			sort: 'order'
		});
		const navItems = navRaw.map(mapPayloadNavItem).filter((item) => item.isVisible);
		const headerNav = navItems
			.filter((item) => (item.location || 'header') === 'header')
			.sort((a, b) => (a.order || 0) - (b.order || 0));
		const footerNav = navItems
			.filter((item) => (item.location || 'header') === 'footer')
			.sort((a, b) => (a.order || 0) - (b.order || 0));

		return {
			settings,
			headerNav: headerNav.length ? headerNav : frontendHeaderNav,
			footerNav: footerNav.length ? footerNav : frontendFooterNav
		};
	} catch (error) {
		warnPayloadFallback('layout:navigation-collection', error);
	}

	try {
		const [headerRaw, footerRaw] = await Promise.all([
			fetchPayloadGlobal<UnknownRecord>(fetcher, 'header'),
			fetchPayloadGlobal<UnknownRecord>(fetcher, 'footer')
		]);

		const headerNav = mapPayloadGlobalNavItems(asRecord(headerRaw), 'header');
		const footerNav = mapPayloadGlobalNavItems(asRecord(footerRaw), 'footer');

		return {
			settings,
			headerNav: headerNav.length ? headerNav : frontendHeaderNav,
			footerNav: footerNav.length ? footerNav : frontendFooterNav
		};
	} catch (error) {
		warnPayloadFallback('layout:header-footer-globals', error);
	}

	return {
		settings,
		headerNav: frontendHeaderNav,
		footerNav: frontendFooterNav
	};
}

export async function getSiteSettings(fetcher: FetchLike) {
	if (!canUsePayload()) return frontendSettings;

	const config = getConfig();
	try {
		const settingsRaw = await fetchPayloadGlobal<UnknownRecord>(fetcher, config.settingsGlobal);
		return mapPayloadSettings(asRecord(settingsRaw));
	} catch (error) {
		warnPayloadFallback('settings', error);
		return frontendSettings;
	}
}

type ContentFallbackOptions = {
	fallback?: boolean;
};

export async function getPageBySlugFromCms(
	fetcher: FetchLike,
	slug: string,
	options?: ContentFallbackOptions
) {
	const fallback = options?.fallback !== false;
	if (!canUsePayload()) return fallback ? (frontendPages[slug] ?? null) : null;

	try {
		const page = await getPayloadPageBySlug(fetcher, slug);
		return page ?? (fallback ? (frontendPages[slug] ?? null) : null);
	} catch (error) {
		warnPayloadFallback(`page:${slug}`, error);
		return fallback ? (frontendPages[slug] ?? null) : null;
	}
}

export async function getSectionsBySlugFromCms(
	fetcher: FetchLike,
	slug: string,
	options?: ContentFallbackOptions
) {
	const fallback = options?.fallback !== false;
	if (!canUsePayload()) return fallback ? (frontendSections[slug] ?? []) : [];

	const config = getConfig();
	try {
		const page = await getPayloadPageBySlug(fetcher, slug);
		if (!page?.id) return fallback ? (frontendSections[slug] ?? []) : [];

		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.sectionsCollection, {
			'where[page][equals]': page.id,
			limit: '200',
			sort: 'sort_order'
		});
		const mapped = docs
			.map(mapPayloadSection)
			.filter((section) => section.isActive !== false)
			.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		return mapped.length ? mapped : fallback ? (frontendSections[slug] ?? []) : [];
	} catch (error) {
		warnPayloadFallback(`sections:${slug}`, error);
		return fallback ? (frontendSections[slug] ?? []) : [];
	}
}

export async function getPageWithSectionsFromCms(
	fetcher: FetchLike,
	slug: string,
	fallbackSlug: string
) {
	if (slug === fallbackSlug) {
		const [page, sections] = await Promise.all([
			getPageBySlugFromCms(fetcher, slug),
			getSectionsBySlugFromCms(fetcher, slug)
		]);

		return { page, sections };
	}

	const [pageBySlug, sectionsBySlug, fallbackPage, fallbackSections] = await Promise.all([
		getPageBySlugFromCms(fetcher, slug),
		getSectionsBySlugFromCms(fetcher, slug),
		getPageBySlugFromCms(fetcher, fallbackSlug),
		getSectionsBySlugFromCms(fetcher, fallbackSlug)
	]);

	return {
		page: pageBySlug || fallbackPage,
		sections: sectionsBySlug.length ? sectionsBySlug : fallbackSections
	};
}

export async function getHomeAssetsFromCms(fetcher: FetchLike) {
	if (!canUsePayload()) return frontendHomeAssets;

	const config = getConfig();
	try {
		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.assetsCollection, {
			limit: '100'
		});
		const mapped = docs.map(mapPayloadAsset).filter((item) => item.url);
		return mapped.length ? mapped : frontendHomeAssets;
	} catch (error) {
		warnPayloadFallback('assets', error);
		return frontendHomeAssets;
	}
}

export async function getCategoriesFromCms(fetcher: FetchLike) {
	if (!canUsePayload()) return frontendCategories;

	const config = getConfig();
	try {
		const [docs, productProbe] = await Promise.all([
			fetchPayloadCollection<UnknownRecord>(fetcher, config.categoryCollection, {
				limit: '500',
				sort: 'sortOrder'
			}),
			fetchPayloadCollection<UnknownRecord>(fetcher, config.productCollection, {
				limit: '1'
			})
		]);
		if (productProbe.length === 0) {
			return frontendCategories;
		}

		const mapped = docs
			.map(mapPayloadCategory)
			.filter((category) => category.isVisible !== false)
			.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		return mapped.length ? mapped : frontendCategories;
	} catch (error) {
		warnPayloadFallback('categories', error);
		return frontendCategories;
	}
}

export async function getProductsFromCms(fetcher: FetchLike, options?: ProductQueryOptions) {
	if (!canUsePayload()) return getMockProducts(options);

	const config = getConfig();
	try {
		const [categories, docs] = await Promise.all([
			getCategoriesFromCms(fetcher),
			fetchPayloadCollection<UnknownRecord>(fetcher, config.productCollection, {
				limit: '1000',
				depth: '1'
			})
		]);
		const categoryById = new Map(categories.map((category) => [category.id, category]));
		const mapped = docs
			.map((doc, index) => mapPayloadProduct(doc, index, categoryById))
			.filter((product) => product.id && product.slug);

		if (!mapped.length) return getMockProducts(options);
		return filterProductsByOptions(mapped, options, categoryById);
	} catch (error) {
		warnPayloadFallback('products', error);
		return getMockProducts(options);
	}
}

export async function getProductByIdOrSlugFromCms(fetcher: FetchLike, idOrSlug: string) {
	if (!canUsePayload()) return getMockProductByIdOrSlug(idOrSlug);

	try {
		const products = await getProductsFromCms(fetcher);
		return (
			products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ??
			getMockProductByIdOrSlug(idOrSlug)
		);
	} catch (error) {
		warnPayloadFallback(`product:${idOrSlug}`, error);
		return getMockProductByIdOrSlug(idOrSlug);
	}
}

export async function getRelatedProductsFromCms(fetcher: FetchLike, idOrSlug: string, limit = 4) {
	if (!canUsePayload()) return getMockRelatedProducts(idOrSlug, limit);

	try {
		const [products, current] = await Promise.all([
			getProductsFromCms(fetcher),
			getProductByIdOrSlugFromCms(fetcher, idOrSlug)
		]);
		if (!current) return products.slice(0, limit);

		const related = products.filter(
			(product) =>
				product.id !== current.id &&
				(product.gender === current.gender ||
					(product.categoryIds ?? []).some((id) => (current.categoryIds ?? []).includes(id)))
		);

		const fallback = products.filter((product) => product.id !== current.id);
		return (related.length > 0 ? related : fallback).slice(0, limit);
	} catch (error) {
		warnPayloadFallback(`related-products:${idOrSlug}`, error);
		return getMockRelatedProducts(idOrSlug, limit);
	}
}

export async function getCollectionPanelsFromCms(fetcher: FetchLike) {
	if (!canUsePayload()) return frontendCollectionImages;

	const config = getConfig();
	try {
		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.collectionPanelCollection, {
			limit: '10',
			sort: 'order'
		});
		const mapped = docs
			.map(mapPayloadCollectionPanel)
			.filter((panel) => panel.isActive !== false && panel.image)
			.sort((a, b) => (a.order || 0) - (b.order || 0));
		return mapped.length ? mapped : frontendCollectionImages;
	} catch (error) {
		warnPayloadFallback('collection-panels', error);
		return frontendCollectionImages;
	}
}

export async function getNavCategorySlugsFromCms(fetcher: FetchLike) {
	if (!canUsePayload()) {
		return [
			...new Set(
				frontendHeaderNav
					.map((item) => item.url.match(/(?:category|gender)=([^&]+)/)?.[1])
					.filter((value): value is string => Boolean(value))
			)
		];
	}

	const { headerNav } = await getSiteLayoutData(fetcher);
	return [
		...new Set(
			headerNav
				.map((item) => item.url.match(/(?:category|gender)=([^&]+)/)?.[1])
				.filter((value): value is string => Boolean(value))
		)
	];
}
