import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
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
console.log("Static PWA built at dist/ — no remote dependencies or copied clips.");
