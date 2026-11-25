# Native Gitiasei cartography — source and implementation record

Date: 25 November 2026
Factory baseline: `842dfa073451ec247308ccb4afb8ead5349bcbd4`, master v27, relevant editorial/versioned/duplicate and immutable artifact guidelines.

## User acceptance

Previous cross-site iframe showed a broken grey placeholder in standalone HTML. Requirement changed to **no dependency on a third-party map website or visible external map branding**. The independent Gitiasei Canvas map is self-hosted, served from first-party `public/data/` and rendered by custom `src/native-map.mjs`. The map DOM has no iframe and a first-party CSP blocks all remote resource requests.

## Source terms and attribution
- Community geometry origin: [Open GTA 6 Map](https://github.com/fbritoferreira/gta6), 2026-11-25 source commit `1a62727d4f4a44e2e3d6dfa62a0e2b80311e644a`.
- License on source project's *original contributed data*: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with possible individual third-party art exclusions.
- `public/data/map-land.v1.json` derives from `public/data/land.json` (upstream blob `4fedd0ea72f1448614fd5045e5bafe23c08f6fad`) and `labels.json`; simplifies geometry with Ramer–Douglas–Peucker tolerance ~0.23 map unit and rounds to 0.1 map unit. 762 land polygons, 10 labels, 19,954 retained polygon points.
- `public/data/map-roads.v1.json` derives from `public/data/roads.json` (upstream blob `64ea29c5d13db4cdf12be91f84ee1e62b204a1cc`), simplify/quantize; 8,881 lines. The selected geometry has no screenshots, artwork, or copied rendered tiles.
- `public/data/map-pins.v1.json` is deterministically generated from the previously imported source-pinned 4,687 candidates (the same original IDs used by canonical research). **All are UNVERIFIED**, and the map initially shields labels and markers when spoiler mode is on.
- Map units are a fan-community 1024-unit projection (`open-gta6-map:1024-units`), **not WGS84 GPS**, not confirmed Rockstar in-game coordinates. No incorrect real-world coordinate assumptions are made.
- Credit notice: map footer displays source name, open data terms and modification note. A disclosure contains clickable source and license links. The original renderer, controls, clustering, style and layout are Gitiasei-created. As long as the CC BY source data is reused, attribution cannot be removed.

## UX / performance
- Mouse/touch drag, pinch and scroll zoom, zoom +/- and reset, locally rendered coastlines, road hierarchy and regional labels.
- 4,687 local candidate pins, cluster aggregation and category filtering; local search, marker selection, saved/found linking.
- Map bundle is loaded only when its tab is shown, with a self-hosted offline PWA cache for map source assets. No external CDN, map provider API, remote font or cross-site iframe.
- All source URLs are legal/license disclosures or optional official content links elsewhere, never the provider of an interactive map.

## Validation
- Source SHA and deterministic source generation of research marker file.
- Tests reject duplicate, promoted, wrong-projection, malformed and non-finite positions.
- CI checks 4,687 generated pins against canonical research IDs, 762+ land polygons, 8,881 road geometries, links and attribution.
- Headless Chrome Map screen must load the *actual local geometry* and set `data-ready=true` and `data-source=self-hosted`.
- Device-level long pan/zoom fluidity and truly accurate in-game location verification remain **separate future gates**.
- No video media are bundled. The public image and creator rights from Rockstar are not conveyed by the geometry's CC BY data license.

## Known limitations

The map has not established factual validity for 4,687 markers. Accurate direct clip-to-pin navigation can only be enabled once the clip and its location have independent provenance. Geometry accuracy is community-authored, not official GTA VI cartography. The initial launcher view is intended as a visually usable atlas preview, not a comprehensive finished online navigation product.
