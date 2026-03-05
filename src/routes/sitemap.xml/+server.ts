import { getSiteLayoutData } from '$lib/cms';
import { frontendProducts } from '$lib/mock';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET({ url, fetch }: { url: URL; fetch: typeof globalThis.fetch }) {
	const origin = url.origin;
	const staticPages = [
		'',
		'/shop',
		'/collection',
		'/account',
		'/checkout',
		'/contact',
		'/wishlist'
	];
	const { headerNav } = await getSiteLayoutData(fetch);

	const sitemap = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
            xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        >
	            ${staticPages
								.map(
									(page) => `
	                <url>
	                    <loc>${escapeXml(`${origin}${page}`)}</loc>
	                    <changefreq>weekly</changefreq>
	                    <priority>${page === '' ? '1.0' : '0.8'}</priority>
	                </url>
	            `
								)
								.join('')}

	            ${frontendProducts
								.map(
									(product) => `
	                <url>
	                    <loc>${escapeXml(`${origin}/shop/${product.id}`)}</loc>
	                    <lastmod>${new Date().toISOString()}</lastmod>
	                    <changefreq>weekly</changefreq>
	                    <priority>0.7</priority>
	                    ${
												product.image
													? `
	                        <image:image>
	                            <image:loc>${escapeXml(product.image)}</image:loc>
	                            <image:title>${escapeXml(product.title)}</image:title>
	                        </image:image>
	                    `
													: ''
											}
	                </url>
            `
								)
								.join('')}

	            ${headerNav
								.filter((nav) => nav.url.startsWith('/shop'))
								.map(
									(nav) => `
	                <url>
	                    <loc>${escapeXml(`${origin}${nav.url}`)}</loc>
	                    <changefreq>weekly</changefreq>
	                    <priority>0.6</priority>
	                </url>
	            `
								)
								.join('')}
        </urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
