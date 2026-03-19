import { browser } from '$app/environment';
import { goto } from '$app/navigation';

const EXTERNAL_TARGET_RE = /^(https?:\/\/|mailto:|tel:|#)/i;

export interface SmartNavigateOptions {
	replaceState?: boolean;
	noScroll?: boolean;
	keepFocus?: boolean;
	fallbackTimeoutMs?: number;
	forceHard?: boolean;
}

export function normalizeNavigationTarget(rawUrl: string): string {
	const raw = rawUrl?.trim();
	if (!raw) return '';
	if (EXTERNAL_TARGET_RE.test(raw)) return raw;
	return raw.startsWith('/') ? raw : `/${raw}`;
}

export function isExternalNavigationTarget(target: string): boolean {
	return EXTERNAL_TARGET_RE.test(target);
}

export async function smartNavigate(rawUrl: string, options: SmartNavigateOptions = {}) {
	if (!browser) return;

	const target = normalizeNavigationTarget(rawUrl);
	if (!target) return;

	if (options.forceHard || isExternalNavigationTarget(target)) {
		window.location.assign(target);
		return;
	}

	const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	if (target === current) return;

	const fallbackTimeoutMs = options.fallbackTimeoutMs ?? 1200;
	let settled = false;
	const timer = window.setTimeout(() => {
		if (!settled) {
			window.location.assign(target);
		}
	}, fallbackTimeoutMs);

	try {
		await goto(target, {
			replaceState: options.replaceState ?? false,
			noScroll: options.noScroll ?? false,
			keepFocus: options.keepFocus ?? false
		});
		settled = true;
	} finally {
		window.clearTimeout(timer);
	}
}
