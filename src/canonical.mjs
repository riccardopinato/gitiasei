// Canonical GTA VI research catalog. This module is NOT imported by the PWA runtime.
// Never infer factual certainty from a source license, a duplicate, or a source's "confirmed" label.
export const SCHEMA_VERSION = 1;
export const SOURCE_REVISIONS = Object.freeze({
  gtadb: "b6334a3e3386d028e8ffb4eab35b584bf588e59d",
  openmap: "1a62727d4f4a44e2e3d6dfa62a0e2b80311e644a",
  gta6maps: "1c5977bb9c40401667a192f14239beebbde54211",
  gtasix: "f5b8bbbd905633a6375e442d5acf4d8ed8808ed2"
});

const KINDS = Object.freeze({
  curiosities: new Set(["other", "event", "meteorite", "streetart", "mural", "gang", "drone", "treasure", "bottle"]),
  vehicles: new Set(["vehicle", "race", "stunt", "towatm"]),
  activities: new Set(["waink", "fishing", "hunting", "arcade", "basejump", "range", "hoop", "smash", "leisure", "meditation"]),
  collectibles: new Set(["card", "package", "magazine", "bookswap", "safe", "knife"]),
  places: new Set(["building", "bridge", "civic", "store", "shop", "food", "transport", "bank", "safehouse", "fence"])
});
export const REVIEW_ORDER = Object.freeze(["curiosities", "places", "vehicles", "activities", "collectibles", "reference", "facts"]);
const HOLD = "HOLD";
const IDENTICAL = "EXACT_CANONICAL_ID";
const SRC = Object.freeze({
  gtadb: { root: "gtadb.org", license: "CC-BY-4.0", repository: "rolux/gtadb.org" },
  openmap: { root: "gtadb.org", license: "CC-BY-4.0", repository: "fbritoferreira/gta6" },
  gta6maps: { root: "gtadb.org", license: "CC-BY-4.0", repository: "duanhesen/gta6-leonida-map-data" },
  gtasix: { root: "gta-vi-how", license: "CC-BY-4.0", repository: "zeshutmax/gtasix-data" }
});
export function normalizeName(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
export function rankKind(value) {
  const kind = String(value ?? "").toLowerCase();
  for (const group of REVIEW_ORDER.slice(0, 5)) if (KINDS[group].has(kind)) return group;
  return "reference";
}
export function sourceReference(key, externalId, extra = {}) {
  return { source: key, externalId: String(externalId), root: SRC[key].root,
    license: SRC[key].license, repository: SRC[key].repository,
    revision: SOURCE_REVISIONS[key], ...extra };
}
function requireRecord(valid, label) { if (!valid) throw new Error("Canonical source invalid: " + label); }
function joinSource(record, source, externalId, extra = {}) {
  if (!record.provenance.some((p) => p.source === source && p.externalId === String(externalId))) {
    record.provenance.push(sourceReference(source, externalId, extra));
  }
}
function newRecord(id, type, name, group, geo, attributes = {}) {
  requireRecord(typeof name === "string" && name.trim().length > 0, "missing name " + id);
  return { id, type, title: name.trim(), group, reviewPriority: REVIEW_ORDER.indexOf(group) + 1,
    geographic: geo, attributes, publicationStatus: HOLD, evidenceStatus: "SOURCE_ONLY",
    provenance: [], relations: [] };
}
export function buildCanonical({ landmarks, places, locations, markers, facts, primaryChecks = [] }) {
  requireRecord(landmarks && typeof landmarks === "object" && !Array.isArray(landmarks), "landmarks object");
  requireRecord(Array.isArray(places) && Array.isArray(locations) &&
    Array.isArray(markers) && Array.isArray(facts) && Array.isArray(primaryChecks), "input arrays");
  const records = new Map(), issues = [], aliases = [], checksUsed = new Set();
  const baselineIds = new Set();
  for (const [externalId, value] of Object.entries(landmarks)) {
    requireRecord(/^L\d+$/.test(externalId) && Array.isArray(value) && value.length === 9 &&
      typeof value[0] === "string" && Array.isArray(value[1]) &&
      (value[1].length === 0 || value[1].length === 2) && value[1].every(Number.isFinite),
      "landmark " + externalId);
    const id = "gta6:landmark:" + externalId.toLowerCase();
    requireRecord(!records.has(id), "duplicate landmark " + id);
    const coordinate = value[1].length === 2 ?
      { projection: "gtadb.org:game-map-6", x: value[1][0], y: value[1][1] } : null;
    if (!coordinate) issues.push({ code: "MISSING_GAME_COORDINATES", id,
      severity: "HIGH", action: "HOLD_UNPOSITIONED" });
    const hasName = typeof value[0] === "string" && value[0].trim().length > 0;
    if (!hasName) issues.push({ code: "MISSING_LANDMARK_NAME", id,
      severity: "HIGH", action: "HOLD_UNNAMED" });
    const item = newRecord(id, "landmark",
      hasName ? value[0] : "UNIDENTIFIED LANDMARK (" + externalId + ")", "places", coordinate,
      { tags: Array.isArray(value[6]) ? value[6] : [], realWorldReference: value[3] ?? null });
    joinSource(item, "gtadb", externalId);
    records.set(id, item);
    baselineIds.add(externalId);
  }
  for (const place of places) {
    requireRecord(place && typeof place.id === "string" && /^L\d+$/.test(place.id), "place ID");
    const item = records.get("gta6:landmark:" + place.id.toLowerCase());
    requireRecord(item, "orphan place " + place.id);
    joinSource(item, "openmap", place.id, { externalStatus: place.confidence || "UNSPECIFIED" });
    if (place.same_as) aliases.push({ canonicalId: item.id,
      relatedCandidateId: "gta6:location:" + place.same_as, reason: "UPSTREAM_EXPLICIT_SAME_AS",
      action: "REVIEW_RELATION_NOT_MERGE" });
  }
  for (const marker of markers) {
    const externalId = String(marker?.id ?? "").replace(/^lm-/i, "").toUpperCase();
    requireRecord(/^L\d+$/.test(externalId), "marker ID " + marker?.id);
    const item = records.get("gta6:landmark:" + externalId.toLowerCase());
    requireRecord(item, "orphan marker " + marker?.id);
    joinSource(item, "gta6maps", marker.id, { externalStatus: marker.status || "UNSPECIFIED" });
  }
  for (const place of locations) {
    requireRecord(place && typeof place.id === "string" && /^[a-z0-9][a-z0-9-]+$/.test(place.id) &&
      typeof place.name === "string" && place.name.trim() && typeof place.kind === "string" &&
      Number.isFinite(place.x) && Number.isFinite(place.y), "location " + place?.id);
    const id = "gta6:location:" + place.id;
    requireRecord(!records.has(id), "duplicate location " + id);
    const item = newRecord(id, "location", place.name, rankKind(place.kind),
      { projection: "fbritoferreira:map-units", x: place.x, y: place.y },
      { kind: place.kind, type: place.type || null, area: place.area || null, region: place.region || null,
        descriptionDraft: place.description || null, confidence: place.confidence || "UNSPECIFIED" });
    const urls = Array.isArray(place.source_urls) ? place.source_urls.filter((s) =>
      typeof s === "string" && /^https:\/\//.test(s)) : [];
    joinSource(item, "openmap", place.id, { externalStatus: place.confidence || "UNSPECIFIED", recordSourceUrls: urls });
    records.set(id, item);
  }
  for (const fact of facts) {
    requireRecord(fact && typeof fact.key === "string" && /^[A-Za-z0-9-]+$/.test(fact.key), "fact key");
    const id = "gta6:fact:" + fact.key;
    requireRecord(!records.has(id), "duplicate fact " + id);
    const item = newRecord(id, "fact", fact.key, "facts", null,
      { value: fact.value ?? null, sourceStatus: fact.status ?? "UNSPECIFIED",
        sourceCheckedAt: fact.checkedAt || null });
    const urls = Array.isArray(fact.sources) ? fact.sources.filter((s) =>
      s && typeof s.url === "string" && /^https:\/\//.test(s.url)).map((s) => s.url) : [];
    joinSource(item, "gtasix", fact.key, { externalStatus: fact.status ?? "UNSPECIFIED", recordSourceUrls: urls });
    if (fact.status === "confirmed") item.evidenceStatus = "SOURCE_CLAIMED_CONFIRMED";
    records.set(id, item);
  }
  for (const check of primaryChecks) {
    requireRecord(check && typeof check.id === "string" && typeof check.primaryUrl === "string" &&
      /^https:\/\/www\.rockstargames\.com\//.test(check.primaryUrl) &&
      check.checkedAt && check.reviewer === "EDITORIAL_PRIMARY_CHECK", "primary check schema");
    requireRecord(!checksUsed.has(check.id), "duplicate primary check " + check.id);
    checksUsed.add(check.id);
    const item = records.get(check.id);
    requireRecord(item && item.type === "fact", "unmatched primary check " + check.id);
    requireRecord(JSON.stringify(item.attributes.value) === JSON.stringify(check.expectedValue),
      "primary verification stale for " + check.id);
    item.evidenceStatus = "PRIMARY_SOURCE_CHECKED";
    item.primaryEvidence = { url: check.primaryUrl, checkedAt: check.checkedAt,
      method: check.method, note: check.note };
  }
  for (const relation of aliases) {
    const related = records.get(relation.relatedCandidateId);
    if (!related) issues.push({ code: "ORPHAN_EXPLICIT_RELATION", ...relation });
    else related.relations.push({ id: relation.canonicalId, reason: relation.reason, merge: false });
  }
  const landmarksSorted = [...records.values()].filter((r) => r.type === "landmark");
  const locsSorted = [...records.values()].filter((r) => r.type === "location");
  // Retrieval by normalized title, only as suggestions. Different map projections must never be compared numerically.
  const landmarksByName = new Map();
  for (const item of landmarksSorted) {
    const normalized = normalizeName(item.title.split(",")[0]);
    if (normalized && normalized !== "?") {
      if (!landmarksByName.has(normalized)) landmarksByName.set(normalized, []);
      landmarksByName.get(normalized).push(item.id);
    }
  }
  const locNames = new Map(), reviewMatches = [];
  for (const item of locsSorted) {
    const key = normalizeName(item.title);
    if (!key || key === "?") continue;
    const matched = landmarksByName.get(key) || [];
    if (matched.length) {
      item.relations.push({ id: matched[0], reason: "SAME_NORMALIZED_NAME_CROSS_PROJECTION", merge: false });
      reviewMatches.push({ candidateId: item.id, existingId: matched[0],
        classification: "POSSIBLE_DUPLICATE", reason: "SAME_NORMALIZED_NAME_ONLY", merge: false });
    }
    if (locNames.has(key)) {
      reviewMatches.push({ candidateId: item.id, existingId: locNames.get(key),
        classification: "REVIEW_REQUIRED", reason: "SAME_NAME_WITHIN_SOURCE", merge: false });
    } else locNames.set(key, item.id);
  }
  const result = [...records.values()].sort((a, b) =>
    a.reviewPriority - b.reviewPriority || a.id.localeCompare(b.id, "en"));
  const groupCounts = Object.fromEntries(REVIEW_ORDER.map((group) =>
    [group, result.filter((x) => x.group === group).length]));
  const evidenceCounts = Object.fromEntries([...new Set(result.map((x) => x.evidenceStatus))]
    .sort().map((state) => [state, result.filter((x) => x.evidenceStatus === state).length]));
  const candidateGroups = Object.fromEntries(REVIEW_ORDER.filter((group) => group !== "facts")
    .map((group) => [group, locsSorted.filter((x) => x.group === group).length]));
  const anomalyCounts = Object.fromEntries([...new Set(issues.map((x) => x.code))]
    .sort().map((code) => [code, issues.filter((x) => x.code === code).length]));
  const sourceUrlCount = locsSorted.filter((x) =>
    x.provenance.some((p) => Array.isArray(p.recordSourceUrls) && p.recordSourceUrls.length > 0)).length;
  const report = {
    schema: "gitiasei.canonical.report.v1", totalCanonical: result.length, originalLandmarks: baselineIds.size,
    locationsImportedToStaging: locsSorted.length, factsImportedToStaging: facts.length,
    existingPlaceIdsJoined: places.length, existingMarkerIdsJoined: markers.length,
    explicitRelationsNotMerged: aliases.length, primaryCheckedFacts: checksUsed.size,
    productionPublished: result.filter((x) => x.publicationStatus === "PUBLISHED").length,
    groups: groupCounts, candidateGroups, evidence: evidenceCounts,
    candidateRecordSourceUrls: { present: sourceUrlCount, missing: locsSorted.length - sourceUrlCount },
    candidateMissingConfidence: locsSorted.filter((x) => x.attributes.confidence === "UNSPECIFIED").length,
    anomalyCounts, potentialDuplicatePairs: reviewMatches.length,
    issues, rules: ["RESEARCH_ONLY", "SOURCE_DERIVATIVES_NOT_INDEPENDENT",
      "NO_AUTO_MERGE_OF_NAME_MATCHES", "MIXED_COORDINATE_SYSTEMS_NOT_EQUIVALENT"]
  };
  return { records: result, reviewMatches, report };
}
