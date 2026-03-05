import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const CollectionPanels: CollectionConfig = {
	slug: 'collection-panels',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['position', 'title', 'order', 'isActive']
	},
	access: {
		read: () => true,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	fields: [
		{
			name: 'position',
			type: 'select',
			required: true,
			options: [
				{ label: 'Left', value: 'left' },
				{ label: 'Right', value: 'right' }
			]
		},
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			name: 'link',
			type: 'text',
			required: true
		},
		{
			name: 'image',
			type: 'text',
			required: true
		},
		{
			name: 'order',
			type: 'number',
			defaultValue: 0
		},
		{
			name: 'isActive',
			type: 'checkbox',
			defaultValue: true
		}
	]
};
