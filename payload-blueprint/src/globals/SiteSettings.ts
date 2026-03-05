import type { GlobalConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const SiteSettings: GlobalConfig = {
	slug: 'site-settings',
	access: {
		read: () => true,
		update: isEditorOrAdmin
	},
	fields: [
		{
			name: 'siteName',
			type: 'text',
			required: true,
			defaultValue: 'PandaShop'
		},
		{
			name: 'currencyCode',
			type: 'text',
			required: true,
			defaultValue: 'USD'
		},
		{
			name: 'currencySymbol',
			type: 'text',
			required: true,
			defaultValue: '$'
		},
		{
			name: 'shippingThreshold',
			type: 'number',
			required: true,
			defaultValue: 100
		},
		{
			name: 'maintenanceMode',
			type: 'checkbox',
			defaultValue: false
		},
		{
			name: 'icon',
			type: 'text',
			label: 'Site Icon URL'
		},
		{
			name: 'storyImage',
			type: 'text'
		},
		{
			name: 'aboutHeroImage',
			type: 'text'
		},
		{
			name: 'aboutSectionImage',
			type: 'text'
		},
		{
			name: 'emptyWishlistImage',
			type: 'text'
		}
	]
};
