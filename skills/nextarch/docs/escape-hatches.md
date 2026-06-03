# Escape hatches (alternate stacks)

When the repo **already** chose a primary data layer, keep **topology + server/client boundaries**; flex **folder ceremony**.

| Stack | Still apply | Do not force |
|-------|-------------|--------------|
| **tRPC** | Minimal `"use client"`; server routers for secrets; typed boundaries | `lib/api/client`, feature `repositories/` wrapping REST |
| **GraphQL** (Apollo, urql, RSC) | Colocate queries; no tokens in client components | Prisma repositories per GraphQL field |
| **Colocated server fetch** in `page.tsx` | Fine for one-off read-only pages | Extra service + repository with no reuse |
| **Route Handlers** as public API | Keep webhooks, external consumers, streaming | Replacing with Server Actions unless internal forms (integrated) |

## Trigger gray zone

| Trigger this skill | Do not trigger (or Patch-only) |
|--------------------|--------------------------------|
| App Router structure, server/client boundaries | New tRPC procedure only |
| Moving server-loadable data off `"use client"` / `useEffect` pages | `useEffect` dependency bug only |
| New domain/module slice with layers | Storybook component only |
| Server Actions + Zod on forms (no tRPC migration) | Middleware-only i18n routing |
| Hybrid split (DB + `API_URL` per feature) | Hydration-only `suppressHydrationWarning` |
| Server-owned auth or secrets need a bridge | Client polling/live widget intentionally owns fetch |

**Partial apply on mixed apps:** enforce boundaries + minimal client; do not add `repositories/` wrapping REST over existing tRPC.

## tRPC

- Extend `server/routers` or existing `app/api/trpc` setup.
- Client components use generated hooks — not raw `fetch` to internal REST.
- Defer this skill’s repository/service template unless migrating **off** tRPC.

## GraphQL

- Prefer colocated queries or established `graphql/` folder.
- Server Components may call server-side GQL client; do not add Prisma repo layer only for the UI.

## Defer this skill

If the task is **only** “add a tRPC procedure,” “add a GraphQL field,” “fix a hook dependency,” or “add a webhook route” with no App Router structure change, follow that stack’s docs instead of imposing `features/*/repositories/`.

For mixed apps (tRPC + a few Server Actions), state **Hybrid** mentally: one transport per feature file.
