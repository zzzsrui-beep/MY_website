# Data Model: CMS Resilience and Content Consistency

## Entity: ProviderContext

- **Purpose**: Identifies the logical content domain for fetch, normalization, fallback, and diagnostics.
- **Fields**:
  - `name` (string, required): canonical context key (`layout`, `settings`, `assets`, `page:<slug>`, `sections:<slug>`)
  - `providerMode` (enum, required): `mock` or `payload`
  - `timestamp` (datetime, required): event creation time

## Entity: NormalizedPage

- **Purpose**: Canonical page shape used by route rendering across provider modes.
- **Fields**:
  - `id` (string, optional but stable when available)
  - `slug` (string, required)
  - `title` (string, required, non-empty default allowed)
  - `metaDescription` (string, required, fallback allowed)
  - `heroImage` (string, optional)
  - `sections` (array of NormalizedSection, required)

## Entity: NavigationItem

- **Purpose**: Route entry shown in header/footer navigation.
- **Fields**:
  - `id` (string, required)
  - `label` (string, required)
  - `url` (string, required)
  - `location` (enum, required): `header` or `footer`
  - `order` (number, required for stable sorting)
  - `isVisible` (boolean, required)

## Entity: FallbackEvent

- **Purpose**: Diagnostic record for provider failure handled by fallback.
- **Fields**:
  - `context` (string, required): ProviderContext.name
  - `reasonType` (enum, required): `config`, `network`, `response-shape`, `unknown`
  - `message` (string, required): concise failure summary
  - `dedupeKey` (string, required): stable key to suppress duplicates
  - `firstSeenAt` (datetime, required)

## Entity Relationships

- One `ProviderContext` can produce many `FallbackEvent` records.
- One `NormalizedPage` references many `NormalizedSection` entries.
- `NavigationItem` records are grouped by `location` and sorted by `order` for layout rendering.
