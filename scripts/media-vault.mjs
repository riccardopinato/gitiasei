// Optional user-initiated archive from Rockstar's OFFICIAL public media download endpoint.
// This does not scrape third-party videos, extract protected streams, or publish/rehost any files.
import { readFile, mkdir, open, writeFile, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { createHash } from "node:crypto";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
const data=JSON.parse(await readFile(new URL("../public/data/video-links.json",import.meta.url),"utf8"));
if(data.schema!=="gitiasei.media.references.v1" ||
  data.items.some(x=>x.downloadStatus!=="NOT_DOWNLOADED"||x.redistributionRight!=="UNDETERMINED"))
  throw new Error("Invalid rights registry");
const args=new Set(process.argv.slice(2));
if(args.has("--list") || args.size===0){
  console.log(JSON.stringify({items:data.items.map(x=>({id:x.id,title:x.title,url:x.sourceUrl})),
    officialMediaZip:data.pressKitUrl,downloaded:false},null,2));
} else if(args.has("--download-official-zip") && args.has("--accept-publisher-download-terms")){
  // Private workspace only. Never commit or distribute assets from this directory.
  const u=new URL(data.pressKitUrl);
  if(u.origin!=="https://media.rockstargames.com" || u.pathname!=="/VI/downloads/videos/GTAVI_Videos.zip")
    throw new Error("Non-allowlisted download URL");
  const dir=join(process.cwd(),".private-media","rockstar");
  await mkdir(dir,{recursive:true});
  const file=join(dir,"GTAVI_Videos.zip");
  const tmp=file+".part";
  const response=await fetch(u,{redirect:"follow",headers:{"User-Agent":"Gitiasei-Authorized-Media-Vault/0.2"}});
  if(!response.ok||!response.body)throw new Error("Official press-kit download failed: "+response.status);
  const len=Number(response.headers.get("content-length")||"0");
  const MAX=4*1024*1024*1024;
  if(len>MAX)throw new Error("Archive exceeds maximum allowed size");
  let actual=0;
  const h=createHash("sha256");
  const transform=new Transform({transform(chunk,enc,callback){
    actual+=chunk.length;
    if(actual>MAX){callback(new Error("Archive exceeds maximum allowed size"));return;}
    h.update(chunk);callback(null,chunk);
  }});
  try{
    await pipeline(Readable.fromWeb(response.body),transform,createWriteStream(tmp,{flags:"wx",mode:0o600}));
    const obj={file:"GTAVI_Videos.zip",sourceUrl:u.href,downloadedAt:new Date().toISOString(),
      bytes:actual,sha256:h.digest("hex"),rightsForRedistribution:"NOT_ESTABLISHED",
      licenseEvidence:"CHECK_OFFICIAL_MEDIA_TERMS_BEFORE_ANY_PUBLIC_REUSE",
      use:"PRIVATE_RESEARCH_ONLY",sourceCatalogRevision:data.capturedAt};
    await writeFile(join(dir,"vault-manifest.json"),JSON.stringify(obj,null,2)+"\n",{mode:0o600});
    const tempHandle=await open(tmp,"r");
    await tempHandle.close();
    await (await import("node:fs/promises")).rename(tmp,file);
    console.log(JSON.stringify({storedInPrivateGitIgnoredDirectory:true,bytes:actual,sha256:obj.sha256}));
  }catch(e){await rm(tmp,{force:true});throw e}
}else{
  console.error("Usage: node scripts/media-vault.mjs --list | --download-official-zip --accept-publisher-download-terms");
  process.exitCode=2;
}
