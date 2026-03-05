# Payload Vercel Migration Plan (website-starter -> storefront CMS model)

Target instance:
- `https://payload-website-starter-ivory-one.vercel.app`

## 0) Auth prerequisite

Your current instance has public read but protected write (for example `POST /api/categories` returns `403` without auth).

Before automated migration/seeding, prepare one of:
- Admin JWT token (`PAYLOAD_API_TOKEN`)
- Admin account credentials for `/api/users/login`

## 1) Current remote schema snapshot

Detected from `/api/access`:

- Collections: `pages`, `posts`, `media`, `categories`, `users`, `redirects`, `forms`, `form-submissions`, `search`
- Globals: `header`, `footer`

Missing for storefront CMS model:

- `navigation`
- `ui-sections`
- `ui-assets`
- `products`
- `collection-panels`
- `site-settings` (global)

## 2) Target schema to add

Use files from:
- [payload-blueprint](/S:/HTML_CODE/MY_website-main/payload-blueprint/README.md)

Core config:
- [payload.config.ts](/S:/HTML_CODE/MY_website-main/payload-blueprint/payload.config.ts)

Collections:
- `navigation`, `pages`, `ui-sections`, `ui-assets`, `categories`, `products`, `collection-panels`, `users`

Globals:
- `site-settings`, `header`, `footer`

## 3) Backend repo actions (Payload project)

1. Copy `payload-blueprint/src/access/*` into your backend.
2. Copy `payload-blueprint/src/collections/*` into your backend.
3. Copy `payload-blueprint/src/globals/*` into your backend.
4. Merge `payload-blueprint/payload.config.ts` registration into backend `payload.config.ts`.
5. Verify database adapter/secret remain your production values.
6. Deploy backend to Vercel.

## 4) Seed minimum content

Required minimum for storefront:

1. Global `site-settings`:
- `siteName`, `currencyCode`, `currencySymbol`, `shippingThreshold`

2. Collection `navigation`:
- Header and footer entries with `location` and `order`

3. Collection `pages`:
- `home`, `shop`, `collection`, `about`, `contact`

4. Collection `ui-sections`:
- At least one `hero` section for `home`
- Optional sections: `category_grid`, `product_grid`, `feature_split`, `cta_banner`

5. Collection `ui-assets`:
- `hero_category_plushies`
- `hero_category_stationery`
- `hero_category_lifestyle`

6. Collection `products` and `categories`:
- Publish at least one category and one product to replace mock fallback.

7. Collection `collection-panels`:
- Two records: `left` and `right` with image/link/title.

## 5) Storefront env alignment

Use:

```bash
PUBLIC_CMS_PROVIDER=payload
PUBLIC_PAYLOAD_URL=https://payload-website-starter-ivory-one.vercel.app
PUBLIC_PAYLOAD_API_BASE_PATH=/api
PUBLIC_PAYLOAD_SETTINGS_GLOBAL=site-settings
PUBLIC_PAYLOAD_NAV_COLLECTION=navigation
PUBLIC_PAYLOAD_PAGE_COLLECTION=pages
PUBLIC_PAYLOAD_SECTION_COLLECTION=ui-sections
PUBLIC_PAYLOAD_ASSET_COLLECTION=ui-assets
PUBLIC_PAYLOAD_CATEGORY_COLLECTION=categories
PUBLIC_PAYLOAD_PRODUCT_COLLECTION=products
PUBLIC_PAYLOAD_COLLECTION_PANEL_COLLECTION=collection-panels
```

## 6) Temporary compatibility behavior

Until migration is complete, storefront behavior is:

- Layout nav can read `header/footer` globals when `navigation` is missing.
- Shop/collection/product uses Payload only when `products` is available.
- Missing catalog collections automatically fall back to local mock data.

## 7) Live instance status (2026-03-06)

Applied on `https://payload-website-starter-ivory-one.vercel.app` with admin auth:

- `globals/header` nav items updated to match frontend menu.
- `globals/footer` nav items updated to match frontend footer links.
- `pages` now includes and publishes:
  - `home`, `shop`, `collection`, `about`, `contact`
- `categories` aligned to storefront categories:
  - `plush-toys`, `art-pieces`, `apparel-accessories`, `souvenirs`, `daily-products`, `digital-products`, `promo-products`

Still pending backend schema deployment:

- Missing collections: `navigation`, `ui-sections`, `ui-assets`, `products`, `collection-panels`
- Missing global: `site-settings`
