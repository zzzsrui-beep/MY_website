# E-Commerce Frontend Shell Constitution

## Core Principles

### I. Frontend Shell Continuity (NON-NEGOTIABLE)
Every customer-facing route MUST remain usable when the CMS provider is unavailable or partially configured. The default behavior is graceful fallback to mock-backed content without fatal rendering errors.

### II. Contract-Driven Content Access
All content fetched through the CMS provider layer MUST use explicit domain contracts and deterministic mapping rules before reaching UI components. Unknown fields MAY be ignored, but required fields MUST have predictable defaults.

### III. Quality Gates Before Merge
Any change affecting route load logic, shared stores, pricing, checkout, account flows, or CMS mapping MUST pass automated checks (`npm run check`, `npm run lint`, `npm run build`) and include targeted tests for the changed behavior.

### IV. UX and Accessibility Consistency
User-visible changes MUST preserve design-system consistency (tokens, reusable components, spacing rhythm) and basic accessibility requirements: keyboard operation, semantic headings, focus visibility, and meaningful alt/label text.

### V. Performance and Operational Clarity
Critical storefront journeys (home, collection, product detail, cart, checkout entry) MUST maintain responsive interactions under defined budgets. Fallback behavior, degraded data states, and recoverable content errors MUST be diagnosable from structured logs or traceable warnings.

## Engineering Constraints

- Primary stack remains SvelteKit 2 + Svelte 5 + TypeScript + Tailwind CSS v4.
- Public environment variables MUST be treated as non-secret and validated before use.
- CMS provider changes MUST preserve both `mock` and `payload` modes.
- Shared business logic belongs in `$lib` modules and SHOULD avoid page-local duplication.
- External dependencies SHOULD only be added with a clear maintenance and bundle-size justification.

## Delivery Workflow and Review Policy

- Work follows Spec Kit flow: `/speckit.constitution` -> `/speckit.specify` -> `/speckit.plan` -> `/speckit.tasks` -> `/speckit.analyze` -> `/speckit.implement`.
- Each feature spec MUST define independently testable user stories and measurable outcomes.
- Plan and task artifacts MUST map requirements to concrete files and checks.
- Pull requests MUST include: scope summary, risk notes, test evidence, and rollback considerations for provider-related changes.
- Release-impacting regressions block merge until requirements, tasks, and validation evidence are updated.

## Governance

This constitution is authoritative for product and engineering decisions in this repository. If a plan, spec, or task conflicts with these principles, the artifact MUST be revised before implementation. Amendments require: (1) rationale, (2) version bump, (3) explicit update date, and (4) migration notes for affected open features.

**Version**: 1.0.0 | **Ratified**: 2026-03-05 | **Last Amended**: 2026-03-05
