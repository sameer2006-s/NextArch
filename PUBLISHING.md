# Maintainer guide — NextArch

**Repository:** https://github.com/sameer2006-s/NextArch

## Layout

```
NextArch/
├── package.json              # npm run skill:check
├── scripts/skill-check.mjs   # deterministic validators
├── .github/workflows/        # skill-check CI
└── skills/nextarch/
    ├── SKILL.md              # name: nextarch
    ├── skill.json            # version in CHANGELOG
    ├── rules/
    ├── docs/
    └── evals/                # behavioral + trigger evals
```

## Every PR

```bash
npm run skill:check
```

CI runs via [.github/workflows/skill-check.yml](.github/workflows/skill-check.yml):

- `npm run skill:check` (package, links, lazyDocs, version, evals, forbidden paths)
- `npx skills add . --list` must include `nextarch`
- Runs on changes under `skills/`, `scripts/`, `.github/`, `package.json`, `CHANGELOG.md` (plus `workflow_dispatch`)

Manual checklist (still required for release):

- [ ] Agent benchmark all 10 evals pass (not in CI)
- [ ] Trigger-eval review if `description` changed (not in CI)

## Every release (v1.8.0+)

### 1. Deterministic gates

```bash
npm run skill:check
```

### 2. Agent benchmark (manual)

```bash
npm run skill:workspace   # creates nextarch-workspace/iteration-1/
```

1. Enable **nextarch** in your agent.
2. Run all prompts from [skills/nextarch/evals/evals.json](skills/nextarch/evals/evals.json).
3. Save responses to `nextarch-workspace/iteration-N/eval-*/with_skill/outputs/response.md`.
4. Grade against `expectations` and `must_not` (target: 100% pass on every eval).
5. For fixture-backed evals, confirm the response preserves existing project structure while enforcing boundaries.
6. Update `nextarch-workspace/history.json` with `expectation_pass_rate`.

See [skills/nextarch/evals/README.md](skills/nextarch/evals/README.md) for skill-creator integration (`run_eval.py`, `aggregate_benchmark.py`, `generate_review.py`).

### 3. Trigger evals (if `description` changed)

Re-run [trigger-eval.json](skills/nextarch/evals/trigger-eval.json) via skill-creator description tooling before merging description edits. Target ≥90% on 25 queries, with attention to near-misses such as webhook-only tasks, hook bugfixes, and tRPC procedure-only changes.

### SKILL.md size

Keep [`SKILL.md`](skills/nextarch/SKILL.md) scannable: hard max **165 lines** (`skill:check`); warning at **150**. Put detail in `rules/` and `docs/`.

### Feature scaffold (optional)

```bash
npm run skill:scaffold -- comments
```

### 4. Version bump and tag

- [ ] `skills/nextarch/skill.json` version matches top `CHANGELOG.md` entry
- [ ] `repository` URL is `https://github.com/sameer2006-s/NextArch`
- [ ] README install uses `npx skills add sameer2006-s/NextArch --skill nextarch`

```bash
git tag -a v1.9.0 -m "NextArch 1.9.0: adaptable folders + stronger evals"
git push origin v1.9.0
```

Install for users:

```bash
npx skills add sameer2006-s/NextArch --skill nextarch -y
```

## Smoke test

```bash
npx skills add . --list
# → nextarch

npx skills add . --skill nextarch
```

## Breaking changes in 1.7.0

| Before | After |
|--------|--------|
| Repo `nextjs-feature-arch-skill` | **`NextArch`** |
| Skill id `nextjs-feature-architecture` | **`nextarch`** |
| Install | `npx skills add sameer2006-s/NextArch --skill nextarch -y` |

GitHub redirects from the old repo name should still work for a transition period.

## skills.sh

Listing updates after public installs against [sameer2006-s/NextArch](https://github.com/sameer2006-s/NextArch). No separate upload step.
