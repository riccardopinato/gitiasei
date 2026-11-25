import test from "node:test";
import assert from "node:assert/strict";
import { officialRecords, officialByKind, validateOfficial } from "../src/official.mjs";
import { researchGroups, sectionResearchGroup, validateResearchShard, pageResearch } from "../src/research-preview.mjs";
import { readFileSync } from "node:fs";

const media=JSON.parse(readFileSync(new URL("../public/data/video-links.json",import.meta.url),"utf8"));
const watch=JSON.parse(readFileSync(new URL("../research/sources/SOURCE_WATCHLIST_2026-11-25.json",import.meta.url),"utf8"));

test("first-party editorial records have stable unique IDs and direct primary sources",()=>{
  assert.deepEqual(validateOfficial(),[]);
  assert.equal(officialRecords.length,16);
  assert.equal(officialByKind("characters").length,8);
  assert.equal(officialByKind("locations").length,6);
  assert.equal(officialByKind("facts").length,2);
  assert.ok(officialRecords.every(r=>r.sourceUrl.startsWith("https://www.rockstargames.com/VI/")));
  assert.ok(officialRecords.every(r=>!r.image && !r.video && !r.embed));
});

test("research preview refuses published labels, duplicate IDs and unexpected media",()=>{
  const records=[{id:"gta6:location:a-001",name:"Sample",kind:"card",area:"Sample area",
    confidence:"community",hasRecordSourceUrl:false,suspectedDuplicate:false,status:"UNVERIFIED"}];
  const shard={schema:"gitiasei.research-preview.v1",category:"collectibles",
    status:"RESEARCH_ONLY",items:records};
  assert.equal(validateResearchShard(shard,"collectibles"),1);
  assert.throws(()=>validateResearchShard({...shard,status:"PUBLISHED"},"collectibles"));
  assert.throws(()=>validateResearchShard({...shard,items:[records[0],records[0]]},"collectibles"));
  assert.throws(()=>validateResearchShard({...shard,items:[{...records[0],media:"fake.mp4"}]},"collectibles"));
});

test("research search pagination is bounded and immutable",()=>{
  const x=[{name:"Ocean Drive",kind:"street",area:"Beach",id:"x"},
    {name:"Lighthouse",kind:"beacon",area:"Coast",id:"y"},
    {name:"Ocean View",kind:"hotel",area:"Beach",id:"z"}];
  const first=pageResearch(x,{query:"OCEAN",page:0,pageSize:1});
  assert.equal(first.total,2);
  assert.equal(first.items[0].id,"x");
  assert.equal(first.hasMore,true);
  const second=pageResearch(x,{query:"ocean",page:1,pageSize:1});
  assert.equal(second.items[0].id,"z");
  assert.equal(second.hasMore,false);
  assert.throws(()=>pageResearch(x,{pageSize:100000}));
  assert.equal(x.length,3);
});

test("source watchlist does not silently treat referenced third-party archives as imported",()=>{
  assert.ok(watch.sources.length>=10);
  assert.ok(watch.sources.every(s=>s.importedNewIds===0));
  assert.equal(new Set(watch.sources.map(s=>s.url)).size,watch.sources.length);
});

test("13 official media references never enable download or rehosting",()=>{
  assert.equal(media.items.length,13);
  assert.equal(media.pressKitFileCountAdvertised,11);
  assert.match(media.pressKitUrl,/^https:\/\/media\.rockstargames\.com\/VI\/downloads\/videos\/GTAVI_Videos\.zip$/);
  assert.ok(media.items.every(v=>v.downloadStatus==="NOT_DOWNLOADED" &&
    v.redistributionRight==="UNDETERMINED" && v.embedStatus==="DISABLED"));
  assert.ok(media.items.every(v=>v.sourceUrl.startsWith("https://www.rockstargames.com/VI/")));
});

test("research group mapping includes priority feature categories",()=>{
  assert.deepEqual(researchGroups,["curiosities","places","vehicles","activities","collectibles","reference"]);
  assert.equal(sectionResearchGroup.locations,"places");
  assert.equal(sectionResearchGroup.curiosities,"curiosities");
});
