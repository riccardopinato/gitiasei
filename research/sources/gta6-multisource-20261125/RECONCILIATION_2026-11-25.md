# Gitiasei — GTA VI multi-source acquisition and deduplication

**Date:** 2026-11-25. **Status:** RESEARCH ONLY, nothing new published in the PWA. Baseline is the already archived `rolux/gtadb.org` map snapshot containing **4,195** landmark IDs. All sources are pinned in `SOURCE_MANIFEST.json`.

## Source-by-source result

| Source | Records acquired | Already in gtadb by stable identity | Potentially new information | Decision |
| --- | ---: | ---: | --- | --- |
| Open GTA 6 Map — places | 1,021 | 1,021 | 0 new IDs; category, real-life context and editorial metadata may enrich a subset | DERIVATIVE / REVIEW |
| Open GTA 6 Map — locations | 4,687 | 0 IDs | 4,687 distinct candidate IDs; not established as distinct physical locations | HOLD |
| GTA6Maps — atlas markers | 798 | 798 | Category/region/classification; not independent verification | DERIVATIVE / REVIEW |
| GTA VI HOW — facts | 78 | Different domain (facts, not landmarks) | 37 confirmed by source, 38 reported, 3 not announced | HOLD / REVIEW |

**Do NOT sum raw source counts to claim net new unique discoveries.** At this step there are **zero newly verified or published Gitiasei records**.

## Important quality findings

- Of the 4,687 additional `locations.json` rows, **4,687 IDs are unique inside that file**, and all have `x/y` map coordinates in their source's own projection.
- **3,097** rows declare `confidence=community`; **1,590** do not carry an explicit confidence field.
- Only **1 of 4,687** location records has a nonempty `source_urls` field. This is a significant evidence gap and prevents mass certification. Other provenance might exist elsewhere, but was not demonstrated in these records.
- **189 normalized names** repeat within that candidate file, which is only a *potential* duplicate indicator. Many refer to legitimately distinct points.
- **101 normalized location names** also occur in the original 4,195 landmark records; *name equality alone does not prove duplicate identity*.
- The 798 GTA6Maps entries are all directly traceable to existing GTADB IDs via `lm-lNNNN → LNNNN`. They should not be treated as independent confirmation of 798 additional points.
- All 1,021 `places.json` records use existing GTADB landmark IDs, and 2 places explicitly point to location IDs through `same_as`. Their metadata can still enhance existing records once reconciled.
- Among 78 GTA VI HOW facts: 37 labeled confirmed, 38 reported, 3 not announced. **76** have source links; **36 of 37 confirmed** facts say `verifiedByUs=true`. The archive mirrors one publisher and does not constitute another independent review.

## Provenance and licensing

- `fbritoferreira/gta6` — CC BY 4.0 for original data/materials; expressly excludes Rockstar-owned imagery/art and certain third-party icon assets. Do not import screenshots.
- `duanhesen/gta6-leonida-map-data` — CC BY 4.0. Evidence derived from GTADB landmarks; preserve both upstream attribution chains where relevant.
- `zeshutmax/gtasix-data` — CC BY 4.0. This is a **mirror of GTA VI HOW**, not an independent second source.
- `GTA6Gang Open Data` declares 1,818 sourced records (vehicle/weapon/radio/store/animal tables) and CC BY 4.0, but direct JSON downloads were inaccessible through available browser tools; **not imported**, not counted.
- `Offmap Intel` exposes 55 trophies, 91 missions, 35 checklist items and 51 weapons but its README explicitly states *reuse terms are not set yet*: kept as a comparison link, **not copied**.

## Integration roadmap, not an implementation claim

1. Build a typed `source_record` staging layer with stable `source_id + external_id`, origin commit, copyright attribution, review status, raw payload hash and canonical mapping.
2. Apply exact-ID joins first; only propose similar-name/near-coordinate joins for editorial review. Keep canonical IDs immutable and honor explicit `same_as` references.
3. Recheck categories, source quality, source terms, official in-game location truth and image/media rights per field. Map coordinates in source projects use different coordinate systems.
4. Import verified rows into the editorial catalog using an idempotent diff, preserve existing user bookmarks and allow withdrawn records without deleting user progress.
5. Run per-source schema/dedup tests and then a separate runtime/visual QA on the actual Gitiasei app before any merge into `main`.

## Sources

- https://github.com/rolux/gtadb.org
- https://github.com/fbritoferreira/gta6
- https://github.com/duanhesen/gta6-leonida-map-data
- https://github.com/zeshutmax/gtasix-data
- https://gta6gang.com/pages/gta6-open-data.html

**Boundary:** Nothing from restricted game dumps, licensed video clips, commercial-site proprietary datasets or third-party artwork was imported in this research archive.
