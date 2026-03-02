import { browser } from '$app/environment';

const FRONTEND_AUTH_KEY = 'frontend_auth_user';

export interface AuthUser {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	verified: boolean;
	stripeCustomerId?: string;
	isAdmin?: boolean;
}

function readStoredUser(): AuthUser | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(FRONTEND_AUTH_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
}

function persistUser(user: AuthUser | null) {
	if (!browser) return;
	if (!user) {
		localStorage.removeItem(FRONTEND_AUTH_KEY);
		return;
	}
	localStorage.setItem(FRONTEND_AUTH_KEY, JSON.stringify(user));
}

function createAuthStore() {
	const initialUser = readStoredUser();

	let isAuthenticated = $state(Boolean(initialUser));
	let user = $state<AuthUser | null>(initialUser);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	return {
		get isAuthenticated() {
			return isAuthenticated;
		},
		get user() {
			return user;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},

		async login(email: string, _password: string): Promise<boolean> {
			isLoading = true;
			error = null;
			const nextUser: AuthUser = {
				id: `frontend-${Date.now()}`,
				email,
				name: email.split('@')[0],
				verified: true,
				isAdmin: false
			};
			user = nextUser;
			isAuthenticated = true;
			persistUser(nextUser);
			isLoading = false;
			return true;
		},

		async loginWithGoogle(): Promise<boolean> {
			return this.login('google-demo@example.com', '');
		},

		async register(email: string, _password: string, name?: string): Promise<boolean> {
			isLoading = true;
			error = null;
			const nextUser: AuthUser = {
				id: `frontend-${Date.now()}`,
				email,
				name: name || email.split('@')[0],
				verified: true,
				isAdmin: false
			};
			user = nextUser;
			isAuthenticated = true;
			persistUser(nextUser);
			isLoading = false;
			return true;
		},

		async resetPassword(_email: string): Promise<boolean> {
			isLoading = true;
			error = null;
			isLoading = false;
			return true;
		},

		logout() {
			user = null;
			isAuthenticated = false;
			error = null;
			persistUser(null);
		},

		clearError() {
			error = null;
		}
	};
}

export const auth = createAuthStore();
