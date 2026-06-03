# gRPC Refresh Fixture

Existing repo shape:

```text
app/items/[id]/page.tsx
lib/grpc/clients.ts
lib/auth.ts
features/items/components/item-detail.tsx
features/items/hooks/use-item-query.ts
```

The page should server-render item data from Connect RPC. Users also need a client refresh button powered by TanStack Query.

Expected direction:

- Treat the feature as Separate-gRPC.
- Keep one shared Connect client registry in `lib/grpc/clients.ts`.
- Services attach server-owned auth and return a success/error result.
- Client hooks call a server query bridge such as `features/items/actions/item.queries.ts`.
- Hooks must not import RPC clients, env, or `getAuthedContext`.
