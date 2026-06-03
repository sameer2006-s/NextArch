# Dashboard Refactor Fixture

Existing repo shape:

```text
app/dashboard/page.tsx
src/modules/dashboard/components/stats-cards.tsx
src/modules/dashboard/types.ts
lib/api/client.ts
```

`app/dashboard/page.tsx` is currently a client component that calls `/api/dashboard` inside `useEffect`.

Expected direction:

- Keep the existing `src/modules/dashboard` convention.
- Make `app/dashboard/page.tsx` an async Server Component for initial stats.
- Use a small client island only for interactive controls.
- Do not create `features/dashboard` just to mirror the module.
- Do not import `lib/api/client`, env, DB, or auth helpers from client files.
