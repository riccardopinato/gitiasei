import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import { buildCanonical, SCHEMA_VERSION, SOURCE_REVISIONS } from "../src/canonical.mjs";

const ROOT = process.cwd();
const research = join(ROOT, "research", "sources");
const inputs = [
  ["landmarks", "gtadb-org-20261125/upstream/map/data/6/landmarks.json",
    "771b9b77acec5e6f0aac4610a45fdda5aef08f05"],
  ["places", "gta6-multisource-20261125/fbritoferreira/public/data/places.json",
    "9231f286b7833f6641047584ddb49a91f514c5a6"],
  ["locations", "gta6-multisource-20261125/fbritoferreira/public/data/locations.json",
    "37f0482ae115c66e69400dcf428632bd20283212"],
  ["markers", "gta6-multisource-20261125/duanhesen/data/gta-6-markers.json",
    "dd692bece8939b04b594103f87bae0208fb5d61c"],
  ["facts", "gta6-multisource-20261125/zeshutmax/data/gta6-facts.json",
    "e91045732bc6cff068a39078eaaea7113792c4ba"]
];
export async function readPinnedSources() {
  const obj = {};
  for (const [key, path, expectedGitBlob] of inputs) {
    const bytes = await readFile(join(research, path));
    const sha = createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
    if (sha !== expectedGitBlob) throw new Error("Source drift in " + path + ": " + sha);
    const parsed = JSON.parse(bytes.toString("utf8"));
    obj[key] = key === "markers" ? parsed.markers : key === "facts" ? parsed.facts : parsed;
  }
  obj.primaryChecks = JSON.parse(await readFile(join(ROOT, "research", "evidence", "primary-fact-checks.json"), "utf8")).checks;
  return obj;
}
export async function canonicalBuild() {
  const input = await readPinnedSources(); // Fail before output writes.
  const { records, reviewMatches, report } = buildCanonical(input);
  const destination = join(ROOT, "artifacts", "canonical");
  await mkdir(destination, { recursive: true });
  const info = { schema: "gitiasei.canonical.package.v1", formatVersion: SCHEMA_VERSION,
    sources: SOURCE_REVISIONS, publicationPolicy: "HOLD_UNTIL_REVIEW",
    authoredAt: "2026-11-25", records };
  const queue = records.filter((r) => r.type === "location").map((r) => ({
    id: r.id, name: r.title, category: r.group, priority: r.reviewPriority,
    kind: r.attributes.kind, area: r.attributes.area ?? "",
    confidence: r.attributes.confidence, hasRecordSourceUrl: r.provenance.some((s) => s.recordSourceUrls?.length),
    evidenceStatus: r.evidenceStatus, suspectedDuplicate: r.relations.some((s) => !s.merge),
    publicationStatus: r.publicationStatus
  }));
  if (queue.length !== 4687 || queue.some((r) => r.publicationStatus !== "HOLD"))
    throw new Error("Research preview must never publish candidate records");
  const publicData = join(ROOT, "public", "data");
  await mkdir(publicData, { recursive: true });
  const groups = ["curiosities","places","vehicles","activities","collectibles","reference"];
  const previewManifest = { schema: "gitiasei.research-preview.manifest.v1",
    source: "Open GTA 6 Map (fbritoferreira/gta6)", license: "CC BY 4.0",
    attributionUrl: "https://github.com/fbritoferreira/gta6",
    revision: SOURCE_REVISIONS.openmap,
    rightsNotice: "Names, labels and coordinates are unverified community submissions. No screenshots or gameplay media are included.",
    publicationStatus: "RESEARCH_ONLY", itemCount: queue.length,
    groups: Object.fromEntries(groups.map((g) => [g, queue.filter((r) => r.category === g).length])) };
  for (const group of groups) {
    const items = queue.filter((r) => r.category === group).map((r) => ({
      id: r.id, name: r.name, kind: r.kind, area: r.area,
      confidence: r.confidence, hasRecordSourceUrl: r.hasRecordSourceUrl,
      suspectedDuplicate: r.suspectedDuplicate, status: "UNVERIFIED"
    }));
    const destination = join(publicData, "research-" + group + ".json");
    const temp = destination + ".tmp";
    try {
      await writeFile(temp, JSON.stringify({ schema: "gitiasei.research-preview.v1",
        category: group, status: "RESEARCH_ONLY", items }) + "\n");
      await rename(temp, destination);
    } catch (error) { await rm(temp, { force: true }); throw error; }
  }
  await writeFile(join(publicData, "research-manifest.json"),
    JSON.stringify(previewManifest) + "\n");
  const reviewBatches = join(destination, "review-batches");
  await mkdir(reviewBatches, { recursive: true });
  // Deterministic 100-ID disjoint batches. This is automated QA, not independent factual verification.
  for (let i = 0; i < queue.length; i += 100) {
    const batch = queue.slice(i, i + 100);
    const name = String(i / 100 + 1).padStart(3, "0") + ".json";
    const file = join(reviewBatches, name);
    await writeFile(file, JSON.stringify({ schema: "gitiasei.review-batch.v1",
      batch: i / 100 + 1, total: batch.length, certified: 0,
      requiresIndependentEvidence: batch.filter((r) => !r.hasRecordSourceUrl).length,
      records: batch }) + "\n");
  }
  // Atomic per-file write; no overwrite of source or user data.
  for (const [name, json] of [
    ["canonical.catalog.v1.json", info],
    ["canonical.report.v1.json", report],
    ["canonical.review-queue.v1.json", { schema: "gitiasei.canonical.queue.v1", records: queue, matches: reviewMatches }]
  ]) {
    const temp = join(destination, "." + name + ".tmp");
    try {
      await writeFile(temp, JSON.stringify(json) + "\n", "utf8");
      await rename(temp, join(destination, name));
    } catch (error) {
      await rm(temp, { force: true });
      throw error;
    }
  }
  console.log(JSON.stringify(report));
  return { records, reviewMatches, report };
}
if (process.argv[1] && import.meta.url === new URL("file://" + process.argv[1]).href) await canonicalBuild();
