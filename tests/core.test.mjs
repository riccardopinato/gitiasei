import test from "node:test";
import assert from "node:assert/strict";
import { discoveries, catalogMeta } from "../src/catalog.mjs";
import { filterDiscoveries, sanitizePreferences, toggleId, validateCatalog } from "../src/core.mjs";

test("catalog demo is structurally safe, unique and explicitly non-factual", () => {
  assert.deepEqual(validateCatalog(discoveries), []);
  assert.equal(catalogMeta.editorialState, "DEMO_ONLY");
  assert.ok(discoveries.every((d) => d.status === "DEMO" && !d.media && !d.source));
});

test("category, search and favorites are independent filters", () => {
  assert.equal(filterDiscoveries(discoveries, { category: "wildlife" }).length, 1);
  assert.equal(filterDiscoveries(discoveries, { search: "COAST" }).length, 1);
  assert.equal(filterDiscoveries(discoveries, { savedOnly: true, saved: ["concept-001"] }).length, 1);
  assert.equal(filterDiscoveries(discoveries, { savedOnly: true }).length, 0);
});

test("save and found state can be undone without affecting the catalog", () => {
  assert.deepEqual(toggleId([], "concept-001"), ["concept-001"]);
  assert.deepEqual(toggleId(["concept-001"], "concept-001"), []);
  assert.equal(discoveries.length, 5);
});

test("stored user state rejects unknown ids, duplicates and malformed shapes", () => {
  assert.deepEqual(sanitizePreferences({ saved: ["concept-001", "concept-001", "bad"], found: null }, discoveries.map((d) => d.id)), {
    saved: ["concept-001"], found: [], hideSpoilers: true
  });
});

test("unlicensed/unsourced published clips cannot pass catalog validation", () => {
  const invalid = [{ ...discoveries[0], status: "PUBLISHED" }];
  assert.match(validateCatalog(invalid).join(" "), /without verified provenance/);
});

test("saved or found stable IDs survive temporary removal from source catalog", () => {
  assert.deepEqual(sanitizePreferences({
    saved:["concept-999","gta6:location:vehicle-001","official:character:jason-duval"],
    found:["concept-003","gta6:landmark:l123"],hideSpoilers:false
  },discoveries.map((d)=>d.id)), {
    saved:["concept-999","gta6:location:vehicle-001","official:character:jason-duval"],
    found:["concept-003","gta6:landmark:l123"],hideSpoilers:false
  });
});
test("NaN and Infinity are rejected as map coordinates", () => {
  assert.match(validateCatalog([{...discoveries[0],map:{x:NaN,y:42}}]).join(" "),/invalid concept coordinates/);
  assert.match(validateCatalog([{...discoveries[0],map:{x:42,y:Infinity}}]).join(" "),/invalid concept coordinates/);
});
