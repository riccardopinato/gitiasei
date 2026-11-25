# Follow-up source reconnaissance — Gitiasei

**Date:** 25 November 2026. **Status:** RESEARCH CANDIDATES. This document does not promote source records into the published catalog.

## Candidate 1 — SaveRift GTA VI game catalog
- Repository: https://github.com/SaveRift/SaveRift-Ecosystem
- Relevant documentation: `ecosystem/plugins/gta-vi/docs/CATALOG.md`
- Notice: `ecosystem/plugins/gta-vi/NOTICE` states Apache-2.0 for its code/catalog scaffold, with explicit separate copyright rights checks for third-party game resources.
- Inspectable entity files contain two names (`Jason Duval`, `Lucia Caminos`) and two broad named regions (`Vice City`, `Leonida`) with official Rockstar page citations. Those are official publicly described concepts, not new mapped pins.
- Rockstar direct corroboration: https://www.rockstargames.com/VI/only-in-leonida/jason and https://www.rockstargames.com/VI/only-in-leonida/vice-city .
- The larger native crosswalk contains many identifiers, but its own documentation warns they are often **technical observations, not verified spawnable vehicles or confirmed weapons**. Example: 353 distinct case-sensitive vehicle keys in two roles; the count is NOT 353 independently confirmed vehicle models.
- Decision: **DO NOT IMPORT** extracted game metadata or inflate gameplay-entity counts. The 4 official names are eligible for a separately sourced character/region index after canonical entity-type design and individual rights/editorial checks.

## Candidate 2 — Leonida Atlas
- Repository: https://github.com/navanem/gta6-leonida-atlas
- Reported 3,437 searchable public places and local-first atlas UI; site code AGPL-3.0.
- Own README states the pinned community location catalog is derived from GTADB/Map GTA contributors under CC BY 4.0.
- Decision: **DO NOT COUNT AS INDEPENDENT CORROBORATION** of existing GTADB locations. Research donor for UX, tracking and visual map quality only, after reviewing AGPL implications.

## Candidate 3 — Offmap Intel
- Repository: https://github.com/offmapintel/gta6-data
- Indexed claims: 55 trophies, 91 missions, 35 checklist requirements and 51 weapon references, with citations.
- README explicitly states **reuse terms are not yet set**.
- Decision: research for source URLs/crosschecks only; do not copy the database without a clear licence.

## Candidate 4 — GTA6Data / standalone atlas clones
- https://gta6data.org/ (public web site, 64 vehicles, 78 weapons, 28 locations claimed in publicly indexed page).
- https://github.com/jerrysf/gta6-atlas (database template and candidate facts, no LICENSE found during targeted repository lookup).
- Decision: do not bulk import or assume permissions without per-source rights. Use only as candidate discovery/verification signals.

## Primary independent evidence actually admitted to canonical report
- https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available
- The release date (`2026-11-19`) and PS5 / Xbox Series X|S availability are supported by Rockstar's own announcement. Two `gtasix` fact IDs were independently checked against that public primary source and marked `PRIMARY_SOURCE_CHECKED`; **they remain HOLD** for app-publication.

## Next-source import contract
A new source is admitted only with its exact revision, explicit compatible permissions, entity grain/schema, source-lineage root, and a dedup crosswalk against the existing 8,960 staged IDs. Distinguish identical authoritative source facts from independent verification. Do not import game-media binaries, private server data, unofficial leaks, or assets whose rights do not follow the software license.
