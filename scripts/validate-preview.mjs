// Validate generated, explicitly UNVERIFIED preview packs before copying them into dist.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { researchGroups, validateResearchShard } from "../src/research-preview.mjs";
const base=join(process.cwd(),"public","data");
const manifest=JSON.parse(readFileSync(join(base,"research-manifest.json"),"utf8"));
if(manifest.schema!=="gitiasei.research-preview.manifest.v1" ||
    manifest.publicationStatus!=="RESEARCH_ONLY" || manifest.itemCount!==4687)
  throw new Error("Invalid research preview manifest");
let total=0;const ids=new Set();
for(const group of researchGroups){
  const filename="research-"+group+".json";
  const file=JSON.parse(readFileSync(join(base,filename),"utf8"));
  const n=validateResearchShard(file,group);
  if(manifest.groups[group]!==n) throw new Error("Preview group count mismatch "+group);
  for(const item of file.items){
    if(ids.has(item.id))throw new Error("Duplicate candidate ID across groups: "+item.id);
    ids.add(item.id);
  }
  total+=n;
}
if(total!==4687 || ids.size!==4687) throw new Error("Archive count drift");
const batchPath=join(process.cwd(),"artifacts","canonical","review-batches");
const batches=readdirSync(batchPath).filter(s=>s.endsWith(".json")).sort();
if(batches.length!==47)throw new Error("Expected 47 disjoint review batches, found "+batches.length);
const assigned=new Set();
let reviewed=0;
for(let i=0;i<batches.length;i++){
  const batch=JSON.parse(readFileSync(join(batchPath,batches[i]),"utf8"));
  if(batch.batch!==i+1 || batch.certified!==0 ||
      batch.total!==(i===46?87:100) || batch.records.length!==batch.total)
    throw new Error("Invalid evidence batch "+batch.batch);
  for(const item of batch.records){
    if(assigned.has(item.id)) throw new Error("Overlapping review batch "+item.id);
    assigned.add(item.id);
  }
  reviewed+=batch.total;
}
if(reviewed!==total || [...ids].some(id=>!assigned.has(id)))
  throw new Error("Incomplete evidence batch coverage");
const renderer=readFileSync(join(process.cwd(),"src","app.mjs"),"utf8");
if(!renderer.includes("renderPreviewPanel("))throw new Error("Lab browser not mounted in app");
console.log("Research validation: "+total+" unique HOLD records; 47 disjoint QA batches; 0 certified.");
