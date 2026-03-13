import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

function normalizeBaseUrl(value?: string) {
	const trimmed = value?.trim();
	if (!trimmed) return '';
	return trimmed.replace(/\/$/, '');
}

function getPayloadBaseUrl() {
	return normalizeBaseUrl(env.PUBLIC_PAYLOAD_URL) || normalizeBaseUrl(env.PUBLIC_MEDIA_BASE_URL);
}

function buildTargetUrl(path: string, search: string) {
	const base = getPayloadBaseUrl();
	if (!base) return '';

	const cleanPath = path.replace(/^\/+/, '');
	const target = `${base}/api/media/file/${cleanPath}`;
	return `${target}${search || ''}`;
}

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
	const target = buildTargetUrl(params.path || '', url.search);
	if (!target) {
		return new Response('Payload media base URL is not configured', { status: 500 });
	}

	return Response.redirect(target, 302);
};

export const HEAD: RequestHandler = GET;
