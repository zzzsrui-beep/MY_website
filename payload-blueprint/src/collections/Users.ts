import type { Access, CollectionConfig } from 'payload';
import { isAdmin } from '../access/roles';

const isAdminOrFirstUser: Access = async ({ req }) => {
	if (req.user?.role === 'admin') return true;
	if (req.user) return false;
	const existing = await req.payload.find({
		collection: 'users',
		limit: 1,
		depth: 0
	});
	return (existing.totalDocs ?? 0) === 0;
};

export const Users: CollectionConfig = {
	slug: 'users',
	auth: true,
	admin: {
		useAsTitle: 'email'
	},
	access: {
		read: isAdmin,
		create: isAdminOrFirstUser,
		update: isAdmin,
		delete: isAdmin
	},
	fields: [
		{
			name: 'role',
			type: 'select',
			required: true,
			defaultValue: 'editor',
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Editor', value: 'editor' },
				{ label: 'Viewer', value: 'viewer' }
			]
		},
		{
			name: 'displayName',
			type: 'text'
		}
	]
};
