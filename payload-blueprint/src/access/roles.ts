import type { Access } from 'payload';

type UserLike = {
	role?: 'admin' | 'editor' | 'viewer' | string;
};

function readRole(req: { user?: UserLike | null }) {
	return req.user?.role ?? '';
}

export const isLoggedIn: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) => readRole(req) === 'admin';

export const isEditorOrAdmin: Access = ({ req }) => {
	const role = readRole(req);
	return role === 'admin' || role === 'editor';
};

export const readPublishedOrEditor: Access = ({ req }) => {
	const role = readRole(req);
	if (role === 'admin' || role === 'editor') return true;
	return {
		_status: {
			equals: 'published'
		}
	};
};
