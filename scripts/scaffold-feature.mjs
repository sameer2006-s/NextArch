#!/usr/bin/env node
/**
 * Print a default feature-slice folder checklist for nextarch.
 * Run: npm run skill:scaffold -- <feature-name>
 */
const name = process.argv[2]?.trim().replace(/[^a-z0-9-]/gi, "") || "my-feature";

const tree = `
Default layout (adapt to existing src/modules, server/, or route-colocated conventions):

features/${name}/
  schemas/           # Zod + z.infer types (start here)
  repositories/      # optional — when I/O
  services/          # optional — domain rules / orchestration
  actions/           # optional — Server Actions + *.queries.ts
  components/        # Server Components by default
  hooks/             # optional — TanStack bridges only
  types/             # optional
  utils/             # optional — pure helpers only

app/                 # thin route imports from features/${name}/
  .../page.tsx
  .../loading.tsx    # if slow subtree
  .../error.tsx      # if needed

Implementation order:
  1. schemas → 2. repositories → 3. services → 4. actions → 5. components + app route → 6. loading/error/notFound

Use the lightest structure that preserves boundaries. Do not create empty folders.
`;

console.log(tree.trim());
