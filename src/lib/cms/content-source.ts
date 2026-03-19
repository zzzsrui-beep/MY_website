import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
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
import { getCurrentLanguage, type LanguageCode } from '$lib/stores/i18n.svelte';
import type { Category, GlobalSettings, NavItem, Page, Product, UIAsset, UISection } from '$lib/types';
import { resolveAssetUrl } from '$lib/utils/image';
import {
	fetchPayloadCollection,
	fetchPayloadCollectionPage,
	fetchPayloadGlobal,
	isPayloadConfigured
} from './payload-client';
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

type LocaleOptions = {
	locale?: LanguageCode;
};

type ProductQueryOptions = LocaleOptions & {
	categorySlug?: string | null;
	gender?: string | null;
	isFeatured?: boolean;
};

type ProductPageOptions = ProductQueryOptions & {
	page?: number;
	limit?: number;
};

export type ProductPageResult = {
	products: Product[];
	page: number;
	limit: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	totalPages: number;
	totalDocs: number;
};

const warnedContexts = new Set<string>();
const SUPPORTED_LOCALES: LanguageCode[] = ['en', 'ja', 'zh'];
const DEFAULT_LOCALE: LanguageCode = 'en';

function warnPayloadFallback(context: string, error: unknown) {
	if (warnedContexts.has(context)) return;
	warnedContexts.add(context);
	console.warn(`[cms] payload fallback for ${context}`, error);
}

function normalizeLocale(value: unknown): LanguageCode {
	if (typeof value === 'string' && SUPPORTED_LOCALES.includes(value as LanguageCode)) {
		return value as LanguageCode;
	}
	return DEFAULT_LOCALE;
}

function resolveLocale(explicitLocale?: LanguageCode): LanguageCode {
	if (explicitLocale) return normalizeLocale(explicitLocale);
	if (browser) return normalizeLocale(getCurrentLanguage());
	return DEFAULT_LOCALE;
}

function toSnakeCaseField(value: string) {
	return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function getLocaleFieldSuffix(locale: LanguageCode) {
	if (locale === 'ja') return 'Ja';
	if (locale === 'zh') return 'Zh';
	return '';
}

function readLocalizedText(
	input: UnknownRecord,
	baseField: string,
	locale: LanguageCode,
	fallback = ''
) {
	const localeSuffix = getLocaleFieldSuffix(locale);
	if (localeSuffix) {
		const camel = `${baseField}${localeSuffix}`;
		const snake = `${toSnakeCaseField(baseField)}_${localeSuffix.toLowerCase()}`;
		const translated = asString(input[camel], asString(input[snake]));
		if (translated.trim()) return translated;
	}

	const baseSnake = toSnakeCaseField(baseField);
	return asString(input[baseField], asString(input[baseSnake], fallback));
}

function withLocaleQuery(
	query: Record<string, string | undefined> | undefined,
	locale?: LanguageCode
): Record<string, string | undefined> {
	return {
		...(query || {}),
		locale: resolveLocale(locale)
	};
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
			const url = readMediaUrl(item);
			if (url) output.push(url);
			continue;
		}

		const record = asRecord(item);
		if (!record) continue;
		const mediaUrl = readMediaUrl(record);
		if (mediaUrl) {
			output.push(mediaUrl);
			continue;
		}
		const url = asString(record.url, asString(record.image, asString(record.value)));
		if (url) output.push(url);
	}
	return output;
}

