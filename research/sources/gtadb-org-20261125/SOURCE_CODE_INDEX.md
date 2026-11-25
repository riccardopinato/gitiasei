# Recovered open-source code index — 25 Nov 2026

**This is a snapshot of `gtadb.org` (https://github.com/rolux/gtadb.org), NOT `gtadb.io` (ChickenNest).** GTADb.io's private Nuxt/frontend source and database have not been acquired.

Source Git commit: `b6334a3e3386d028e8ffb4eab35b584bf588e59d`
Original code: MIT (see upstream/LICENSE).
Original data: CC BY 4.0 unless otherwise stated (see upstream/LICENSE-DATA).

## Code captured in this research-only branch

- `map/index.js` + `map/index.css` + `map/index.html`: interactive landmark frontend and map browsing.
- `map/api/api.py`: Flask API used by open-source mapping project; includes content/edit operations. Treat as reference only, never deploy as-is.
- `api/api.py`: open-source geographic services reference.
- `maps/maps.js`: viewport, zoom, tile selection, coordinate transforms and pan.
- `maps/ui.js`, `maps/maps.css`, `maps/ui.css`: map UI building blocks.
- `maps/maps3d.js`, `maps/maps3dflat.js`, `maps/tiles.py`: optional map rendering and tile tooling.
- `markers/index.js`, `markers/index.css`, `markers/index.html`: client-side marker collections, IndexedDB/local-first persistence, export/import and validation.
- `index.js`, `index.css`: source project entrypoint assets.
- `map/data/6/landmarks.json`: 4195 records in a positional-array structure; snapshot, not GTADb.io's database.

## Large resources left upstream (not copied)

- Map tile hierarchy: https://github.com/rolux/gtadb.org/tree/b6334a3e3386d028e8ffb4eab35b584bf588e59d/maps/tiles/6
- Landmark photographs: https://github.com/rolux/gtadb.org/tree/b6334a3e3386d028e8ffb4eab35b584bf588e59d/map/photos
- Full GitHub repository, including other games and utilities: https://github.com/rolux/gtadb.org/tree/b6334a3e3386d028e8ffb4eab35b584bf588e59d

These directories are sizeable; do not clone the entire repository into Gitiasei without a specific product need. Upstream's own README suggests sparse checkout.

## Adoption and operational limits

- Archive files are disconnected from production imports; current app behavior is unchanged.
- API modules may assume configuration and services that are not present in Gitiasei.
- Map media licenses and trademark/third-party artwork rights require individual checks.
- Data quality, canonical IDs, coordinate systems, deduplication and attribution need an adapter and tests before integration.
- No cross-device, visual/browser or runtime test of this external code was performed.
- Gitiasei's current architecture remains a dependency-free web/PWA prototype pending feature-specific integration.
