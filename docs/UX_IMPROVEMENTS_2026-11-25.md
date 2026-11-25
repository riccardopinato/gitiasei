# Gitiasei / v0.2 — UX evaluation and next evidence-backed improvements

Date: 2026-11-25. These are **ranked opportunities**, not completed implementations.

| Priority | Improvement | Why / evidence | Acceptance |
| --- | --- | --- | --- |
| P0 | Proper, licensed in-game map instead of fictional SVG | Prototype map is deliberately schematic; real sourced map repository exists | Correct projection, zoom/pan, attribution, located pins, spoiler-safe filters, no inaccurate game positions |
| P0 | Replace demo reel items with licensed creator footage | Current reel is only illustrated, no video playback | Permission ledger + platform terms + media fallback + accessible controls + frame/size adaptation |
| P0 | Candidate editorial certification pipeline | 4,686 / 4,687 location records lack per-record source links | Batch evidence checklist: source, coordinate certainty, independent facts, copyright; promote only review-complete records |
| P1 | Saved/found UX for canonically identified records | User stable IDs now survive missing catalog snapshots, but current saved UI is primarily demo | Bookmarks and completion usable on admitted canonical items; export/import; migration tests |
| P1 | Search and filter performance | 4,687 candidate records and 8,960 staged records | 6 lazy shards, 16-row pages currently implemented; audit on mid-range Android and 320px viewport |
| P1 | Spoiler safety across all reading surfaces | Original details/map could reveal despite feed shield | Default on, official character previews shielded, lab requires opt-out, all concept surfaces masked |
| P1 | Real clip-to-map bidirectional link | Core product differentiation | Source-backed media + canonical location relation + selection sync, no auto-spoiler leakage |
| P1 | Offline research pack / stale-data indicators | Offline PWA cache currently precaches shell, research shards lazy | Define controlled offline packs with version/size and source freshness labels; no silent stale cache |
| P2 | Visual QA and haptics/animations | User values original premium mobile style | Design-repo-first variants, contrast, reduced motion, 320/360/390/480px visual evidence |
| P2 | Creator submissions and takedown workflow | Rights-safe scale beyond official media | Consent/attribution, review queue, no raw scraping of locked or nonlicensed video |

Current v0.2 implemented: source-backed official dossier, community lab with six lazily loaded groups, 13 official media source links, private optional download script, saved stable-ID preservation, first-party PWA layout with improved reel sizing, and Chrome DOM smoke in CI.

Current v0.2 **not** implemented: real map overlays, full native video player, 4,687 independent content certifications, 100% collectible truth, public deployment, permissioned media ingestion at scale.
