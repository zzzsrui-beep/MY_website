# Payload on Vercel Setup

This storefront reads content from Payload over HTTP when `PUBLIC_CMS_PROVIDER=payload`.

## 1) Frontend env config

Create `.env` in project root:

```bash
PUBLIC_CMS_PROVIDER=payload
PUBLIC_PAYLOAD_URL=https://your-payload-app.vercel.app
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

Notes:
- `PUBLIC_PAYLOAD_URL` should be your Vercel Payload domain (no trailing slash).
- `PUBLIC_PAYLOAD_API_BASE_PATH` defaults to `/api`. Change only if your Payload API is mounted elsewhere.

## 2) Payload side requirements

Ensure these endpoints are readable by the storefront:
- `GET /api/globals/{settingsGlobal}`
- `GET /api/{navigationCollection}`
- `GET /api/{pagesCollection}`
- `GET /api/{sectionsCollection}`
- `GET /api/{assetsCollection}`

If read access is restricted, make collection/global `read` access public for required fields.

Compatibility note:
- Your current instance `payload-website-starter-ivory-one.vercel.app` exposes `globals/header`, `globals/footer`, and `pages`, but does not expose `navigation`, `ui-sections`, or `ui-assets`.
- This storefront now supports header/footer global fallback for navigation, and falls back to local mock data for missing e-commerce collections.

## 3) CSP and media domains

`svelte.config.js` now auto-adds these env-based domains to CSP:
- `PUBLIC_PAYLOAD_URL`
- `PUBLIC_MEDIA_BASE_URL`
- `PUBLIC_R2_CDN_URL`
- analytics script domain from `PUBLIC_ANALYTICS_CODE`

## 4) Payload MCP config (Codex)

In `C:\Users\Administrator\.codex\config.toml`:

```toml
[mcp_servers.payload.env]
PAYLOAD_API_BASE_PATH = "/api"
PAYLOAD_BASE_URL = "https://your-payload-app.vercel.app"
```

Restart the Codex session after changing MCP server env.

If your machine needs a local proxy for Node networking (for example `127.0.0.1:7897`), add:

```toml
[mcp_servers.payload.env]
PAYLOAD_API_BASE_PATH = "/api"
PAYLOAD_BASE_URL = "https://your-payload-app.vercel.app"
HTTP_PROXY = "http://127.0.0.1:7897"
HTTPS_PROXY = "http://127.0.0.1:7897"
NODE_USE_ENV_PROXY = "1"
```

Without `NODE_USE_ENV_PROXY=1`, Node `fetch` may fail even when browser/PowerShell requests work.

## 5) Verification

Run:

```bash
npm run check
npm run dev
```

Expected behavior:
- No CSP console errors for Payload/media requests.
- Layout/page content loads from Payload when provider is `payload`.
- When Payload is unavailable, app falls back to mock content.

## 6) MCP troubleshooting

- `Payload request failed ... fetch failed`:
  - Usually Node network/proxy issue. Confirm proxy env above.
- `tools/call failed: Transport closed`:
  - Restart Codex session after config changes so MCP server is recreated with new env.
