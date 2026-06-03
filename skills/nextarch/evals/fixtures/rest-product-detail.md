# REST Product Detail Fixture

Existing repo shape:

```text
app/products/[slug]/page.tsx
lib/api/client.ts
lib/env.ts
components/product-card.tsx
```

The repo has `API_URL` and no ORM. Product data comes from an external REST API.

Expected direction:

- Treat the feature as Separate-REST.
- Keep API URL, auth, and HTTP mapping server-side.
- Map a product `404` to `null`, then call `notFound()` from the route.
- Do not add Prisma, Drizzle, `lib/db`, or database repositories.
- Do not duplicate backend business invariants inside the Next.js UI layer.
