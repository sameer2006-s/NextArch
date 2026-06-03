# Testing

Load when adding or moving tests for feature slices — not on every skill activation.

## Placement

Match the repo first. Defaults when silent:

| Level | Location |
|-------|----------|
| Unit (schemas, pure utils) | Next to source: `comment.schema.test.ts` or `features/<name>/__tests__/` |
| Services | `features/<name>/services/*.test.ts` — mock repositories |
| Repositories | `features/<name>/repositories/*.test.ts` — test DB, or MSW for REST |
| Server Actions | Test via service layer; action tests only for FormData/Zod wiring |
| E2E | `e2e/` or `tests/e2e/` — Playwright against `app/` routes |

## Unit

- **Schemas:** `safeParse` success/failure cases; no DB.
- **Services:** mock `commentRepository`; assert domain rules and result shapes.
- **Utils:** pure functions only in `utils/` — no I/O mocks needed.

## Integration

- **Integrated (Prisma/Drizzle):** test DB or transaction rollback per test; repositories hit real DB.
- **Separate-REST:** MSW or `nock` on `apiRequest`; assert 404 → `null` mapping.
- **Separate-gRPC:** mock `*ApiClient` at **service** boundary — not in hooks.

## E2E

- Cover critical user paths through `app/` routes.
- Prefer asserting visible outcomes over implementation details.
- Do not rely on E2E alone when service logic is dense — add service unit tests.

## Anti-patterns

- Importing `lib/db`, `lib/api/client`, or grpc clients in **component** tests.
- Testing business invariants only in E2E (slow, brittle).
- Cross-feature imports in test helpers — share via `types/` or test fixtures in `lib/`.

## Brownfield

On scan, note existing: `vitest`, `jest`, `playwright`, `__tests__` colocation. Extend that layout; do not introduce a second convention without reason.
