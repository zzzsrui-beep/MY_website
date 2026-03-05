import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const UISections: CollectionConfig = {
	slug: 'ui-sections',
	admin: {
		useAsTitle: 'heading',
		defaultColumns: ['type', 'heading', 'page', 'sortOrder', 'isActive']
	},
	access: {
		read: () => true,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	fields: [
		{
			name: 'page',
			type: 'relationship',
			relationTo: 'pages',
			required: true,
			index: true
		},
		{
			name: 'type',
			type: 'select',
			required: true,
			options: [
				{ label: 'Hero', value: 'hero' },
				{ label: 'Feature Split', value: 'feature_split' },
				{ label: 'Product Grid', value: 'product_grid' },
				{ label: 'Category Grid', value: 'category_grid' },
				{ label: 'Rich Text', value: 'rich_text' },
				{ label: 'CTA Banner', value: 'cta_banner' }
			]
		},
		{
			name: 'heading',
			type: 'text'
		},
		{
			name: 'subheading',
			type: 'text'
		},
		{
			name: 'content',
			type: 'textarea'
		},
		{
			name: 'settings',
			type: 'group',
			fields: [
				{
					name: 'actions',
					type: 'array',
					fields: [
						{ name: 'text', type: 'text', required: true },
						{ name: 'link', type: 'text', required: true },
						{
							name: 'style',
							type: 'select',
							options: [
								{ label: 'Primary', value: 'primary' },
								{ label: 'Outline', value: 'outline' },
								{ label: 'Text', value: 'text' }
							]
						}
					]
				},
				{
					name: 'external',
					type: 'group',
					fields: [
						{ name: 'image_url', type: 'text' },
						{ name: 'video_url', type: 'text' }
					]
				}
			]
		},
		{
			name: 'imageUrl',
			type: 'text'
		},
		{
			name: 'videoUrl',
			type: 'text'
		},
		{
			name: 'image',
			type: 'json',
			label: 'Image gallery (string array)',
			admin: {
				description: 'Use an array of image URLs, e.g. ["https://...","https://..."]'
			}
		},
		{
			name: 'video',
			type: 'json',
			label: 'Video gallery (string array)',
			admin: {
				description: 'Use an array of video URLs, e.g. ["https://...","https://..."]'
			}
		},
		{
			name: 'sortOrder',
			type: 'number',
			defaultValue: 0
		},
		{
			name: 'isActive',
			type: 'checkbox',
			defaultValue: true
		},
		{
			name: 'scheduleStart',
			type: 'date'
		},
		{
			name: 'scheduleEnd',
			type: 'date'
		}
	]
};
