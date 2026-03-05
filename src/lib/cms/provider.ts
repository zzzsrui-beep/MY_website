import { env } from '$env/dynamic/public';

export type CmsProvider = 'mock' | 'payload';

const DEFAULT_PROVIDER: CmsProvider = 'mock';

export function getCmsProvider(): CmsProvider {
	const raw = env.PUBLIC_CMS_PROVIDER?.trim().toLowerCase();
	if (raw === 'payload') return 'payload';
	if (raw === 'mock' || !raw) return DEFAULT_PROVIDER;
	return DEFAULT_PROVIDER;
}

export function isPayloadProvider() {
	return getCmsProvider() === 'payload';
}
