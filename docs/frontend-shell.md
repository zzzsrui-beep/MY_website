# Frontend Shell Technical Notes

## Scope

This repository currently runs as a frontend shell:

- UI, route structure, and client interactions are preserved.
- Data defaults to local mock modules, with optional Payload content source.
- Backend API routes, CMS integration, and payment server logic are not part of the active runtime path.

Note: Payload CMS preconfiguration is now in place for content reads. Runtime still safely falls back to mock data when Payload is unavailable.

## Data Module Layout

Provider layer:

- `src/lib/cms/provider.ts`
- `src/lib/cms/payload-client.ts`
- `src/lib/cms/content-source.ts`
- `src/lib/cms/index.ts`

Route loaders should use `$lib/cms` for content-provider aware reads, and `$lib/mock` for domains not migrated yet.

Files:

- `src/lib/mock/settings.ts`
- `src/lib/mock/navigation.ts`
- `src/lib/mock/catalog.ts`
- `src/lib/mock/content.ts`
- `src/lib/mock/orders.ts`
- `src/lib/mock/index.ts`

Responsibilities:

- `settings.ts`: global site settings
- `navigation.ts`: header/footer navigation and helpers
- `catalog.ts`: categories/products/filter parsers/product query helpers
- `content.ts`: page metadata/sections/home assets
- `orders.ts`: account order summaries/details
- `index.ts`: re-export entry for route-level imports

## Route Data Flow

Server-agnostic route loaders now read content via `$lib/cms` (with mock fallback):

- `src/routes/+layout.ts`
- `src/routes/+page.ts`
- `src/routes/[slug]/+page.ts`
- `src/routes/shop/+page.ts`
- `src/routes/shop/[id]/+page.ts`
- `src/routes/collection/+page.ts`
- `src/routes/collection/[id]/+page.ts`
- `src/routes/account/orders/+page.ts`
- `src/routes/account/orders/[id]/+page.ts`
- `src/routes/sitemap.xml/+server.ts`

## Environment Variables in Use

Public variables used by frontend shell:

- `PUBLIC_CMS_PROVIDER`
- `PUBLIC_PAYLOAD_URL`
- `PUBLIC_PAYLOAD_SETTINGS_GLOBAL`
- `PUBLIC_PAYLOAD_NAV_COLLECTION`
- `PUBLIC_PAYLOAD_PAGE_COLLECTION`
- `PUBLIC_PAYLOAD_SECTION_COLLECTION`
- `PUBLIC_PAYLOAD_ASSET_COLLECTION`

- `PUBLIC_MEDIA_BASE_URL`
- `PUBLIC_R2_CDN_URL`
- `PUBLIC_ANALYTICS_CODE`

References:

- `src/lib/utils/image.ts`
- `src/routes/+layout.svelte`
- `svelte.config.js`

## Maintenance Rules

1. Keep route imports stable: use `$lib/cms` for content reads; avoid deep route-level data wiring.
2. For domains still mock-backed, add one focused file and re-export via `src/lib/mock/index.ts`.
3. Preserve type contracts from `src/lib/types.ts` to avoid Svelte page data drift.
4. Run `npm run check` after any provider/schema/route-loader change.
