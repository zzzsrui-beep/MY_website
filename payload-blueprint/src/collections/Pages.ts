import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin, readPublishedOrEditor } from '../access/roles';

export const Pages: CollectionConfig = {
	slug: 'pages',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt']
	},
	versions: {
		drafts: true
	},
	access: {
		read: readPublishedOrEditor,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'content',
			type: 'textarea'
		},
		{
			name: 'metaDescription',
			type: 'textarea'
		},
		{
			name: 'ogImage',
			type: 'text'
		},
		{
			name: 'heroImage',
			type: 'text'
		}
	]
};
