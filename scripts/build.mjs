import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { canonicalBuild } from "./build-canonical.mjs";
import { validateMapPack } from "../src/native-map-core.mjs";

const root = process.cwd();
// Vercel executes `npm run build`, not `npm run verify`. Generate the pinned
// local map marker pack before copying public/ into the deployment output.
// Fail the deployment if source pinning or the map bundle is invalid.
await canonicalBuild();
const dist = join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const name of ["index.html", "src", "public"]) {
  const target = name === "public" ? dist : join(dist, name);
  if (name === "public") await cp(join(root, name), target, { recursive: true });
  else await cp(join(root, name), target, { recursive: true });
}
const index = await readFile(join(dist, "index.html"), "utf8");
for (const required of ["./src/app.mjs", "./src/styles.css", "LEONIDA SIGNAL"]) {
  if (!index.includes(required)) throw new Error("Missing app entrypoint: " + required);
}
for (const required of ["src/app.mjs", "src/styles.css", "manifest.webmanifest", "sw.js"]) {
  await stat(join(dist, required));
}
const [land, roads, pins] = await Promise.all(
  ["map-land.v1.json", "map-roads.v1.json", "map-pins.v1.json"]
    .map(async (name) => JSON.parse(await readFile(join(dist, "data", name), "utf8")))
);
const mapStats = validateMapPack({ land, roads, pins });
console.log("Validated self-hosted map assets:", JSON.stringify(mapStats));
console.log("Static PWA built at dist/ — no remote dependencies or copied clips.");
