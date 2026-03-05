import type { GlobalConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

const navItemFields = [
	{
		name: 'link',
		type: 'group',
		fields: [
			{ name: 'label', type: 'text', required: true },
			{ name: 'url', type: 'text', required: true }
		]
	},
	{
		name: 'order',
		type: 'number',
		defaultValue: 0
	},
	{
		name: 'isVisible',
		type: 'checkbox',
		defaultValue: true
	}
] as const;

export const Header: GlobalConfig = {
	slug: 'header',
	access: {
		read: () => true,
		update: isEditorOrAdmin
	},
	fields: [
		{
			name: 'navItems',
			type: 'array',
			fields: [...navItemFields]
		}
	]
};
