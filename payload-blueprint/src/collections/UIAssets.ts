import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const UIAssets: CollectionConfig = {
	slug: 'ui-assets',
	admin: {
		useAsTitle: 'key',
		defaultColumns: ['key', 'url', 'updatedAt']
	},
	access: {
		read: () => true,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	fields: [
		{
			name: 'key',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'url',
			type: 'text',
			required: true
		},
		{
			name: 'altText',
			type: 'text'
		}
	]
};
