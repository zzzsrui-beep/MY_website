import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const Categories: CollectionConfig = {
	slug: 'categories',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'sortOrder', 'isVisible']
	},
	access: {
		read: () => true,
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
			name: 'name',
			type: 'text'
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'parent',
			type: 'relationship',
			relationTo: 'categories'
		},
		{
			name: 'isVisible',
			type: 'checkbox',
			defaultValue: true
		},
		{
			name: 'sortOrder',
			type: 'number',
			defaultValue: 0
		},
		{
			name: 'image',
			type: 'text'
		}
	]
};