function uniqueStrings(values: string[]) {
	return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function normalizeApiBasePath(value?: string) {
	const trimmed = value?.trim();
	if (!trimmed) return '/api';
	const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
	return withLeadingSlash.replace(/\/$/, '');
}

function buildMediaPathFromFilename(filename: string) {
	const clean = filename.trim().replace(/^\/+/, '');
	if (!clean) return '';
	return `${normalizeApiBasePath(env.PUBLIC_PAYLOAD_API_BASE_PATH)}/media/file/${clean}`;
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
	if (typeof value === 'string') {
		const raw = value.trim();
		if (!raw) return '';
		if (!raw.includes('/') && !/^https?:\/\//i.test(raw)) {
			if (!/\.[a-z0-9]{2,5}$/i.test(raw)) {
				return '';
			}
			return resolveAssetUrl(buildMediaPathFromFilename(raw));
		}
		return resolveAssetUrl(raw);
	}
	const record = asRecord(value);
	if (!record) return '';
	const direct =
		asString(record.url, asString(record.image, asString(record.thumbnailURL))) ||
		buildMediaPathFromFilename(asString(record.filename));
	return direct ? resolveAssetUrl(direct) : '';
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

function toPositiveInt(value: unknown, fallback: number) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(1, Math.floor(parsed));
}

function paginateProducts(products: Product[], page: number, limit: number): ProductPageResult {
	const safePage = toPositiveInt(page, 1);
	const safeLimit = toPositiveInt(limit, 12);
	const totalDocs = products.length;
	const totalPages = Math.max(1, Math.ceil(totalDocs / safeLimit));
	const start = (safePage - 1) * safeLimit;
	const paged = products.slice(start, start + safeLimit);

	return {
		products: paged,
		page: safePage,
		limit: safeLimit,
		hasNextPage: safePage < totalPages,
		hasPrevPage: safePage > 1,
		totalPages,
		totalDocs
	};
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

	const rawOgImage = asString(
		input.ogImage,
		asString(input.og_image, readMediaUrl(meta?.image) || CONTENT_IMAGES.OG_DEFAULT)
	);
	const rawHeroImage = asString(input.heroImage, asString(input.hero_image, readMediaUrl(hero?.media)));

	return {
		id: asString(input.id),
		slug: asString(input.slug),
		title: asString(input.title, 'Untitled'),
		content: pageContent,
		metaDescription: asString(
			input.metaDescription,
			asString(input.meta_description, asString(meta?.description, 'Curated page content.'))
		),
		ogImage: rawOgImage ? resolveAssetUrl(rawOgImage) : '',
		heroImage: rawHeroImage ? resolveAssetUrl(rawHeroImage) : ''
	};
}

function mapPayloadSection(input: UnknownRecord, index: number): UISection {
	const settings = asRecord(input.settings) ?? {};
	const imageArray = parseUrlArray(input.image);
	const videoArray = parseUrlArray(input.video);
	const singleImage = readMediaUrl(input.image);
	const singleVideo = readMediaUrl(input.video);
	const normalizedImageGallery = imageArray.length ? imageArray : singleImage ? [singleImage] : [];
	const normalizedVideoGallery = videoArray.length ? videoArray : singleVideo ? [singleVideo] : [];
	const imageUrl = asString(
		input.imageUrl,
		asString(input.image_url, normalizedImageGallery[0] || singleImage || '')
	);
	const videoUrl = asString(
		input.videoUrl,
		asString(input.video_url, normalizedVideoGallery[0] || singleVideo || '')
	);

	return {
		id: asString(input.id, `payload-section-${index + 1}`),
		type: asString(input.type, 'rich_text'),
		heading: asString(input.heading),
		subheading: asString(input.subheading),
		content: asString(input.content),
		settings,
		imageUrl: imageUrl ? resolveAssetUrl(imageUrl) : '',
		videoUrl: videoUrl ? resolveAssetUrl(videoUrl) : '',
		imageGallery: normalizedImageGallery,
		videoGallery: normalizedVideoGallery,
		sortOrder: asNumber(input.sortOrder, asNumber(input.sort_order, index + 1)),
		isActive: asBoolean(input.isActive, asBoolean(input.is_active, true))
	};
}

function mapPayloadAsset(input: UnknownRecord, index: number): UIAsset {
	const rawUrl = asString(input.url, asString(input.image_url, asString(input.image)));
	return {
		id: asString(input.id, `payload-asset-${index + 1}`),
		key: asString(input.key),
		url: rawUrl ? resolveAssetUrl(rawUrl) : '',
		altText: asString(input.altText, asString(input.alt_text))
	};
}

function mapPayloadCategory(input: UnknownRecord, index: number, locale: LanguageCode): Category {
	const id = asString(input.id, `payload-category-${index + 1}`);
	const title = readLocalizedText(input, 'title', locale, asString(input.name, 'Untitled'));
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
	categoryById: Map<string, Category>,
	locale: LanguageCode
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
				(categoryRecord ? mapPayloadCategory(categoryRecord, categories.length, locale) : null);
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
		title: readLocalizedText(input, 'title', locale, 'Untitled'),
		slug: asString(input.slug, id),
		description: readLocalizedText(input, 'description', locale),
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
		tag: readLocalizedText(input, 'tag', locale) || undefined
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

async function getPayloadPageBySlug(
	fetcher: FetchLike,
	slug: string,
	locale?: LanguageCode
): Promise<Page | null> {
	const config = getConfig();
	const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.pagesCollection, withLocaleQuery({
		'where[slug][equals]': slug,
		limit: '1',
		depth: '1'
	}, locale));
	const first = docs[0];
	if (!first) return null;
	return mapPayloadPage(first);
}

export async function getSiteLayoutData(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) {
		return {
			settings: frontendSettings,
			headerNav: frontendHeaderNav,
			footerNav: frontendFooterNav
		};
	}

	const config = getConfig();
	const locale = resolveLocale(options?.locale);
	let settings = frontendSettings;
	try {
		const settingsRaw = await fetchPayloadGlobal<UnknownRecord>(
			fetcher,
			config.settingsGlobal,
			withLocaleQuery({ depth: '1' }, locale)
		);
		settings = mapPayloadSettings(asRecord(settingsRaw));
	} catch (error) {
		warnPayloadFallback('layout:settings', error);
	}

	try {
		const navRaw = await fetchPayloadCollection<UnknownRecord>(fetcher, config.navigationCollection, withLocaleQuery({
			limit: '200',
			sort: 'order'
		}, locale));
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
			fetchPayloadGlobal<UnknownRecord>(fetcher, 'header', withLocaleQuery({ depth: '2' }, locale)),
			fetchPayloadGlobal<UnknownRecord>(fetcher, 'footer', withLocaleQuery({ depth: '2' }, locale))
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

export async function getSiteSettings(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) return frontendSettings;

	const config = getConfig();
	try {
		const settingsRaw = await fetchPayloadGlobal<UnknownRecord>(
			fetcher,
			config.settingsGlobal,
			withLocaleQuery({ depth: '1' }, options?.locale)
		);
		return mapPayloadSettings(asRecord(settingsRaw));
	} catch (error) {
		warnPayloadFallback('settings', error);
		return frontendSettings;
	}
}

type ContentFallbackOptions = LocaleOptions & {
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
		const page = await getPayloadPageBySlug(fetcher, slug, options?.locale);
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
		const locale = resolveLocale(options?.locale);
		const page = await getPayloadPageBySlug(fetcher, slug, locale);
		if (!page?.id) return fallback ? (frontendSections[slug] ?? []) : [];

		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.sectionsCollection, withLocaleQuery({
			'where[page][equals]': page.id,
			limit: '200',
			sort: 'sort_order',
			depth: '1'
		}, locale));
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
	fallbackSlug: string,
	options?: LocaleOptions
) {
	if (slug === fallbackSlug) {
		const [page, sections] = await Promise.all([
			getPageBySlugFromCms(fetcher, slug, options),
			getSectionsBySlugFromCms(fetcher, slug, options)
		]);

		return { page, sections };
	}

	const [pageBySlug, sectionsBySlug, fallbackPage, fallbackSections] = await Promise.all([
		getPageBySlugFromCms(fetcher, slug, options),
		getSectionsBySlugFromCms(fetcher, slug, options),
		getPageBySlugFromCms(fetcher, fallbackSlug, options),
		getSectionsBySlugFromCms(fetcher, fallbackSlug, options)
	]);

	return {
		page: pageBySlug || fallbackPage,
		sections: sectionsBySlug.length ? sectionsBySlug : fallbackSections
	};
}

