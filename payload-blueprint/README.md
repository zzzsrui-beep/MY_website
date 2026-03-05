# Payload Blueprint

This folder is a ready-to-port Payload CMS framework aligned to this storefront.

## What it contains

- `payload.config.ts`: baseline Payload config
- `src/collections/*`: content collections
- `src/globals/*`: global configs
- `src/access/*`: role-based access helpers

## Intended usage

1. Copy this folder's source files into your Payload backend project.
2. Register any missing plugins/adapters required by your backend.
3. Run Payload migrations/boot.
4. Seed content from current mock data.

## Core slugs used by storefront

- Global: `site-settings`
- Collections: `navigation`, `pages`, `ui-sections`, `ui-assets`

Optional compatibility globals are also included:

- `header`
- `footer`

These are useful when migrating from the Payload website starter.
