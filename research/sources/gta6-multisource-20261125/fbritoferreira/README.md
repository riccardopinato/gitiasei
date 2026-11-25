# Open GTA 6 Map

An open-source map of Leonida from GTA 6: base map tiles, collectibles, activities, services, named places with their
real-life counterparts, and screenshots. Everything is plain JSON and images, hosted on GitHub Pages, so you can use it
in your own map, app or tool.

- Map: https://fbritoferreira.github.io/gta6/
- Index of every hosted file: https://fbritoferreira.github.io/gta6/assets.json

No ads and no paywall. If the map helps you, you can [buy me a coffee](https://buymeacoffee.com/fbritoferreira) to cover hosting.

Search matches every word you type against a location's name, type, category, district, area, real-world
counterpart and description, ignoring case and accents (and, when nothing matches as typed, allowing a typo or two), so "ritz" finds the hotels based on Ritz-Carlton buildings and
"card key lento" finds the cards in Key Lento. Results come in three groups: districts, categories (such as "WAiNK
scans") and locations. Press `/` anywhere to jump to the box. Up and down move through the results, Enter picks one and Escape clears the box. Picking a category
shows only that category. Picking a district, or clicking one on the map, shows only the locations inside it; the
"Only <district>" chip in the panel counts how many of its collectibles and activities you have found ("Only Hamlet, 12
of 71 found") and shows everything again when clicked. A `?district=` link opens zoomed to that district.

The pins are drawn on a canvas, so the panel's **In view** section lists the locations on screen as buttons, nearest
the centre first. With a keyboard or screen reader, open it, pick a location, and focus moves into its popup.

There are list pages too: one per category (`/c/meteorites/`), one per district (`/d/hamlet/`) and an index of both
([`/browse/`](https://fbritoferreira.github.io/gta6/browse/), linked from the panel), each listing every location with where it
is (`scripts/export-hubs.ts`). They link every location page, so none is reachable only through the sitemap.

Locations also have their own pages for search engines, at `https://fbritoferreira.github.io/gta6/l/<id>/` (for example
[`/l/hidden-package-001/`](https://fbritoferreira.github.io/gta6/l/hidden-package-001/)), listed in
[`sitemap.xml`](https://fbritoferreira.github.io/gta6/sitemap.xml). A missing `/l/<id>/` page forwards to the map at that id; any other
missing page shows a short "not on the map" page (`404.html`). `scripts/export-pages.ts` writes them during the
build: plain HTML with the name, district, screenshot, real-life counterpart, nearby locations and an "Open on the
map" link. Only locations with a description or screenshot, and places with a real-world address, get a page.

The map keeps working with no signal. After one visit, `public/sw.js` (a service worker) answers from the browser's
cache when the network doesn't: the page and data are fetched fresh when online, and tiles, pins and screenshots are
kept once viewed (shown from the cache, then refreshed in the background, so a replaced screenshot shows
on the next visit). Areas you have never zoomed into stay blank offline. It only runs in the built site, not in
`pnpm dev`.

Collectible and activity popups have **Next nearby**: it jumps to the closest one of the same category you
haven't marked found, within the current district filter.

"Found" progress is kept in the browser. **Share progress** copies a link (`?progress=...`, one character per 6 trackable locations, about 300 today) that
carries it to another device: opening the link asks whether to replace that device's progress or add to it. The link
holds one bit per trackable location in data order, plus how many it covers and a checksum of those, so it keeps
working after a data sync adds locations (they start unfound); if earlier entries changed, it is reported as outdated
instead of marking the wrong locations (`src/progress.ts`). There are no accounts and
nothing is sent to a server.

## Use the data

Every file in [`public/`](public) is published at the same path on the site, so the URL for any file is the site
address plus its path:

| What               | URL                                                                            |
| ------------------ | ------------------------------------------------------------------------------ |
| Locations          | `https://fbritoferreira.github.io/gta6/data/locations.json`                    |
| Places             | `https://fbritoferreira.github.io/gta6/data/places.json`                       |
| Categories         | `https://fbritoferreira.github.io/gta6/data/categories.json`                   |
| District outlines  | `https://fbritoferreira.github.io/gta6/data/districts.json`                    |
| Land (coastline)   | `https://fbritoferreira.github.io/gta6/data/land.json`                         |
| Surface            | `https://fbritoferreira.github.io/gta6/data/surface.json`                      |
| Roads              | `https://fbritoferreira.github.io/gta6/data/roads.json`                        |
| Railways           | `https://fbritoferreira.github.io/gta6/data/rails.json`                        |
| Route shields      | `https://fbritoferreira.github.io/gta6/data/routes.json`                       |
| Base map tiles     | `https://fbritoferreira.github.io/gta6/tiles/{night,day}/{z}/{z},{y},{x}.webp` |
| Pins               | `https://fbritoferreira.github.io/gta6/icons/pins/{type}.webp`                 |
| Screenshots        | `https://fbritoferreira.github.io/gta6/screenshots/{id}.webp`                  |
| Everything, listed | `https://fbritoferreira.github.io/gta6/assets.json`                            |

GitHub Pages sends `Access-Control-Allow-Origin: *`, so you can `fetch` these from any site. With Leaflet:

```js
const BASE = "https://fbritoferreira.github.io/gta6";
const map = L.map("map", { crs: L.CRS.Simple, minZoom: 0, maxZoom: 7 });
L.tileLayer(`${BASE}/tiles/night/{z}/{z},{y},{x}.webp`, { tileSize: 256, maxNativeZoom: 5, noWrap: true }).addTo(map);

const locations = await fetch(`${BASE}/data/locations.json`).then((r) => r.json());
for (const l of locations) L.marker([-l.y, l.x]).bindPopup(l.name).addTo(map);
```

Credit "Open GTA 6 Map" with a link to this repository; see [License](#license).

### Maps for gta.wiki

Every build also exports the collectibles and activities as [gta.wiki](https://gta.wiki/) interactive maps, in the
same format as the wiki's own maps (for example `Map:GTA Vice City: Hidden Packages`): one page per category, popups
reading `Location: [[District]]`, and one shared map image.

- `https://fbritoferreira.github.io/gta6/wiki/index.json`: the page titles and where to get each one
- `https://fbritoferreira.github.io/gta6/wiki/maps/<kind>.json`: the JSON for a `Map:GTA VI: ...` page
- `https://fbritoferreira.github.io/gta6/wiki/Leonida-GTAVI-Map.jpg`: the map image, uploaded as
  `File:Leonida-GTAVI-Map.jpg`

`scripts/export-wiki.ts` builds them; Places (shops, food, transport) are left out, as the wiki maps only collectibles
and activities. `Map:GTA VI: 100% Completion` combines the completion items into one map with a layer each.

After every deploy to `main`, `scripts/sync-wiki.ts` (`pnpm sync:wiki`) logs in to the
[MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) with a bot password and edits only the map pages and
image that changed. To enable it:

1. On gta.wiki, open [Special:BotPasswords](https://gta.wiki/w/Special:BotPasswords), create a bot (for example
   `map-sync`) with the grants "Edit existing pages", "Create, edit, and move pages", "Upload new files" and "Upload,
   replace, and move files".
2. Save the login and password as repository secrets: `gh secret set WIKI_BOT_USER` (for example
   `Fbritoferreira@map-sync`) and `gh secret set WIKI_BOT_PASSWORD`.

Without the secrets the step skips. `WIKI_DRY_RUN=1 pnpm sync:wiki` (after `pnpm build`) shows what it would change
without logging in.

## Embed the map

Click **Embed map** on the map to get an `<iframe>` with your current base map, categories and view, or build the URL
yourself:

```html
<iframe
  src="https://fbritoferreira.github.io/gta6/?embed=1"
  width="100%"
  height="600"
  style="border:0"
  loading="lazy"
  title="GTA 6 map"
  allowfullscreen
></iframe>
```

| Parameter   | Example                 | Effect                                                                                                                                                               |
| ----------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `embed`     | `embed=1`               | Compact mode: filters start closed, with an "Open full map" button                                                                                                   |
| `style`     | `style=day`             | Base map, `night` (default) or `day`                                                                                                                                 |
| `kinds`     | `kinds=card,package`    | Categories to show (keys from `data/categories.json`). Defaults to everything except Places. `default,hotel` adds to the defaults, `default,-card` removes from them |
| `view`      | `view=3/500/480`        | Zoom, then x and y in map units                                                                                                                                      |
| `id`        | `id=hidden-package-001` | Open one location and zoom to it                                                                                                                                     |
| `district`  | `district=Hamlet`       | Show only the locations inside one district                                                                                                                          |
| `labels`    | `labels=0`              | Hide district names                                                                                                                                                  |
| `hidefound` | `hidefound=1`           | Hide collectibles the viewer has marked as found                                                                                                                     |

Keep the credit in the corner of the map visible; CC BY 4.0 requires it.

## The data

Everything here lives in `public/` and is served as is.

- `tiles/night/` and `tiles/day/`: the two base maps (Night: navy water and slate land; Day: turquoise water and sand
  land) at zooms 0 to 5, named `<z>/<z>,<y>,<x>.webp`. Each tile is a 1024 px image shown in a 256 px slot
  (`tileSize: 256`), so it stays sharp up to zoom 7 and on high-density screens. They are drawn from the data below by
  the pipeline in `scripts/tiles/` (see its README). At zoom 0 the map is 1024 units square
  (Leaflet `CRS.Simple`, latitude = -y).
- `data/locations.json`: collectibles, activities and services. `kind` is the map category, `type` the label shown,
  `x`/`y` map units, `screenshot` a path in `screenshots/` or null.
- `data/places.json`: named places with their real-life counterparts (`real_life`) and the area they sit in. A place
  that is also in `locations.json` (same name within 1 map unit; same category at the very same coordinates; or
  same category within 0.5 units and sharing a word, like "Marina" by "Peacock Bay Marina") is shown once. When the
  names don't show it, give the place `"same_as": "<location id>"` ("Watkins Auto Parts" is Moses's shop). The map
  merges these when it loads (`src/merge.ts`), and the place's old `?id=` and `/l/<id>/` links lead to the location.
- `data/categories.json`: every `kind` with its name, colour, icon (an emoji glyph), group, and whether players can mark
  it as found.
- `pnpm validate` also lists possible duplicates to check by hand (same name close together, or two entries at the
  same coordinates); they are notes, not errors, since some are real pairs.
- `data/removed.json`: ids taken out on purpose (duplicates, things not in the game), each with a reason. The data
  sync never adds them back, and `pnpm build` fails if one reappears. To remove a location, delete its entry and list
  its id here.
- `data/labels.json`: district names and where they sit.
- `data/districts.json`: approximate district outlines, generated from `places.json` by `pnpm districts` (part of
  `pnpm build`). There is no official boundary data; outlines sharpen as more places get an `area`. Each district is
  clipped to `land.json`, so outlines stop at the coast.
- `data/land.json`: the land as polygons in map units (`[[[x, y], ...], ...]` per polygon, outer ring then holes for
  lakes): the mainland, islands and keys, traced from Rockstar's printable Leonida map.
- `data/surface.json`: GeoJSON polygons in map units, each with a `layer`: `shallow` (shallow water along the coasts),
  `park`, `urban` (built-up ground), `paved` (runways), `building` and `sand`.
- `data/roads.json`: GeoJSON lines in map units, every road with its `kind`: `highway`, `main`, `street` or `minor`
  (country roads and tracks).
- `data/rails.json`: GeoJSON lines in map units, the railways.
- `data/routes.json`: the highway route shields on Rockstar's printable map: `ref` (`I-97`, `US-35`, `SR-1A`, `CR-62`...),
  `kind` (`interstate`, `us`, `state`, `toll` or `county`) and `x`/`y` in map units. The map has no street names, so
  there are none here.
- `icons/pins/<type>.webp`: the map pins, one per location type, where the type is the location's `id` without its
  number (`bank-001` uses `bank.webp`). A location filed under another category than its id type usually is (a card numbered `hidden-package-001`) uses its category's pin instead. Pins are 56×64 with the tail tip at the bottom centre. List every pin in
  `icons/pins/index.json`. Most are hand-drawn; the ones listed in `scripts/make-pins.ts` (meteorite, Ahol street art, random event,
  landmark, police, fire station, hospital, public transport, message in a bottle, cinema) are drawn in the same style
  by `pnpm pins` with [Lucide](https://lucide.dev) glyphs. To add a type, add a line there and run `pnpm pins`.
- `icons/<kind>.svg`: fallback icons for categories without a pin, from [Lucide](https://lucide.dev) (ISC, see
  `icons/LICENSE`). A kind with neither falls back to its emoji.
- `screenshots/`: one image per location that has one, named after the location's `id`.

### Coordinates

Game coordinates have 0,0 at the map's centre and span 32,768 units. To get map units:

```
x = (gx + 16384) / 32
y = (16384 - gy) / 32
```

## Develop

Needs Node 24.2 or later and pnpm.

```sh
pnpm install
pnpm dev          # map at http://localhost:5173, reloads as you edit
pnpm build        # regenerate districts, validate data, type-check, bundle into dist/
pnpm preview      # serve dist/ the way GitHub Pages will
pnpm test         # unit tests (Vitest)
pnpm lint         # ESLint
pnpm format       # Prettier
```

Open the built site through `pnpm preview`, not by double-clicking `dist/index.html`: browsers block module scripts
and `fetch` on `file://` pages.

```
public/            served as is: data/, tiles/, icons/, screenshots/, sw.js
src/               the map app (Solid 2 + Leaflet)
  map.ts           the Leaflet map, drawn on one canvas, driven imperatively
  state.ts         shared state: URL-backed filters, found progress, panel
  url.ts           reading and writing the query string
  data.ts          loading the data and picking each location's pin
  components/      the panel UI, one small component per file
scripts/           build-districts.ts, validate-data.ts (run by pnpm build)
.github/workflows/ Pages deploy with PR previews, and the CLA check
```

## Contribute

Corrections and new locations are welcome as pull requests.

- Before your first pull request can be merged, you sign the [Contributor License Agreement](CLA.md) by posting the
  comment the CLA bot asks for. It confirms you license your contribution under CC BY 4.0 and have the right to do so.
  You only sign once.
- Add or fix entries in the JSON under `public/data/`. Keep `id` unique across `locations.json` and `places.json`, use
  map units for `x`/`y`, and use a `kind` listed in `categories.json`.
- No Git needed for screenshots: on the map, open the pin and choose **Add a screenshot** (or **Replace screenshot**).
  It opens an issue with the location filled in; drag your image into it.
- Real Florida spots: a place's popup links its real-life counterpart to Google Maps, so you can compare it in
  Street View (to the exact spot when `real_life_lat`/`real_life_lng` are set, and straight into Street View when
  `real_life_street_view_pano` is). **Suggest a real-world spot** (or **Wrong real-world spot?**) opens an issue for the match; include how you
  know, such as a game screenshot or trailer timestamp next to a Street View link. Matches are reviewed before they go
  in.
- To add a screenshot yourself, put it in `public/screenshots/` named after the location's `id` (`.webp` preferred) and set
  `screenshot` to its path.
- To add a pin, put a 56×64 `.webp` in `public/icons/pins/` named after the location type and add the name to
  `index.json`.
- `pnpm build` checks that every JSON file parses, every screenshot file is used, every `screenshot` exists and is written as `screenshots/<file>` (no leading `/`), every `kind` is in `categories.json` (and none is `other` where the id type is usually filed elsewhere), no
  `id` repeats and the pin list matches the files. CI runs it, plus lint, format and tests, on every pull request, and
  checks every commit has a real author (not a placeholder such as a `.local` email).
- Each pull request gets a temporary preview on GitHub Pages under `pr-preview/pr-<number>/`. The link is posted on the
  PR and the preview is deleted when the PR closes. Merges to `main` deploy to the live site.

## License

[CC BY 4.0](LICENSE): use, share and adapt the data for anything, including commercially, as long as you credit this
project, link the license and say if you changed it. Suggested credit: "Map data from Open GTA 6 Map (fbritoferreira),
CC BY 4.0" with a link to this repository.

## Disclaimer

This is a fan project. It is not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Grand Theft Auto
and related names, the game's map art and in-game screenshots belong to their owners.
