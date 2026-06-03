# Folder structure

Folder structure is a default, not a mandate. Prefer the repo's existing domain/module layout when it is clear; enforce dependency and server/client boundaries regardless of names.

## Default layout

```
app/
features/<name>/
  components/
  services/
  schemas/
  types/          # optional
  hooks/          # optional
  utils/          # optional, pure only
  repositories/   # when feature has I/O
  actions/        # mutations + query bridges
components/
lib/
  db.ts           # Integrated
  api/            # Separate-REST
  grpc/clients.ts # Separate-gRPC
  auth.ts
  env.ts
types/
middleware.ts
```

Acceptable equivalents when already established:

```
src/modules/<name>/{server,data,ui}
app/<route>/_components + server/<domain>
server/routers/<domain>       # tRPC-first repos
graphql/<domain>              # GraphQL-first repos
```

## Path rules

| Path | Rule |
|------|------|
| `app/` | Thin routes — no business logic, no direct DB/API/RPC |
| `features/<name>/` | One domain per folder; default for new domain work when no repo convention exists |
| `src/modules/<name>/` | OK equivalent for domain modules |
| `server/<domain>/` | OK for server-owned domain logic in existing repos |
| `app/**/_components/` or route colocation | OK if repo already colocates UI next to routes — do not duplicate into `features/` unless logic is shared |
| `features/<name>/components/` | Server Component by default |
| `features/<name>/services/` | `<verb>-<entity>.service.ts` |
| `features/<name>/schemas/` | Zod schemas + `z.infer` types |
| `features/<name>/repositories/` | Data access (integrated + REST) |
| `features/<name>/actions/` | Server Actions + `*.queries.ts` |
| `lib/` | Cross-cutting only — no feature/domain rules |

## Naming

| Artifact | Pattern | Example |
|----------|---------|---------|
| Service | `<verb>-<entity>.service.ts` | `list-comments.service.ts` |
| Action | `<verb>-<entity>.action.ts` | `create-comment.action.ts` |
| Repository | `<entity>.repository.ts` | `comment.repository.ts` |
| Schema | `<entity>.schema.ts` | `comment.schema.ts` |
| Query bridge | `<entity>.queries.ts` | `item.queries.ts` |
| Hook | `use-<entity>-query.ts` | `use-item-query.ts` |

Match existing suffixes before introducing these names. Add `features/`, `repositories/`, `actions/`, or `hooks/` only when needed — no empty placeholders.

## Imports

- No cross-feature imports of `components/`, `services/`, or `repositories/`.
- UI must not import `lib/db`, `lib/api/client`, or grpc clients.
- Only services/repositories may import `*ApiClient`.
- Client hooks must not import server auth, env, DB, REST, or gRPC clients directly.
