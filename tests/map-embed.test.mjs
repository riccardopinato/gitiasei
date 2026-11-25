import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../src/app.mjs", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("map uses supplied official embed URL and preserves center/zoom", () => {
  const tag = html.match(/<iframe\b[^>]*\bid="gameMapEmbed"[^>]*>/s)?.[0];
  assert.ok(tag, "interactive map iframe exists");
  const raw = tag.match(/\bsrc="([^"]+)"/)?.[1].replaceAll("&amp;", "&");
  assert.equal(raw, "https://fbritoferreira.github.io/gta6/?view=2.5%2F460.7%2F482.3&embed=1");
  const url = new URL(raw);
  assert.equal(url.searchParams.get("view"), "2.5/460.7/482.3");
  assert.equal(url.searchParams.get("embed"), "1");
  assert.match(tag, /loading="lazy"/);
  assert.match(tag, /title="[^"]+"/);
});

test("license and built-in map credit remain visible, with external fallback", () => {
  assert.match(html, /id="mapEmbedCredit"/);
  assert.match(html, /https:\/\/github\.com\/fbritoferreira\/gta6/);
  assert.match(html, /https:\/\/creativecommons\.org\/licenses\/by\/4\.0\//);
  assert.match(html, /OPEN FULL MAP/);
  assert.match(html, /attribution inside the map is intentionally preserved/);
  assert.ok(!/iframe::(?:before|after)|iframe\s*\+\s*\.overlay/.test(styles));
  assert.ok(!/clip-path\s*:\s*inset\(/.test(styles));
});

test("fictional map stays isolated and demo reel navigation opens it explicitly", () => {
  const details = html.match(/<details class="concept-map-details"[^>]*>([\s\S]*?)<\/details>/)?.[0];
  assert.ok(details);
  assert.match(details, /id="mapPins"/);
  assert.match(details, /id="mapList"/);
  assert.match(details, /FICTIONAL SCHEMATIC/);
  assert.ok(html.indexOf('id="gameMapEmbed"') < html.indexOf('id="conceptMapDetails"'));
  assert.match(script, /if \(concept\) concept\.open = true/);
});
