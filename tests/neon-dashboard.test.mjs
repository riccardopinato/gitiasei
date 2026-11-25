import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=load("index.html"),js=load("src/app.mjs"),css=load("src/neon-ui.css");
const icons=load("public/neon-icons.svg"),art=load("public/neon-city.svg");
const sw=load("public/sw.js");
test("approved neon dashboard is real DOM, not a single flattened screenshot",()=>{
 for(const id of ["view-feed","view-map","view-discover","view-saved","heroTitle",
   "dashboardSavedCount","dashboardFoundCount","nativeMapCanvas","discoverList",
   "savedList","reelFeed","officialHighlights","directoryGrid"])
  assert.match(html,new RegExp('id="'+id+'"'),"missing usable interface: "+id);
 for(const block of ["hero-neon","feature-grid","metric-grid","home-rail","desktop-sidebar","top-nav"])
  assert.ok(html.includes('class="'+block)||html.includes('class="'+block+" "),block);
 assert.match(html,/LEONIDA MAP ATLAS/);
 assert.match(html,/ROCKSTAR VIDEOS/);
 assert.match(html,/COMMUNITY LAB/);
 assert.match(html,/href="https:\/\/www\.rockstargames\.com\/VI\/media\/videos"/);
 assert.doesNotMatch(html,/128K|2\.4M|18\.7M|JOIN WATCH PARTY/);
});
test("new design is accessible, self-hosted, responsive and very dark",()=>{
 assert.match(css,/--bg:#07050a/);
 assert.match(css,/--neon-edge:#74346b/);
 assert.match(css,/\.neon-feed\{padding:12px;display:grid/);
 assert.match(css,/@media\(max-width:699px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/focus-visible/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.doesNotMatch(css,/fonts\.googleapis\.com/);
 assert.match(art,/viewBox="0 0 1600 820"/);
 for(const id of ["home","map","compass","bookmark","layers","settings","play","arrow","external"])
  assert.ok(icons.includes('id="'+id+'"'),"Missing self-hosted icon "+id);
 assert.ok(sw.includes("./src/neon-ui.css")&&sw.includes("./neon-city.svg"));
});
test("existing interactions remain wired across sidebar, topnav and cards",()=>{
 assert.match(js,/querySelectorAll\("nav \[data-tab\]"\)/);
 assert.match(js,/showTab\("discover"\); renderDirectory\(\)/);
 assert.match(js,/dashboardSavedCount/);
 assert.match(js,/dashboardFoundCount/);
 assert.match(js,/import\("\.\/native-map\.mjs"\)/);
 assert.match(js,/localStorage\.setItem\(STORAGE_KEY/);
 assert.match(js,/data-dashboard-scroll/);
});
