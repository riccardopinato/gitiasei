// Design-only illustrative entries. NOT confirmed GTA VI discoveries.
// Production ingestion must require provenance, permission and editorial review.
export const categories = Object.freeze([
  { id: "all", label: "ALL SIGNALS", icon: "◉" },
  { id: "mysteries", label: "MYSTERIES", icon: "✦" },
  { id: "details", label: "DETAILS", icon: "⌁" },
  { id: "wildlife", label: "WILDLIFE", icon: "◇" },
  { id: "vehicles", label: "RIDES", icon: "↗" },
  { id: "places", label: "PLACES", icon: "⌖" }
]);

export const discoveries = Object.freeze([
  {
    id: "concept-001",
    title: "THE NIGHT SHIFT",
    eyebrow: "01 / CITY SIGNAL",
    summary: "A concept card for the strange interactions players might document after dark. No discovery is asserted.",
    category: "mysteries",
    area: "CITY CENTER / CONCEPT",
    location: "Not geolocated",
    art: "midnight",
    tags: ["NPC WATCH", "NIGHTLIFE"],
    spoiler: false,
    map: { x: 53, y: 49 },
    status: "DEMO",
    source: null,
    license: null,
    media: null
  },
  {
    id: "concept-002",
    title: "COASTLINE STATIC",
    eyebrow: "02 / COAST WATCH",
    summary: "Editorial placeholder for a community-submitted coastal mystery. Replace with a sourced clip before launch.",
    category: "places",
    area: "EAST COAST / CONCEPT",
    location: "Not geolocated",
    art: "sunset",
    tags: ["LOCATION", "HIDDEN SPOT"],
    spoiler: false,
    map: { x: 73, y: 33 },
    status: "DEMO",
    source: null,
    license: null,
    media: null
  },
  {
    id: "concept-003",
    title: "GATOR TERRITORY",
    eyebrow: "03 / FIELD NOTE",
    summary: "Illustrative wildlife-category entry only. It does not claim a particular animal interaction occurs in GTA VI.",
    category: "wildlife",
    area: "WETLANDS / CONCEPT",
    location: "Not geolocated",
    art: "wetlands",
    tags: ["WILDLIFE", "ENCOUNTER"],
    spoiler: false,
    map: { x: 29, y: 62 },
    status: "DEMO",
    source: null,
    license: null,
    media: null
  },
  {
    id: "concept-004",
    title: "THE GETAWAY FILE",
    eyebrow: "04 / ROAD WATCH",
    summary: "An example of how a rare-vehicle finding could link a short clip to a location and a personal checklist.",
    category: "vehicles",
    area: "SOUTHBOUND / CONCEPT",
    location: "Not geolocated",
    art: "highway",
    tags: ["VEHICLE", "RACING"],
    spoiler: true,
    map: { x: 61, y: 77 },
    status: "DEMO",
    source: null,
    license: null,
    media: null
  },
  {
    id: "concept-005",
    title: "MICRO DETAILS",
    eyebrow: "05 / CLOSE LOOK",
    summary: "A prototype entry for tiny environmental details noticed by players. Authentic footage still required.",
    category: "details",
    area: "DOWNTOWN / CONCEPT",
    location: "Not geolocated",
    art: "palm",
    tags: ["REALISM", "WORLD DETAIL"],
    spoiler: false,
    map: { x: 56, y: 37 },
    status: "DEMO",
    source: null,
    license: null,
    media: null
  }
]);

export const catalogMeta = Object.freeze({
  formatVersion: 1,
  contentVersion: "concept-1",
  editorialState: "DEMO_ONLY",
  referenceWorld: "Fictional schematic design — not an official game map"
});