export async function getHomeAssetsFromCms(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) return frontendHomeAssets;

	const config = getConfig();
	try {
		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.assetsCollection, withLocaleQuery({
			limit: '100'
		}, options?.locale));
		const mapped = docs.map(mapPayloadAsset).filter((item) => item.url);
		return mapped.length ? mapped : frontendHomeAssets;
	} catch (error) {
		warnPayloadFallback('assets', error);
		return frontendHomeAssets;
	}
}

export async function getCategoriesFromCms(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) return frontendCategories;

	const config = getConfig();
	try {
		const locale = resolveLocale(options?.locale);
		const docs = await fetchPayloadCollection<UnknownRecord>(
			fetcher,
			config.categoryCollection,
			withLocaleQuery(
				{
					limit: '500',
					depth: '1'
				},
				locale
			)
		);

		const mapped = docs
			.map((doc, index) => mapPayloadCategory(doc, index, locale))
			.filter((category) => category.isVisible !== false)
			.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		return mapped.length ? mapped : frontendCategories;
	} catch (error) {
		warnPayloadFallback('categories', error);
		return frontendCategories;
	}
}

export async function getProductsPageFromCms(fetcher: FetchLike, options?: ProductPageOptions) {
	const page = toPositiveInt(options?.page, 1);
	const limit = toPositiveInt(options?.limit, 12);

	if (!canUsePayload()) {
		return paginateProducts(getMockProducts(options), page, limit);
	}

	const config = getConfig();
	try {
		const locale = resolveLocale(options?.locale);
		const categories = options?.categorySlug ? await getCategoriesFromCms(fetcher, { locale }) : [];
		const categoryById = new Map(categories.map((category) => [category.id, category]));

		const query: Record<string, string | undefined> = {
			limit: String(limit),
			page: String(page),
			depth: '1'
		};

		if (options?.gender) {
			query['where[gender][equals]'] = options.gender;
		}

		if (options?.isFeatured) {
			query['where[isFeature][equals]'] = 'true';
		}

		if (options?.categorySlug) {
			const targetCategory = categories.find((category) => category.slug === options.categorySlug);
			if (!targetCategory) {
				return paginateProducts([], page, limit);
			}
			query['where[categories][in]'] = targetCategory.id;
		}

		const result = await fetchPayloadCollectionPage<UnknownRecord>(
			fetcher,
			config.productCollection,
			withLocaleQuery(query, locale)
		);
		const mapped = result.docs
			.map((doc, index) => mapPayloadProduct(doc, index, categoryById, locale))
			.filter((product) => product.id && product.slug);
		const filtered = filterProductsByOptions(mapped, options, categoryById);

		return {
			products: filtered,
			page: result.page,
			limit: result.limit,
			hasNextPage: result.hasNextPage,
			hasPrevPage: result.hasPrevPage,
			totalPages: result.totalPages,
			totalDocs: result.totalDocs
		};
	} catch (error) {
		warnPayloadFallback('products:page', error);
		return paginateProducts(getMockProducts(options), page, limit);
	}
}

