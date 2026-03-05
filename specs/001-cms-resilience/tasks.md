# Tasks: CMS Resilience and Content Consistency

**Input**: Design documents from `/specs/001-cms-resilience/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `quickstart.md`

**Tests**: This feature includes targeted automated tests because it changes route load behavior and shared CMS domain logic.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-level scaffolding and verification entry points.

- [ ] T001 Create feature test directories `src/lib/cms/__tests__/` and `src/routes/__tests__/`
- [ ] T002 Add/adjust test runner wiring in `package.json` and `vitest.config.ts`
- [ ] T003 [P] Add fixture helpers for provider-mode responses in `src/lib/cms/__tests__/fixtures/payload-fixtures.ts`
- [ ] T004 [P] Update feature quickstart commands in `specs/001-cms-resilience/quickstart.md` if command names change

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CMS boundary utilities required by all user stories.

**⚠️ CRITICAL**: No user story work should proceed until this phase is complete.

- [ ] T005 Implement fallback diagnostics utility in `src/lib/cms/diagnostics.ts` (FR-005, FR-006)
- [ ] T006 Implement normalization/default helpers in `src/lib/cms/normalize.ts` (FR-002, FR-004)
- [ ] T007 Add provider configuration guard behavior in `src/lib/cms/payload-client.ts` (FR-007)
- [ ] T008 Refactor shared exports in `src/lib/cms/index.ts` to expose new utilities where needed
- [ ] T009 Align shared domain types in `src/lib/types.ts` for normalized CMS models

**Checkpoint**: Foundation ready for independent story delivery.

---

## Phase 3: User Story 1 - Browse Without CMS Outage Breakage (Priority: P1) 🎯 MVP

**Goal**: Keep core storefront routes renderable under payload failures.

**Independent Test**: Simulate payload outage and verify core routes render fallback content with no unhandled exceptions.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add fallback behavior tests in `src/lib/cms/__tests__/content-source.fallback.test.ts`
- [ ] T011 [P] [US1] Add route resilience tests (home/shop/collection/product) in `src/routes/__tests__/core-routes-resilience.test.ts`

### Implementation for User Story 1

- [ ] T012 [US1] Integrate normalization + fallback handling in `src/lib/cms/content-source.ts`
- [ ] T013 [US1] Update core route loaders for consistent fallback data contracts in `src/routes/+layout.ts`, `src/routes/+page.ts`, `src/routes/shop/+page.ts`, `src/routes/collection/+page.ts`, `src/routes/shop/[id]/+page.ts`
- [ ] T014 [US1] Ensure safe defaults remain available from mock domain in `src/lib/mock/index.ts`

**Checkpoint**: Core storefront remains functional under provider outage.

---

## Phase 4: User Story 2 - Keep Navigation and Page Semantics Stable (Priority: P2)

**Goal**: Keep navigation/title/meta/section semantics consistent across provider modes.

**Independent Test**: Compare mock vs payload route content for known slugs and validate stable semantics.

### Tests for User Story 2

- [ ] T015 [P] [US2] Add provider parity tests in `src/lib/cms/__tests__/provider-parity.test.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Harden navigation mapping and ordering defaults in `src/lib/cms/content-source.ts`
- [ ] T017 [US2] Harden page metadata and section normalization in `src/lib/cms/content-source.ts`
- [ ] T018 [US2] Add missing slug and empty-state handling for page/section resolution in `src/lib/cms/content-source.ts`

**Checkpoint**: Mock and payload modes both provide valid navigation and page semantics.

---

## Phase 5: User Story 3 - Diagnose Fallback Behavior Quickly (Priority: P3)

**Goal**: Provide clear, deduplicated diagnostics when fallback is triggered.

**Independent Test**: Trigger repeated failures and verify context-aware, non-noisy diagnostics.

### Tests for User Story 3

- [ ] T019 [P] [US3] Add diagnostics deduplication tests in `src/lib/cms/__tests__/diagnostics.test.ts`

### Implementation for User Story 3

- [ ] T020 [US3] Wire diagnostics utility into provider failure paths in `src/lib/cms/content-source.ts`
- [ ] T021 [US3] Add operator troubleshooting guidance to `README.md`
- [ ] T022 [US3] Add feature-specific troubleshooting notes to `specs/001-cms-resilience/quickstart.md`

**Checkpoint**: Operators can identify fallback context quickly with low diagnostic noise.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality and release confidence.

- [ ] T023 [P] Run `npm run check` and resolve type/template issues
- [ ] T024 [P] Run `npm run lint` and resolve lint issues
- [ ] T025 [P] Run `npm run build` and resolve build issues
- [ ] T026 Validate quickstart manual outage simulation end-to-end and record notes in `specs/001-cms-resilience/quickstart.md`
- [ ] T027 Review requirement-to-task traceability in `specs/001-cms-resilience/spec.md` and `specs/001-cms-resilience/tasks.md`
- [ ] T028 Measure and record fallback overhead versus mock baseline for core routes in `specs/001-cms-resilience/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks story work.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP.
- **Phase 4 (US2)**: Depends on Phase 2; may run after or alongside late US1 stabilization.
- **Phase 5 (US3)**: Depends on Phase 2; best after US1/US2 behavior is stable.
- **Phase 6 (Polish)**: Depends on all intended story phases.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories.
- **US2 (P2)**: Independent of US1 but benefits from shared normalization work completed in Phase 2.
- **US3 (P3)**: Independent but integrates with fallback paths exercised by US1/US2.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001/T002.
- T010 and T011 can run in parallel.
- T015 can run in parallel with late US1 implementation once foundational utilities stabilize.
- T023, T024, and T025 can run in parallel at final verification.

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Deliver US1 test + implementation tasks (T010-T014).
3. Validate fallback continuity before expanding scope.

### Incremental Delivery

1. US1 for baseline continuity.
2. US2 for cross-provider semantic stability.
3. US3 for operational diagnostics and troubleshooting speed.

### Definition of Done

- All mapped requirements (FR-001..FR-008, NFR-001..NFR-003) have at least one completed task.
- Quality gates pass: `npm run check`, `npm run lint`, `npm run build`.
- Quickstart steps can be executed by another contributor without hidden tribal knowledge.

## Requirement Coverage Map

| Requirement | Covered By Tasks |
|-------------|------------------|
| FR-001 | T010, T011, T012, T013, T014 |
| FR-002 | T006, T009, T012, T017 |
| FR-003 | T015, T016 |
| FR-004 | T006, T008, T012, T018 |
| FR-005 | T005, T019, T020 |
| FR-006 | T005, T019, T020 |
| FR-007 | T007, T012 |
| FR-008 | T004, T021, T022, T026, T027 |
| NFR-001 | T011, T026, T028 |
| NFR-002 | T001, T002, T003, T010, T011, T023, T024, T025 |
| NFR-003 | T005, T019, T020 |
