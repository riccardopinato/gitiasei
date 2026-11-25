import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {createCamera,zoomAt,screenToWorld,worldToScreen,clusteredPins,
  selectPins,validateMapPack,PROJECTION,normalizedQuery} from "../src/native-map-core.mjs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../src/app.mjs",import.meta.url),"utf8");
const native=readFileSync(new URL("../src/native-map.mjs",import.meta.url),"utf8");
const build=readFileSync(new URL("../scripts/build.mjs",import.meta.url),"utf8");
const css=readFileSync(new URL("../src/styles.css",import.meta.url),"utf8");
const land=JSON.parse(readFileSync(new URL("../public/data/map-land.v1.json",import.meta.url),"utf8"));
const roads=JSON.parse(readFileSync(new URL("../public/data/map-roads.v1.json",import.meta.url),"utf8"));
const pin=(id,x,y,group="places")=>({id,name:"Example",kind:"example",area:"Test",
  x,y,group,confidence:"community",status:"UNVERIFIED"});
const fake={schema:"gitiasei.native-map.pins.v1",projection:PROJECTION,publicationStatus:"RESEARCH_ONLY",
  count:4687,pins:Array.from({length:4687},(_,i)=>pin("gta6:location:test-"+i,300+i/50,450+i/60))};
test("self-hosted map uses only a local Canvas, no third-party iframe",()=>{
  assert.match(html,/id="nativeMapCanvas"/);
  assert.match(html,/id="nativeMapStage"/);
  assert.doesNotMatch(html,/<iframe\b/i);
  assert.doesNotMatch(html,/\bembed=1\b/);
  assert.doesNotMatch(html,/\bOPEN FULL MAP\b/);
  assert.doesNotMatch(css,/fonts\.googleapis\.com/);
  assert.ok(!native.includes("https://"));
  assert.match(html,/frame-src &#39;none&#39;/);
  assert.match(app,/import\("\.\/native-map\.mjs"\)/);
});
test("local map shapes and streets have pinned provenance and usable geometry",()=>{
  assert.equal(land.schema,"gitiasei.map-land.v1");
  assert.equal(roads.schema,"gitiasei.map-roads.v1");
  assert.equal(land.projection,PROJECTION);
  assert.equal(roads.projection,PROJECTION);
  assert.equal(land.polygons.length,762);
  assert.ok(roads.roads.length>8500);
  assert.equal(land.labels.length,10);
  assert.match(land.license,/CC BY 4\.0/);
  assert.match(roads.license,/CC BY 4\.0/);
});
test("geographic transformation and centered zoom are invertible",()=>{
  const camera=createCamera({x:460.7,y:482.3,zoom:2.5});
  const p=worldToScreen(480.5,502.3,camera,390,600);
  const world=screenToWorld(p.x,p.y,camera,390,600);
  assert.ok(Math.abs(world.x-480.5)<1e-8);
  assert.ok(Math.abs(world.y-502.3)<1e-8);
  const pivot=screenToWorld(140,260,camera,390,600);
  const next=zoomAt(camera,0.7,140,260,390,600);
  const fixed=screenToWorld(140,260,next,390,600);
  assert.ok(Math.abs(pivot.x-fixed.x)<1e-8);
  assert.ok(Math.abs(pivot.y-fixed.y)<1e-8);
});
test("nearby points cluster without changing IDs or certifying their content",()=>{
  const pins=[pin("gta6:location:test-a",460,480),pin("gta6:location:test-b",461,481),
   pin("gta6:location:test-c",565,300,"vehicles")];
  const selected=selectPins(pins,{group:"places"});
  assert.equal(selected.length,2);
  const cells=clusteredPins(pins,createCamera(),390,600,{cell:60});
  assert.equal(cells.reduce((s,c)=>s+c.count,0),3);
  assert.deepEqual(pins.map(p=>p.status),["UNVERIFIED","UNVERIFIED","UNVERIFIED"]);
  assert.equal(normalizedQuery("  ÉAST  "),"east");
});
test("map data validation rejects duplicate IDs or promoted research entries",()=>{
  assert.equal(validateMapPack({land,roads,pins:fake}).ids,4687);
  const duplicate={...fake,pins:[...fake.pins.slice(0,-1),fake.pins[0]]};
  assert.throws(()=>validateMapPack({land,roads,pins:duplicate}),/Invalid unverified map pin/);
  const published={...fake,publicationStatus:"PUBLISHED"};
  assert.throws(()=>validateMapPack({land,roads,pins:published}),/Invalid local map data bundle/);
});
test("licensed data attribution remains available without third-party network dependencies",()=>{
  assert.match(html,/Open GTA 6 Map contributors/);
  assert.match(html,/CC BY 4\.0/);
  assert.match(html,/https:\/\/creativecommons\.org\/licenses\/by\/4\.0/);
  assert.match(html,/DATA CREDITS & LICENSE/);
  assert.ok(native.includes('fetch(path,{credentials:"same-origin"})'));
  assert.match(app,/getHideSpoilers/);
});

test("Vercel build generates and validates the complete local map bundle",()=>{
  assert.match(build,/await canonicalBuild\(\)/);
  assert.match(build,/validateMapPack\(\{ land, roads, pins \}\)/);
  for(const name of ["map-land.v1.json","map-roads.v1.json","map-pins.v1.json"])
    assert.ok(build.includes(name), "Missing deployment map asset: "+name);
});
