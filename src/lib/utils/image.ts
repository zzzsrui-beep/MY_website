import { env } from '$env/dynamic/public';

function normalizeBaseUrl(value?: string) {
	const trimmed = value?.trim();
	if (!trimmed) return '';
	return trimmed.replace(/\/$/, '');
}

function isAbsoluteUrl(value: string) {
	return /^https?:\/\//i.test(value);
}

function joinUrl(base: string, path: string) {
	const cleanPath = path.replace(/^\/+/, '');
	return `${base}/${cleanPath}`;
}

/**
 * Media base URL priority:
 * 1) PUBLIC_MEDIA_BASE_URL (recommended)
 * 2) PUBLIC_R2_CDN_URL
 * 3) PUBLIC_PAYLOAD_URL
 */
export function getPublicMediaBaseUrl(): string {
	return (
		normalizeBaseUrl(env.PUBLIC_MEDIA_BASE_URL) ||
		normalizeBaseUrl(env.PUBLIC_R2_CDN_URL) ||
		normalizeBaseUrl(env.PUBLIC_PAYLOAD_URL) ||
		''
	);
}

/**
 * Resolve any asset path or URL into a browser-usable URL.
 * - Absolute URLs are returned as-is.
 * - Relative paths are prefixed by configured media base URL when available.
 */
export function resolveAssetUrl(pathOrUrl: string): string {
	const raw = pathOrUrl?.trim();
	if (!raw) return '';
	if (isAbsoluteUrl(raw)) return raw;

	const base = getPublicMediaBaseUrl();
	if (!base) {
		return raw.startsWith('/') ? raw : `/${raw}`;
	}

	return joinUrl(base, raw);
}

/**
 * Appends a thumbnail query parameter when missing.
 */
export function appendThumbToUrl(url: string, thumb: string): string {
	if (!thumb || !url || url.includes('thumb=')) return url;
	const sep = url.includes('?') ? '&' : '?';
	return `${url}${sep}thumb=${encodeURIComponent(thumb)}`;
}
