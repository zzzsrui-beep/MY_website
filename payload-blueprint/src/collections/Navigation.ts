import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const Navigation: CollectionConfig = {
	slug: 'navigation',
	admin: {
		useAsTitle: 'label',
		defaultColumns: ['label', 'location', 'order', 'isVisible']
	},
	access: {
		read: () => true,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	fields: [
		{
			name: 'label',
			type: 'text',
			required: true
		},
		{
			name: 'url',
			type: 'text',
			required: true
		},
		{
			name: 'location',
			type: 'select',
			required: true,
			defaultValue: 'header',
			options: [
				{ label: 'Header', value: 'header' },
				{ label: 'Footer', value: 'footer' }
			]
		},
		{
			name: 'order',
			type: 'number',
			defaultValue: 0
		},
		{
			name: 'parent',
			type: 'relationship',
			relationTo: 'navigation'
		},
		{
			name: 'isVisible',
			type: 'checkbox',
			defaultValue: true
		}
	]
};
