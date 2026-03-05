# Research: CMS Resilience and Content Consistency

## Decision 1: Centralize fallback diagnostics with context-level deduplication

- **Decision**: Introduce a shared diagnostics helper for CMS fallback events, keyed by provider context (`layout`, `settings`, `page:<slug>`, `sections:<slug>`, `assets`).
- **Rationale**: Current warning behavior is embedded in content loading code. A shared helper avoids inconsistent messaging and enforces dedupe expectations (FR-005, FR-006, NFR-003).
- **Alternatives considered**:
  - Keep inline `console.warn` calls (rejected: harder to test and keep consistent).
  - Add external logging service immediately (rejected: unnecessary scope increase for this feature).

## Decision 2: Move payload-to-domain normalization into dedicated mapping utilities

- **Decision**: Extract normalization and defaulting logic into reusable helpers used by content-source fetch paths.
- **Rationale**: Deterministic mapping protects route rendering from payload schema drift and improves testability (FR-002, FR-004).
- **Alternatives considered**:
  - Keep ad-hoc mapping inside each fetch function (rejected: duplication and drift risk).
  - Enforce strict schema reject-only behavior (rejected: conflicts with storefront continuity principle).

## Decision 3: Validate provider configuration before request fan-out

- **Decision**: Add explicit provider configuration guardrails before any payload request chain starts.
- **Rationale**: Early validation prevents noisy downstream errors and supports clean fallback transitions (FR-001, FR-007).
- **Alternatives considered**:
  - Let requests fail naturally and recover after exceptions (rejected: adds avoidable latency and warning noise).

## Decision 4: Add parity and resilience tests at CMS domain boundary

- **Decision**: Add targeted tests for fallback rendering behavior, navigation/page parity, and diagnostics dedupe.
- **Rationale**: Constitution requires targeted automated checks on core load logic and shared content contracts.
- **Alternatives considered**:
  - Rely only on manual browser validation (rejected: insufficient regression protection).

## Decision 5: Document operator verification and troubleshooting flow

- **Decision**: Provide a quickstart playbook for provider switch validation, outage simulation, and expected fallback diagnostics.
- **Rationale**: Supports SC-004 and reduces MTTR for content regressions.
- **Alternatives considered**:
  - Keep knowledge only in code comments (rejected: poor discoverability for operators).
