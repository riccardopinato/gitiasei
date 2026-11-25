// Coordinate math and validation for Gitiasei's independently developed local Canvas map.
// Open GTA 6 Map geographic paths and research points share a 0..1024 game-map projection.
export const PROJECTION = "open-gta6-map:1024-units";
export const GROUPS = Object.freeze(["all","curiosities","places","vehicles","activities","collectibles","reference"]);
export const MAP_COLORS = Object.freeze({
 curiosities:"#ff6c9e",places:"#5beddf",vehicles:"#ffbb69",activities:"#a5f27c",
 collectibles:"#ca9dff",reference:"#b5bdcb"
});
export function clamp(v,min,max) { return Math.max(min,Math.min(max,v)); }
export function createCamera({x=460.7,y=482.3,zoom=1.9}={}) {
 return {x:clamp(Number(x),160,750),y:clamp(Number(y),130,880),zoom:clamp(Number(zoom),0.9,7)};
}
export function viewportScale(camera,width,height) {
 return Math.pow(1.62,camera.zoom-1)*(Math.min(width,height)/660);
}
export function worldToScreen(x,y,camera,width,height) {
 const s=viewportScale(camera,width,height);
 return {x:width/2+(x-camera.x)*s,y:height/2+(y-camera.y)*s};
}
export function screenToWorld(x,y,camera,width,height) {
 const s=viewportScale(camera,width,height);
 return {x:camera.x+(x-width/2)/s,y:camera.y+(y-height/2)/s};
}
export function zoomAt(camera,delta,x,y,width,height) {
 const point=screenToWorld(x,y,camera,width,height);
 const z=clamp(camera.zoom+delta,0.9,7);
 const scale=viewportScale({...camera,zoom:z},width,height);
 return createCamera({x:point.x-(x-width/2)/scale,y:point.y-(y-height/2)/scale,zoom:z});
}
export function validateMapPack({land,roads,pins}) {
 if(land?.schema!=="gitiasei.map-land.v1" || roads?.schema!=="gitiasei.map-roads.v1" ||
  pins?.schema!=="gitiasei.native-map.pins.v1" ||
  land.projection!==PROJECTION || roads.projection!==PROJECTION || pins.projection!==PROJECTION ||
  !Array.isArray(land.polygons) || land.polygons.length<500 ||
  !Array.isArray(roads.roads) || roads.roads.length<4000 ||
  !Array.isArray(land.labels) || land.labels.length<5 ||
  pins.publicationStatus!=="RESEARCH_ONLY" || !Array.isArray(pins.pins) ||
  pins.count!==pins.pins.length || pins.count!==4687) throw new Error("Invalid local map data bundle");
 const ids=new Set();
 for(const item of pins.pins){
  if(!/^gta6:location:[a-z0-9-]+$/.test(item?.id||"") ||
   ids.has(item.id) || !Number.isFinite(item.x) || !Number.isFinite(item.y) ||
   item.x<0||item.x>1024||item.y<0||item.y>1024 ||
   !GROUPS.includes(item.group) || item.status!=="UNVERIFIED" || !item.name ||
   item.name.length>240 || !["community","UNSPECIFIED"].includes(item.confidence) ||
   "media" in item || "video" in item || "image" in item) throw new Error("Invalid unverified map pin");
  ids.add(item.id);
 }
 return {ids:ids.size,landPolygons:land.polygons.length,roadLines:roads.roads.length};
}
export function normalizedQuery(q){return String(q??"").normalize("NFKD")
 .replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();}
export function selectPins(pins,{group="all",search=""}={}) {
 if(!GROUPS.includes(group))throw new Error("Unknown map group");
 const q=normalizedQuery(search);
 return pins.filter(pin=>(group==="all"||pin.group===group) &&
  (!q || [pin.name,pin.kind,pin.area,pin.id].some(v=>normalizedQuery(v).includes(q))));
}
export function clusteredPins(pins,camera,w,h,{cell=52}={}) {
 if(!Number.isFinite(cell)||cell<20||cell>120)throw new Error("Invalid cluster cell");
 const cells=new Map(),padding=25;
 for(const pin of pins){
  const p=worldToScreen(pin.x,pin.y,camera,w,h);
  if(p.x < -padding||p.y < -padding||p.x > w+padding||p.y > h+padding)continue;
  const key=Math.floor(p.x/cell)+":"+Math.floor(p.y/cell);
  let bucket=cells.get(key);
  if(!bucket){bucket={x:0,y:0,count:0,pins:[],groups:{}};cells.set(key,bucket)}
  bucket.x+=p.x;bucket.y+=p.y;bucket.count++;
  bucket.groups[pin.group]=(bucket.groups[pin.group]||0)+1;
  if(bucket.pins.length<24)bucket.pins.push(pin);
 }
 return [...cells.values()].map(c=>{
  c.x/=c.count;c.y/=c.count;
  c.mainGroup=Object.entries(c.groups).sort((a,b)=>b[1]-a[1])[0][0];
  return c;
 });
}
