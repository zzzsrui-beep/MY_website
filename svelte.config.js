import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { loadEnv } from 'vite';

// Load env vars using Vite's built-in helper
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

function extractOriginFromUrl(urlLike) {
	if (!urlLike) return null;
	try {
		return new URL(urlLike).origin;
	} catch (e) {
		return null;
	}
}

function extractOriginFromScriptTag(htmlCode) {
	if (!htmlCode) return null;
	const match = htmlCode.match(/src=["'](https?:\/\/[^"']+)["']/);
	return extractOriginFromUrl(match?.[1]);
}

function addSource(target, source) {
	if (!source) return;
	if (!target.includes(source)) target.push(source);
}

const analyticsDomain = extractOriginFromScriptTag(env.PUBLIC_ANALYTICS_CODE);
const payloadDomain = extractOriginFromUrl(env.PUBLIC_PAYLOAD_URL);
const mediaDomain = extractOriginFromUrl(env.PUBLIC_MEDIA_BASE_URL);
const r2Domain = extractOriginFromUrl(env.PUBLIC_R2_CDN_URL);

// Define base CSP sources
const scriptSrc = [
	'self',
	'unsafe-inline',
	'unsafe-eval',
	'https://js.stripe.com',
	'https://*.umami.is',
	'https://analytics.elementhic.com',
	'https://static.cloudflareinsights.com'
];

const connectSrc = [
	'self',
	'https://pb.elementhic.com',
	'https://api.stripe.com',
	'https://*.umami.is',
	'https://analytics.elementhic.com'
];

const imgSrc = [
	'self',
	'data:',
	'blob:',
	'https://pb.elementhic.com',
	'https://img.elementhic.com',
	'https://*.stripe.com',
	'https://images.unsplash.com'
];

addSource(scriptSrc, analyticsDomain);
addSource(connectSrc, analyticsDomain);
addSource(connectSrc, payloadDomain);
addSource(connectSrc, mediaDomain);
addSource(connectSrc, r2Domain);
addSource(imgSrc, payloadDomain);
addSource(imgSrc, mediaDomain);
addSource(imgSrc, r2Domain);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			entries: ['*', '/robots.txt', '/sitemap.xml']
		},
		csp: {
			// mode: 'auto', // Commented out to allow 'unsafe-inline' to work for event handlers
			directives: {
				'default-src': ['self'],
				'script-src': scriptSrc,
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'img-src': imgSrc,
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'connect-src': connectSrc,
				'frame-src': ['self', 'https://js.stripe.com', 'https://hooks.stripe.com'],
				'object-src': ['none'],
				'base-uri': ['self']
			}
		}
	}
};

export default config;
