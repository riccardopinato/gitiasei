# Gitiasei canonical catalog, staging v1

**Status:** source-pinned research catalog only. No externally sourced discoveries are injected into the PWA. **Factory baseline** `842dfa073451ec247308ccb4afb8ead5349bcbd4`, Master v27, draft Golden Versioned Editorial Catalog and Duplicate/Similarity Review.

## What is implemented
- `src/canonical.mjs` creates a canonical research collection from the full pinned baseline:
  `gtadb.org` 4,195 landmarks, 1,021 derivative Open GTA 6 Map places,
  798 derivative GTA6Maps markers, 4,687 additional Open GTA 6 Map candidate locations, 78 GTA VI HOW facts.
- Stable namespaces: `gta6:landmark:l<N>`, `gta6:location:<upstream-id>`, `gta6:fact:<key>`.
- Exact external IDs from sources sharing the GTADB namespace are merged into one canonical entity with separate provenance. They are NOT independent evidence.
- The 2 `same_as` links and matching titles across datasets generate review relationships, never auto-merge or delete.
- Keep GTA map and Open Map coordinates in separate named projections. No numerical comparison of unrelated `x/y`.
- Source status `confirmed`, `sourced` or `community` is never equated to independent confirmation.
- The 4,687 candidates are ranked in this order: **curiosities → places → vehicles → activities → collectibles → reference**. This is an editorial triage order, not a claim that these features are verified in-game.
- Two factual records have individually checked primary Rockstar Newswire evidence: `releaseDate` and `platforms` (2026-11-25); their **evidenceStatus** becomes `PRIMARY_SOURCE_CHECKED`, but **publicationStatus stays HOLD**.
- All 8,960 canonical entities remain `HOLD` until appropriate fact, editorial and media-rights checks. None is a live published clip.
- A strict Git-blob checksum pin for each upstream JSON file makes accidental edits or unexpected source upgrades fail closed.

## Reproducible commands

```sh
npm run canonical:build
npm run verify
```

The build writes:
- `artifacts/canonical/canonical.catalog.v1.json`: source-labeled canonical entities, provenance and review flags;
- `artifacts/canonical/canonical.report.v1.json`: counts, group sizes, evidence states and collisions;
- `artifacts/canonical/canonical.review-queue.v1.json`: 4,687 prioritized candidates and suspected duplicate edges.

Those files are ignored by Git, deliberately excluded from `dist/`, but uploaded by GitHub Actions as **gitiasei-canonical-research**. The PWA remains the original five clearly fictional demo cards; no unverified data appears in Home/Search/Map.

## Independent evidence: limited to 2 official factual checks

See `research/evidence/primary-fact-checks.json`:
- Official Rockstar release announcement (19 November 2026) verifies the release date.
- The same primary announcement names PlayStation 5 and Xbox Series X|S.
Official source: https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available

Other GTA VI HOW facts retain source claims without independent certification. The upstream mirror is not a distinct authority; mirror + origin publisher ≠ two sources.

## Admission gates before production

1. Independently verify relevant candidate locations/activities, coordinate accuracy and factual claims. Source rows often omit direct citations.
2. Use near-match review queue for editor decisions and saved canonical aliases; name-only matches and coordinate proximity do not automatically merge.
3. Check media rights and licensing per record; an open map data license does not cover Rockstar video/images.
4. Introduce published entities through a separate rights-and-editorial approved bundle, update the production catalog and ensure saved/found IDs survive changes.
5. Perform visual/mobile QA, privacy/spoiler checks and release gating. The existence of generated research JSON is NOT a published database.

## Source provenance

- `rolux/gtadb.org` MIT software / CC BY 4.0 data.
- `fbritoferreira/gta6` original data CC BY 4.0, excludes third-party Rockstar artwork.
- `duanhesen/gta6-leonida-map-data` CC BY 4.0, GTADB-derived IDs.
- `zeshutmax/gtasix-data` CC BY 4.0, GTA VI HOW mirror, not independent verification.

Current source snapshots remain in the two research PRs. This is a stacked PR and must not be directly merged to main ahead of required source/rights QA.
