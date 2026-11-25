import test from "node:test";
import assert from "node:assert/strict";
import { readPinnedSources } from "../scripts/build-canonical.mjs";
import { buildCanonical, normalizeName, rankKind, SOURCE_REVISIONS } from "../src/canonical.mjs";

const inputs = await readPinnedSources();
const { records, reviewMatches, report } = buildCanonical(inputs);
const byId = new Map(records.map((r) => [r.id, r]));

test("canonical catalog imports all 4,687 locations without losing source IDs", () => {
  assert.equal(records.length, 4195 + 4687 + 78);
  assert.equal(report.totalCanonical, 8960);
  assert.equal(new Set(records.map((r) => r.id)).size, records.length);
  assert.equal(report.existingPlaceIdsJoined, 1021);
  assert.equal(report.existingMarkerIdsJoined, 798);
  assert.equal(report.locationsImportedToStaging, 4687);
  assert.equal(report.factsImportedToStaging, 78);
});

test("source-derived aliases never count as independent factual corroboration", () => {
  const record = byId.get("gta6:landmark:l2872");
  assert.ok(record, "canonical original landmark exists");
  assert.equal(record.provenance.filter((s) => s.source === "gta6maps").length, 1);
  assert.equal(record.provenance.find((s) => s.source === "gta6maps").root, "gtadb.org");
  assert.equal(record.evidenceStatus, "SOURCE_ONLY");
  assert.ok([...records.filter((r) => r.type === "landmark")].every((r) => r.evidenceStatus === "SOURCE_ONLY"));
});

test("all 8,960 records are HELD; reviewed source fact labels are not publication approval", () => {
  assert.equal(report.productionPublished, 0);
  assert.ok(records.every((r) => r.publicationStatus === "HOLD"));
  assert.equal(report.primaryCheckedFacts, 2);
  assert.equal(byId.get("gta6:fact:releaseDate").evidenceStatus, "PRIMARY_SOURCE_CHECKED");
  assert.equal(byId.get("gta6:fact:platforms").evidenceStatus, "PRIMARY_SOURCE_CHECKED");
  assert.equal(byId.get("gta6:fact:unlockRule").publicationStatus, "HOLD");
});

test("same-name suggestions never merge across coordinate projections", () => {
  assert.ok(reviewMatches.length > 0);
  assert.ok(reviewMatches.every((r) => r.merge === false && r.candidateId !== r.existingId));
  assert.ok(reviewMatches.every((r) => r.reason === "SAME_NORMALIZED_NAME_ONLY" ||
    r.reason === "SAME_NAME_WITHIN_SOURCE"));
  assert.equal(report.explicitRelationsNotMerged, 2);
  for (const relation of inputs.places.filter((p) => p.same_as)) {
    const item = byId.get("gta6:location:" + relation.same_as);
    assert.ok(item.relations.some((x) => x.id === "gta6:landmark:" + relation.id.toLowerCase() && !x.merge));
  }
});

test("priority ordering is deterministic and domain-specialized", () => {
  assert.equal(rankKind("meteorite"), "curiosities");
  assert.equal(rankKind("building"), "places");
  assert.equal(rankKind("vehicle"), "vehicles");
  assert.equal(rankKind("fishing"), "activities");
  assert.equal(rankKind("card"), "collectibles");
  assert.equal(rankKind("unknown-category"), "reference");
  assert.equal(normalizeName("  ÉAST--COAST! "), "east coast");
  assert.ok(records.every((r, i) => i === 0 || records[i-1].reviewPriority <= r.reviewPriority));
  assert.equal(records.filter((r) => r.type === "location").length, 4687);
});

test("source content changes cannot retain old claims of primary verification", () => {
  const wrong = structuredClone(inputs);
  wrong.facts.find((f) => f.key === "releaseDate").value = "2030-01-01";
  assert.throws(() => buildCanonical(wrong), /primary verification stale/);
});

test("source ID reuse with conflicting titles does not silently overwrite user identity", () => {
  const wrong = structuredClone(inputs);
  wrong.locations.push({ ...wrong.locations[0], name: "SYNTHETIC CONFLICT" });
  assert.throws(() => buildCanonical(wrong), /duplicate location/);
});

test("source pinning and report are deterministic, without network calls", () => {
  assert.match(SOURCE_REVISIONS.openmap, /^[0-9a-f]{40}$/);
  const second = buildCanonical(inputs);
  assert.deepEqual(second.report, report);
  assert.deepEqual(second.reviewMatches, reviewMatches);
  assert.deepEqual(second.records.map((r) => r.id), records.map((r) => r.id));
});
