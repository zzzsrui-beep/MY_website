import { env } from '$env/dynamic/public';
import { CONTENT_IMAGES } from '$lib/constants';
import {
	frontendFooterNav,
	frontendHeaderNav,
	frontendHomeAssets,
	frontendPages,
	frontendSections,
	frontendSettings
} from '$lib/mock';
import type { GlobalSettings, NavItem, Page, UIAsset, UISection } from '$lib/types';
import { fetchPayloadCollection, fetchPayloadGlobal, isPayloadConfigured } from './payload-client';
import { isPayloadProvider } from './provider';

type FetchLike = typeof fetch;
type UnknownRecord = Record<string, unknown>;

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

function getConfig() {
	return {
		settingsGlobal: env.PUBLIC_PAYLOAD_SETTINGS_GLOBAL || 'site-settings',
		navigationCollection: env.PUBLIC_PAYLOAD_NAV_COLLECTION || 'navigation',
		pagesCollection: env.PUBLIC_PAYLOAD_PAGE_COLLECTION || 'pages',
		sectionsCollection: env.PUBLIC_PAYLOAD_SECTION_COLLECTION || 'ui-sections',
		assetsCollection: env.PUBLIC_PAYLOAD_ASSET_COLLECTION || 'ui-assets'
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
		icon: asString(input.icon, frontendSettings.icon),
		storyImage: asString(input.storyImage, asString(input.story_image, frontendSettings.storyImage)),
		aboutHeroImage: asString(
			input.aboutHeroImage,
			asString(input.about_hero_image, frontendSettings.aboutHeroImage)
		),
		aboutSectionImage: asString(
			input.aboutSectionImage,
			asString(input.about_section_image, frontendSettings.aboutSectionImage)
		),
		emptyWishlistImage: asString(
			input.emptyWishlistImage,
			asString(input.empty_wishlist_image, frontendSettings.emptyWishlistImage)
		)
	};
}

function mapPayloadNavItem(input: UnknownRecord, index: number): NavItem {
	return {
		id: asString(input.id, `payload-nav-${index + 1}`),
		label: asString(input.label, asString(input.title, 'Untitled')),
		url: asString(input.url, '/'),
		location: asString(input.location, 'header'),
		order: asNumber(input.order, index + 1),
		parent: asString(input.parent, ''),
		isVisible: asBoolean(input.isVisible, asBoolean(input.is_visible, true))
	};
}

function mapPayloadPage(input: UnknownRecord): Page {
	return {
		id: asString(input.id),
		slug: asString(input.slug),
		title: asString(input.title, 'Untitled'),
		content: asString(input.content, ''),
		metaDescription: asString(
			input.metaDescription,
			asString(input.meta_description, 'Curated page content.')
		),
		ogImage: asString(input.ogImage, asString(input.og_image, CONTENT_IMAGES.OG_DEFAULT)),
		heroImage: asString(input.heroImage, asString(input.hero_image, ''))
	};
}

function mapPayloadSection(input: UnknownRecord, index: number): UISection {
	const settings = asRecord(input.settings) ?? {};
	const imageArray = Array.isArray(input.image) ? input.image.filter((value): value is string => typeof value === 'string') : [];
	const videoArray = Array.isArray(input.video) ? input.video.filter((value): value is string => typeof value === 'string') : [];

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
	try {
		const [settingsRaw, navRaw] = await Promise.all([
			fetchPayloadGlobal<UnknownRecord>(fetcher, config.settingsGlobal),
			fetchPayloadCollection<UnknownRecord>(fetcher, config.navigationCollection, {
				limit: '200',
				sort: 'order'
			})
		]);

		const settings = mapPayloadSettings(asRecord(settingsRaw));
		const navItems = navRaw.map(mapPayloadNavItem).filter((item) => item.isVisible);

		const headerNav =
			navItems
				.filter((item) => (item.location || 'header') === 'header')
				.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
		const footerNav =
			navItems
				.filter((item) => (item.location || 'header') === 'footer')
				.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

		return {
			settings,
			headerNav: headerNav.length ? headerNav : frontendHeaderNav,
			footerNav: footerNav.length ? footerNav : frontendFooterNav
		};
	} catch (error) {
		warnPayloadFallback('layout', error);
		return {
			settings: frontendSettings,
			headerNav: frontendHeaderNav,
			footerNav: frontendFooterNav
		};
	}
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

export async function getPageBySlugFromCms(fetcher: FetchLike, slug: string) {
	if (!canUsePayload()) return frontendPages[slug] ?? null;

	try {
		return (await getPayloadPageBySlug(fetcher, slug)) ?? (frontendPages[slug] ?? null);
	} catch (error) {
		warnPayloadFallback(`page:${slug}`, error);
		return frontendPages[slug] ?? null;
	}
}

export async function getSectionsBySlugFromCms(fetcher: FetchLike, slug: string) {
	if (!canUsePayload()) return frontendSections[slug] ?? [];

	const config = getConfig();
	try {
		const page = await getPayloadPageBySlug(fetcher, slug);
		if (!page?.id) return frontendSections[slug] ?? [];

		const docs = await fetchPayloadCollection<UnknownRecord>(fetcher, config.sectionsCollection, {
			'where[page][equals]': page.id,
			limit: '200',
			sort: 'sort_order'
		});
		const mapped = docs
			.map(mapPayloadSection)
			.filter((section) => section.isActive !== false)
			.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		return mapped.length ? mapped : frontendSections[slug] ?? [];
	} catch (error) {
		warnPayloadFallback(`sections:${slug}`, error);
		return frontendSections[slug] ?? [];
	}
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
