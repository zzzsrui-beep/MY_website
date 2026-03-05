# Payload CMS Framework (Aligned to Current Frontend)

This document defines a Payload CMS content model that matches the current Svelte storefront behavior.

## 1) Scope

The framework covers:

- Site-level settings and media
- Header/footer navigation
- Page meta and body content
- Reusable page sections
- Home/hero UI assets
- Catalog taxonomy and products
- Collection page hero panels
- Role-based editorial access

## 2) Frontend-to-CMS Mapping

| Frontend Usage | Payload Entity | Slug/Key | Notes |
|---|---|---|---|
| `$lib/cms.getSiteSettings` | Global | `site-settings` | Site name, currency, maintenance, key images |
| `$lib/cms.getSiteLayoutData` | Collection | `navigation` | Header/footer nav by `location` + `order` |
| `getSiteLayoutData` fallback | Globals | `header`, `footer` | Compatibility with website-starter style nav globals |
| `getPageBySlugFromCms` | Collection | `pages` | `slug`, `title`, meta, hero |
| `getSectionsBySlugFromCms` | Collection | `ui-sections` | Typed blocks (`hero`, `feature_split`, etc.) |
| `getHomeAssetsFromCms` | Collection | `ui-assets` | Keyed media, e.g. `hero_category_plushies` |
| Shop/Collection filters | Collection | `categories` | Taxonomy and sorting |
| Product cards/detail | Collection | `products` | Title, slug, price, stock, variants, categories |
| Collection hero split | Collection | `collection-panels` | Left/right top visuals and links |

## 3) Content Architecture

### Globals

1. `site-settings`
- `siteName`
- `currencyCode`
- `currencySymbol`
- `shippingThreshold`
- `maintenanceMode`
- `icon`
- `storyImage`
- `aboutHeroImage`
- `aboutSectionImage`
- `emptyWishlistImage`

2. `header` and `footer` (compatibility globals)
- `navItems[]`
- `navItems[].link.label`
- `navItems[].link.url`
- `navItems[].order`
- `navItems[].isVisible`

### Collections

1. `navigation`
- `label`
- `url`
- `location` (`header`/`footer`)
- `order`
- `parent` (self relationship, optional)
- `isVisible`

2. `pages`
- `title`
- `slug`
- `content` (HTML string)
- `metaDescription`
- `ogImage`
- `heroImage`
- drafts/publish enabled

3. `ui-sections`
- `page` (relationship to `pages`)
- `type` (`hero`, `feature_split`, `product_grid`, `category_grid`, `rich_text`, `cta_banner`)
- `heading`
- `subheading`
- `content`
- `settings.actions[]` (`text`, `link`, `style`)
- `settings.external.image_url`
- `settings.external.video_url`
- `imageUrl`
- `videoUrl`
- `image` (string array, image gallery)
- `video` (string array, video gallery)
- `sortOrder`
- `isActive`
- `scheduleStart`
- `scheduleEnd`

4. `ui-assets`
- `key` (unique)
- `url`
- `altText`

5. `categories`
- `title`
- `name`
- `slug`
- `parent`
- `isVisible`
- `sortOrder`
- `image`

6. `products`
- `title`
- `slug`
- `description`
- `priceValue`
- `price` (auto-generated display label from `priceValue`)
- `image`
- `images[]`
- `categories[]`
- `attributes` (JSON)
- `isFeature`
- `hasVariants`
- `stockStatus`
- `gender`
- `stripePriceId`
- `tag`
- `variants[]` (color/size/sku/stock/image/gallery)

7. `collection-panels`
- `position` (`left`/`right`)
- `title`
- `link`
- `image`
- `isActive`
- `order`

## 4) Access Model

Roles:

- `admin`: full control
- `editor`: manage content entities (no user/admin infra)
- `viewer`: read-only backoffice role

Policy baseline:

- Public read for storefront collections/globals
- Create/update/delete restricted to `admin` and `editor`
- `users` management restricted to `admin`

## 5) Editorial Workflow

1. Content editors update `pages` and `ui-sections`.
2. Navigation manager updates `navigation` (`location` + `order`).
3. Merchandising manager updates `categories` + `products`.
4. Home visual manager updates `ui-assets` and `collection-panels`.
5. Global admin updates `site-settings`.

## 6) Slug & Key Conventions

- Page slugs: `home`, `shop`, `collection`, `about`, `contact`
- `ui-assets.key` examples:
- `hero_category_plushies`
- `hero_category_stationery`
- `hero_category_lifestyle`
- Section IDs: let Payload auto-id, stable order controlled by `sortOrder`

## 7) Integration Notes for Current Frontend

Current frontend already reads:

- `PUBLIC_PAYLOAD_SETTINGS_GLOBAL`
- `PUBLIC_PAYLOAD_NAV_COLLECTION`
- `PUBLIC_PAYLOAD_PAGE_COLLECTION`
- `PUBLIC_PAYLOAD_SECTION_COLLECTION`
- `PUBLIC_PAYLOAD_ASSET_COLLECTION`

Recommended `.env` values for this framework:

```bash
PUBLIC_CMS_PROVIDER=payload
PUBLIC_PAYLOAD_URL=https://your-payload.vercel.app
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

## 8) Rollout Plan

1. Add schema files from `payload-blueprint/` into your Payload backend repo.
2. Boot Payload and create an admin user.
3. Seed `site-settings`, `navigation`, `pages`, `ui-sections`, and `ui-assets`.
4. Migrate catalog content into `categories` and `products`.
5. Point storefront `.env` to Payload, verify home/shop/collection routes.
6. Remove mock fallbacks gradually after parity validation.
