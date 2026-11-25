# GTADb functional reference study — Gitiasei (2026-11-25)

**Mode:** public-pages functional study, not a copy of GTADb source, compiled JavaScript, HTML/CSS, dataset, assets, imagery or backend.
**Product authority:** Gitiasei Product Bible v0.1. **Study origin:** publicly indexed pages linked below. No Chrome DevTools remote session was accessed; internal APIs, private source and full response payloads were not inspected.

## Rights and evidence boundary

GTADb Terms of Use effective 2026-11-08 state that ChickenNest owns the site's design, writings and assembled data unless otherwise specified. Substantial database copying or automatic collection to republish requires written permission:
https://gtadb.io/terms

GTADb credits *some third-party map elements* under CC BY 4.0, but this does not grant blanket rights to all map assets, data, icons, tiles or Rockstar content. For every candidate asset, verify licensor, exact license coverage, attribution, modifications, downstream requirements and source authenticity before reuse.

No automated crawl, mass download, copied data records, asset import or production API integration has been performed.

## Public functional inventory

| GTADb public route | Observed functional shape | Independent Gitiasei implementation direction |
| --- | --- | --- |
| https://gtadb.io/gta-6 | Landing page + domain section directory | Own navigation taxonomy and content entrypoints |
| https://gtadb.io/gta-6/vehicles | Entity listing, class filter, sortable attributes, per-vehicle detail | Vehicle collection with verifiable facts and independent metadata |
| https://gtadb.io/gta-6/missions | Story/side missions, search and ordering, per-mission pages | Mission index and source-backed relations |
| https://gtadb.io/gta-6/weapons | Category listing, per-weapon attributes, comparison views | Typed weapons catalog, no borrowed stat values |
| https://gtadb.io/gta-6/characters | Character entries with roles and relationships | Original character records and links |
| https://gtadb.io/gta-6/animals | Species grouped by class, detailed pages | Species catalog with verification status |
| https://gtadb.io/gta-6/guides | Editorial guides and classifications | Independently authored guides |
| https://gtadb.io/gta-6/videos | Official-video listing, per-video pages | Permitted official embeds with attribution and terms |
| https://gtadb.io/gta-6/map | Layered interactive map, markers, category counts, found progress | Rights-verified tile/map engine with original curated pins |
| https://gtadb.io/tools/checklists/gta-6 | Trackable completion checklist | Local-first progress on canonical IDs |

**Observed UI patterns, not copied code:** navigable collection → filter/search/sort → independently addressable detail → related records → contextual map / checklist. GTADb's aggregate numbers, category counts and entries are not imported, and should not be reproduced here as live Gitiasei data.

## Recommended independent entity model (design proposal, not implemented)

- `Discovery`: stable id, name, type, editorialStatus, verification timestamps, spoiler level, related IDs.
- `Evidence`: source URL, author, capture/review timestamp, rights basis, attribution requirements, use restrictions, takedown status.
- `Media`: embed provider, allowed embed URL, associated evidence ID, playback and accessibility metadata.
- `Location`: independent source/coordinate system, map license, precision, verified point and confidence.
- `CollectionRecord`: stable identity, record type (vehicle/mission/weapon/etc), typed source-backed fields; canonical facts separate from editorial descriptions.
- `UserProgress`: saved/found values keyed to stable IDs, preserved across withdrawn or replaced catalog records.

**Relationships:** one discovery can have multiple evidence clips; one location can link to many discoveries; collection records can be related to discoveries and each other without duplicating canonical identity.

## Implemented in this revision

- Reusable **original directory navigation** in Discover with 13 sections.
- Search filters directory sections and existing demo files.
- Clickable individual section views and back navigation.
- Explicit empty states for every unpopulated category; concept map and existing local progress link to their actual UI.
- Three new Node tests for module data validity and search.
- No external data was imported. Five existing discovery fixtures remain clearly labeled `DEMO`.

## Next gates

1. Fix P1 frontend issues from 2026-11-25 audit (scroll snapping, spoiler shielding across all surfaces, stable local references, UI rerender).
2. Verify live browser render/responsiveness/accessibility at 320, 360, 390 and 480px, desktop, with screenshot evidence.
3. Add one original `CollectionRecord` implementation with validated schema and source evidence before expanding every type.
4. Add real media only with rights-reviewed permission/terms, attribution and working fallback.
5. Add real map only with independently verified coordinate rights and accurate pins.
6. Public deploy and SEO indexing require separate release authorization.

## Limitations

Public search/indexed pages do not provide authoritative visibility into proprietary backend architecture, source maps, complete CSS or internal APIs. Site usage can change; reverify sources at integration time. No claims of feature parity, production content or full reverse engineering are made.
