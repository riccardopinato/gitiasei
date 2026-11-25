import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const base = read("research/sources/gtadb-org-20261125/upstream/map/data/6/landmarks.json");
const source = "research/sources/gta6-multisource-20261125/";
const locations = read(source + "fbritoferreira/public/data/locations.json");
const places = read(source + "fbritoferreira/public/data/places.json");
const markers = read(source + "duanhesen/data/gta-6-markers.json").markers;
const facts = read(source + "zeshutmax/data/gta6-facts.json").facts;
const manifest = read(source + "SOURCE_MANIFEST.json");

test("pinned multi-source counts and canonical IDs are deterministic", () => {
  assert.equal(Object.keys(base).length, 4195);
  assert.equal(places.length, 1021);
  assert.equal(locations.length, 4687);
  assert.equal(markers.length, 798);
  assert.equal(facts.length, 78);
  assert.equal(new Set(locations.map((x) => x.id)).size, locations.length);
  assert.deepEqual([...new Set(manifest.sources.map((x) => x.slug))].length, 3);
});

test("derived map sources do not get counted as new independent landmarks", () => {
  const ids = new Set(Object.keys(base));
  assert.ok(places.every((x) => ids.has(x.id)));
  assert.ok(markers.every((x) => ids.has(x.id.replace(/^lm-/i, "").toUpperCase())));
  assert.ok(locations.every((x) => !ids.has(x.id)));
});

test("candidate QA explicitly holds uncorroborated location records", () => {
  assert.equal(locations.filter((x) => x.confidence === "community").length, 3097);
  assert.equal(locations.filter((x) => !x.confidence).length, 1590);
  assert.equal(locations.filter((x) => Array.isArray(x.source_urls) && x.source_urls.length > 0).length, 1);
  assert.equal(manifest.numerical_reconciliation.guaranteed_new_unique_publications, 0);
  assert.equal(manifest.editorial_decision, "HOLD_ALL_NEW_RECORDS");
});

test("fact labels remain provenance labels, not independently certified truths", () => {
  assert.equal(facts.filter((x) => x.status === "confirmed").length, 37);
  assert.equal(facts.filter((x) => x.status === "reported").length, 38);
  assert.equal(facts.filter((x) => x.status === "not-announced").length, 3);
  assert.equal(facts.filter((x) => x.sources?.length > 0).length, 76);
});
