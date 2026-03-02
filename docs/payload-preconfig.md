# Payload CMS Preconfiguration

This project is preconfigured to read **content** from Payload CMS while keeping mock data as a safe fallback.

## How It Works

Runtime provider switch:

- `PUBLIC_CMS_PROVIDER=mock` -> use mock only
- `PUBLIC_CMS_PROVIDER=payload` -> try Payload first, fallback to mock on failure

Core files:

- `src/lib/cms/provider.ts`
- `src/lib/cms/payload-client.ts`
- `src/lib/cms/content-source.ts`

## Required Environment Variables

At minimum:

- `PUBLIC_CMS_PROVIDER=payload`
- `PUBLIC_PAYLOAD_URL=http://127.0.0.1:3000` (or your deployed Payload URL)

Optional slug overrides:

- `PUBLIC_PAYLOAD_SETTINGS_GLOBAL` (default `site-settings`)
- `PUBLIC_PAYLOAD_NAV_COLLECTION` (default `navigation`)
- `PUBLIC_PAYLOAD_PAGE_COLLECTION` (default `pages`)
- `PUBLIC_PAYLOAD_SECTION_COLLECTION` (default `ui-sections`)
- `PUBLIC_PAYLOAD_ASSET_COLLECTION` (default `ui-assets`)

Optional media URL overrides:

- `PUBLIC_MEDIA_BASE_URL` (generic base URL for relative media paths)
- `PUBLIC_R2_CDN_URL` (CDN base URL, takes priority for relative media paths)

## Expected Payload Shape (Baseline)

Global: `site-settings`

- `siteName`
- `currencyCode`
- `currencySymbol`
- `shippingThreshold`
- `maintenanceMode`
- `icon`

Collection: `navigation`

- `label`
- `url`
- `location` (`header` or `footer`)
- `order`
- `isVisible` (or `is_visible`)

Collection: `pages`

- `slug`
- `title`
- `content`
- `metaDescription` (or `meta_description`)
- `heroImage` / `hero_image`
- `ogImage` / `og_image`

Collection: `ui-sections`

- `page` (relation to `pages`)
- `type`
- `heading`
- `subheading`
- `content`
- `settings` (JSON/object)
- `imageUrl` / `image_url` or `image[]`
- `videoUrl` / `video_url` or `video[]`
- `sortOrder` / `sort_order`
- `isActive` / `is_active`

Collection: `ui-assets`

- `key`
- `url` (or `image_url` / `image`)
- `altText` / `alt_text`

## Current Scope

Payload preconfiguration currently covers:

- site settings
- header/footer navigation
- page metadata by slug
- section blocks by page
- home assets

Catalog products/categories and account orders remain mock-backed in this phase.
