---
name: nextarch
description: >-
  NextArch - use for Next.js App Router work that changes architecture, data
  ownership, server/client boundaries, or domain/module structure: moving
  server-loadable data out of client components, adding or refactoring feature or
  module slices, wiring Server Actions, or choosing Prisma/Drizzle, REST, or
  Connect/gRPC boundaries. Trigger when the user says NextArch. Prefer existing
  project structure; enforce strict boundaries with adaptable folders. Do not use
  for styling/copy, isolated component work, one-file fetch/useEffect bug fixes
  with no App Router boundary change, middleware-only work, net-new Pages Router
  apps, backend-only APIs, or tRPC/GraphQL procedure-only tasks.
---

# NextArch

Server-first Next.js App Router architecture: strict data boundaries, adaptable folders.

Default to **server-first** TypeScript. Match the repo first: folder names, validators, result types, tests, and route conventions win over this skill's defaults - [docs/brownfield.md](docs/brownfield.md).

**Strict boundaries, adaptable folders:** enforce dependency direction and server/client safety whether the repo uses `features/`, `src/modules/`, `server/`, or route colocation. `features/` is only the default for new domain work when no clear convention exists.

**Out of scope:** Pages Router-only work, non-Next.js, CSS/copy-only, middleware-only changes with no data-boundary or structure impact.

## Before code

1. Classify [task scope](#task-scope). Ask once if unclear.
2. Detect topology (below). Ask once if repo is ambiguous.
3. Scan existing structure (`features/`, `src/modules/`, `server/`, route colocation, validators, results) and output [planning artifact](#planning-output).
4. Load on demand:
   - Brownfield → [docs/brownfield.md](docs/brownfield.md)
   - tRPC, GraphQL → [docs/escape-hatches.md](docs/escape-hatches.md)
   - Enforcement → [rules/architecture.md](rules/architecture.md)
   - Folders → [rules/folder-structure.md](rules/folder-structure.md)
   - TypeScript / Next.js → [rules/coding-standards.md](rules/coding-standards.md)
   - Hybrid → [docs/topology.md](docs/topology.md)
   - Performance → [docs/performance.md](docs/performance.md)
   - Testing → [docs/testing.md](docs/testing.md)
   - REST / integrated / Drizzle → [docs/snippets/core.md](docs/snippets/core.md)
   - gRPC → [docs/snippets/grpc.md](docs/snippets/grpc.md)
   - Auth / env → [docs/snippets/auth-env.md](docs/snippets/auth-env.md)

## Task scope

| Scope | When | Required output |
|-------|------|-----------------|
| **Patch** | Single file, bugfix, copy; no new data boundaries | `## Plan` (2–4 bullets), then code |
| **Feature** | New slice or refactor one area (default) | `## Topology`, `## Architecture`, `## Data flow` |
| **Greenfield** | Multi-feature, hybrid split, new app area | Feature sections + rendering/performance notes |

Default **Feature**. Upgrade to Greenfield if multi-feature; downgrade to Patch if scope is tiny. tRPC/GraphQL-first repos: [escape-hatches](docs/escape-hatches.md) — boundaries only, not full repository layer.

## Lightest structure

Use the lightest structure that preserves boundaries: one-off server read → colocated async Server Component fetch; reused orchestration → service/module function; repeated DB/API access → repository/data module; mutation/form/client refresh → action or server query bridge.

Do not create empty `repositories/`, `actions/`, `hooks/`, or `features/` folders. Zod, Server Actions, result shapes, and file names are defaults only when the repo is silent.

## Planning output

Patch: `## Plan` with 2-4 bullets.

```markdown
## Topology
Integrated — Prisma, domain rules in services/

## Architecture
features/comments/{schemas,repositories,services,actions,components}
app/posts/[id]/page.tsx — server list + form island

## Data flow
Read: page → list-comments.service → comment.repository → db
Write: form → create-comment.action (Zod) → service → repository → revalidatePath
```

Greenfield adds feature sections plus rendering/server-client/performance notes.

## Topology

| Signal | Mode |
|--------|------|
| `lib/db`, Prisma/Drizzle, ORM | **Integrated** |
| `API_URL`, external `fetch`, no ORM | **Separate-REST** |
| `@connectrpc/connect`, `grpc/clients`, `*_pb` | **Separate-gRPC** |
| Mixed | **Hybrid** (per feature) |

| Mode | Flow | Domain rules |
|------|------|--------------|
| Integrated | UI → actions → services → repositories → DB | Next.js services |
| Separate-REST | UI → actions → services → repositories → HTTP | External backend |
| Separate-gRPC | UI → actions → services → *ApiClient → backend | External backend |

**gRPC:** one `lib/grpc/clients.ts`; `ServiceResult<T>`; TanStack via `*.queries.ts` bridges. Defaults: Server Actions return `{ ok: true, data? } | { ok: false, error }`; gRPC services return `{ success: true, data } | { success: false, error }`.

## Layers

| Layer | May | Must not |
|-------|-----|----------|
| UI | Render, call actions, compose | DB/API/RPC, domain rules |
| actions | Validate, call services, revalidate | SQL/HTTP/RPC, domain logic |
| services | Rules/orchestration, map DTOs | React, `"use client"` |
| repositories | CRUD, HTTP mapping | Business rules, React |
| hooks | TanStack via action bridges | *ApiClient, `getAuthedContext` |

Build order and optional layers: [rules/architecture.md](rules/architecture.md).

## Structure

```
features/<name>/{components,services,schemas,types?,hooks?,utils?,repositories?,actions?}
app/  components/  lib/{db|api|grpc|auth,env}  types/  middleware.ts
```

Equivalent layouts are fine when established: `src/modules/<name>/{server,data,ui}`, `app/<route>/_components + server/<domain>`, `server/routers/<domain>` (tRPC-first). Details: [rules/folder-structure.md](rules/folder-structure.md).

## Server vs client

Default **Server Component**. `"use client"` at **leaves** only. `loading.tsx`, `error.tsx`, `notFound()` where routes need them. Conventions: [rules/coding-standards.md](rules/coding-standards.md).

- Gotchas: `params` / `searchParams` are `Promise<>` in Next.js 15+ — await before use.
- Revalidate after mutations affecting cached routes or tagged fetches.
- Separate topologies: do not duplicate backend validation in Next.js.
- Integrated: Server Actions over new internal API routes for form mutations.

## Anti-patterns

- Full skeleton on a one-line Patch task
- `"use client"` on data-only pages
- `useEffect` + fetch for server-loadable data
- DB/API/RPC in components
- Big-bang `features/` rewrite on brownfield repos
- Hooks importing `*ApiClient` or `getAuthedContext`
- One file mixing DB + HTTP + gRPC (hybrid)

## Review checklist

- [ ] Task scope stated (Patch / Feature / Greenfield)
- [ ] Topology stated when data boundaries involved
- [ ] Planning artifact matches scope (not over-documented)
- [ ] Existing project structure followed before adding new folders
- [ ] Minimal `"use client"` (leaves only)
- [ ] I/O isolated from UI (repositories/data modules when needed)
- [ ] `loading` / `error` / `notFound` for new routes

## Rules (on conflict)

[rules/architecture.md](rules/architecture.md) · [rules/folder-structure.md](rules/folder-structure.md) · [rules/coding-standards.md](rules/coding-standards.md)
