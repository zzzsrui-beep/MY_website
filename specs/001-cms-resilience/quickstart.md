# Quickstart: CMS Resilience and Content Consistency

## 1) Install and verify baseline

```bash
npm install
npm run check
npm run lint
```

## 2) Run feature-focused automated checks

```bash
# unit/parity/diagnostics tests introduced by this feature
npm run test -- src/lib/cms/__tests__

# route resilience tests introduced by this feature
npm run test -- src/routes/__tests__/core-routes-resilience.test.ts
```

## 3) Manual resilience validation

### A. Mock baseline

```bash
PUBLIC_CMS_PROVIDER=mock npm run dev
```

- Open home, shop, collection, and product detail routes.
- Confirm page title, nav links, and section rendering are valid.

### B. Payload outage simulation

```bash
PUBLIC_CMS_PROVIDER=payload PUBLIC_PAYLOAD_URL=http://127.0.0.1:9999 npm run dev
```

- Reload the same core routes.
- Confirm fallback rendering remains usable.
- Confirm no fatal route error pages appear.

### C. Partial payload simulation

- Point `PUBLIC_PAYLOAD_URL` to a payload instance with incomplete content.
- Confirm missing fields fall back to safe defaults and navigation remains usable.

## 4) Diagnostics verification

- Trigger repeated failure in one context (for example `layout`).
- Verify diagnostics report first occurrence clearly.
- Verify repeated identical failures are deduplicated in the same runtime session.

## 5) Release gate

- Capture average route load timing for core routes in mock mode and outage-fallback mode.
- Confirm fallback-mode timing stays within +20% of mock baseline for this feature target.

```bash
npm run check
npm run lint
npm run build
```

All commands must pass before merge.