export async function getProductsFromCms(fetcher: FetchLike, options?: ProductQueryOptions) {
	if (!canUsePayload()) return getMockProducts(options);

	const config = getConfig();
	try {
		const locale = resolveLocale(options?.locale);
		const categoriesPromise = options?.categorySlug
			? getCategoriesFromCms(fetcher, { locale })
			: Promise.resolve<Category[]>([]);
		const [categories, docs] = await Promise.all([
			categoriesPromise,
			fetchPayloadCollection<UnknownRecord>(
				fetcher,
				config.productCollection,
				withLocaleQuery(
					{
						limit: '1000',
						depth: '1'
					},
					locale
				)
			)
		]);
		const categoryById = new Map(categories.map((category) => [category.id, category]));
		const mapped = docs
			.map((doc, index) => mapPayloadProduct(doc, index, categoryById, locale))
			.filter((product) => product.id && product.slug);

		if (!mapped.length) return getMockProducts(options);
		return filterProductsByOptions(mapped, options, categoryById);
	} catch (error) {
		warnPayloadFallback('products', error);
		return getMockProducts(options);
	}
}

export async function getProductByIdOrSlugFromCms(
	fetcher: FetchLike,
	idOrSlug: string,
	options?: LocaleOptions
) {
	if (!canUsePayload()) return getMockProductByIdOrSlug(idOrSlug);

	try {
		const products = await getProductsFromCms(fetcher, options);
		return (
			products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ??
			getMockProductByIdOrSlug(idOrSlug)
		);
	} catch (error) {
		warnPayloadFallback(`product:${idOrSlug}`, error);
		return getMockProductByIdOrSlug(idOrSlug);
	}
}

export async function getRelatedProductsFromCms(
	fetcher: FetchLike,
	idOrSlug: string,
	limit = 4,
	options?: LocaleOptions
) {
	if (!canUsePayload()) return getMockRelatedProducts(idOrSlug, limit);

	try {
		const [products, current] = await Promise.all([
			getProductsFromCms(fetcher, options),
			getProductByIdOrSlugFromCms(fetcher, idOrSlug, options)
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

export async function getCollectionPanelsFromCms(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) return frontendCollectionImages;

	const config = getConfig();
	try {
		const docs = await fetchPayloadCollection<UnknownRecord>(
			fetcher,
			config.collectionPanelCollection,
			withLocaleQuery({
				limit: '10',
				sort: 'order',
				depth: '1'
			}, options?.locale)
		);
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

export async function getNavCategorySlugsFromCms(fetcher: FetchLike, options?: LocaleOptions) {
	if (!canUsePayload()) {
		return [
			...new Set(
				frontendHeaderNav
					.map((item) => item.url.match(/(?:category|gender)=([^&]+)/)?.[1])
					.filter((value): value is string => Boolean(value))
			)
		];
	}

	const { headerNav } = await getSiteLayoutData(fetcher, options);
	return [
		...new Set(
			headerNav
				.map((item) => item.url.match(/(?:category|gender)=([^&]+)/)?.[1])
				.filter((value): value is string => Boolean(value))
		)
	];
}
