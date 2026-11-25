import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {renderPwaIcon} from "../scripts/pwa-icons.mjs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../src/styles.css",import.meta.url),"utf8");
const app=readFileSync(new URL("../src/app.mjs",import.meta.url),"utf8");
const sw=readFileSync(new URL("../public/sw.js",import.meta.url),"utf8");
const build=readFileSync(new URL("../scripts/build.mjs",import.meta.url),"utf8");
const manifest=JSON.parse(readFileSync(new URL("../public/manifest.webmanifest",import.meta.url),"utf8"));
test("installable PWA uses standalone mode with real PNG icons and iOS shell metadata",()=>{
 assert.equal(manifest.display,"standalone");
 assert.ok(manifest.icons.some(i=>i.sizes==="192x192"&&i.type==="image/png"));
 assert.ok(manifest.icons.some(i=>i.sizes==="512x512"&&i.type==="image/png"));
 assert.match(html,/apple-mobile-web-app-capable/);
 assert.match(html,/apple-touch-icon/);
 assert.match(html,/id="installQuick"/);
 assert.match(html,/id="installPanel"/);
 assert.match(app,/beforeinstallprompt/);
 assert.match(app,/display-mode: standalone/);
 for(const size of [192,512]){
  const png=renderPwaIcon(size);
  assert.equal(png.subarray(1,4).toString(),"PNG");
  assert.equal(png.readUInt32BE(16),size);
  assert.equal(png.readUInt32BE(20),size);
 }
 assert.match(build,/await writePwaIcons\(dist\)/);
});
test("desktop fills viewport while mobile keeps touch safe-area navigation and map",()=>{
 assert.match(css,/\.app\{max-width:none;width:100%/);
 assert.match(css,/@media\(min-width:1100px\)/);
 assert.match(css,/\.app main\{margin-left:104px\}/);
 assert.match(css,/@media\(max-width:699px\)/);
 assert.match(css,/\.native-map-viewport\{height:clamp/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
 assert.match(app,/document\.body\.dataset\.view = tab/);
 assert.match(app,/document\.body\.dataset\.layout/);
});
test("service worker uses a fresh shell with offline map assets",()=>{
 assert.match(sw,/gitiasei-neon-v05/);
 assert.match(sw,/map-\(land\|roads\|pins\)/);
 assert.match(sw,/event\.respondWith\(fetch\(request\)/);
 assert.match(sw,/\.\/icon-192\.png/);
 assert.match(sw,/\.\/icon-512\.png/);
});
