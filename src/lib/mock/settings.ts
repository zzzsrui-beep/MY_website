import { CONTENT_IMAGES, DEFAULTS } from '$lib/constants';
import type { GlobalSettings } from '$lib/types';

const now = new Date().toISOString();

export const frontendSettings: GlobalSettings = {
	id: 'settings-frontend',
	created: now,
	updated: now,
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
