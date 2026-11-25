import {createCamera,viewportScale,worldToScreen,screenToWorld,zoomAt,
 validateMapPack,selectPins,clusteredPins,GROUPS,MAP_COLORS,clamp,normalizedQuery} from "./native-map-core.mjs";

const URLS=["./data/map-land.v1.json","./data/map-roads.v1.json","./data/map-pins.v1.json"];
const DEFAULT_CAMERA=createCamera();
function get(id){return document.getElementById(id)}
function prepareRoads(raw){
 return raw.roads.map(([kind,points])=>{
   const bbox=[Infinity,Infinity,-Infinity,-Infinity];
   for(const [x,y] of points){if(x<bbox[0])bbox[0]=x;if(y<bbox[1])bbox[1]=y;
    if(x>bbox[2])bbox[2]=x;if(y>bbox[3])bbox[3]=y;}
   return {kind,points,bbox};
 });
}
function text(parent,tag,className,value){
 const el=document.createElement(tag);if(className)el.className=className;
 el.textContent=String(value);parent.append(el);return el;
}
function renderPinDetails(pin,host,isSaved,isFound){
 host.replaceChildren();
 if(!pin){host.hidden=true;return}
 host.hidden=false;
 text(host,"span","map-record-type",pin.group.toUpperCase()+" · COMMUNITY CANDIDATE");
 text(host,"h3","map-record-title",pin.name);
 text(host,"p","map-record-note",(pin.area?pin.area+" · ":"")+
    "UNVERIFIED · "+pin.confidence+" · no independent gameplay confirmation");
 const actions=text(host,"div","map-record-actions","");
 const saved=text(actions,"button","map-record-save",isSaved(pin.id)?"★ SAVED":"☆ SAVE");
 saved.type="button";saved.dataset.nativeAction="save";saved.dataset.id=pin.id;
 const found=text(actions,"button","map-record-found",isFound(pin.id)?"✓ MARKED":"○ MARK FOUND");
 found.type="button";found.dataset.nativeAction="found";found.dataset.id=pin.id;
 const close=text(actions,"button","map-record-close","CLOSE ✕");close.type="button";
 close.dataset.nativeAction="close";
 text(host,"small","map-record-source","ID: "+pin.id);
}
export async function mountNativeMap({isSaved=()=>false,isFound=()=>false,onSave=()=>{},onFound=()=>{},
 getHideSpoilers=()=>true,onUnlock=()=>{}}={}){
 const stage=get("nativeMapStage"),canvas=get("nativeMapCanvas"),
  status=get("nativeMapStatus"),count=get("nativeMapCount"),detail=get("nativeMapDetails"),
  search=get("nativeMapSearch"),filter=get("nativeMapFilter"),suggestions=get("nativeMapSearchResults"),
  unlock=get("nativeMapUnlock"),shield=get("nativeMapShield");
 if(!stage||!canvas||!status||!count||!detail||!search||!filter||!suggestions||!unlock||!shield)
   throw new Error("Native map UI missing");
 status.textContent="LOADING LOCAL MAP DATA...";
 const responses=await Promise.all(URLS.map(async path=>{
  const response=await fetch(path,{credentials:"same-origin"});
  if(!response.ok)throw new Error("Missing self-hosted map asset: "+path+" ("+response.status+")");
  return response.json();
 }));
 const [land,rawRoads,pack]=responses;
 const accepted=validateMapPack({land,roads:rawRoads,pins:pack});
 const roads=prepareRoads(rawRoads),pins=pack.pins;
 const ctx=canvas.getContext("2d",{alpha:false});
 if(!ctx)throw new Error("Canvas 2D unavailable");
 const maxDpr=2;
 let width=0,height=0,dpr=1,camera=createCamera(),selected=null;
 let pointerHistory=new Map(),pointerMoved=false,prevPinchDistance=null;
 let clusterCache=[],filtered=selectPins(pins),scheduled=false,destroyed=false;
 let filterGroup="all",query="",shownSuggestions=[];
 function resize(){
  const r=canvas.getBoundingClientRect();width=Math.max(220,Math.round(r.width));
  height=Math.max(300,Math.round(r.height));dpr=Math.min(maxDpr,Math.max(1,window.devicePixelRatio||1));
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  requestDraw();
 }
 function requestDraw(){if(scheduled||destroyed)return;scheduled=true;requestAnimationFrame(()=>{
  scheduled=false;draw();
 })}
 function draw(){
  if(!width||!height||destroyed)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const water=ctx.createLinearGradient(0,0,width,height);
  water.addColorStop(0,"#132b42");water.addColorStop(1,"#071624");
  ctx.fillStyle=water;ctx.fillRect(0,0,width,height);
  const scale=viewportScale(camera,width,height);
  const sw=screenToWorld(-90,-90,camera,width,height);
  const ne=screenToWorld(width+90,height+90,camera,width,height);
  ctx.save();ctx.translate(width/2-camera.x*scale,height/2-camera.y*scale);ctx.scale(scale,scale);
  // Original Gitiasei rendering of open-licensed, locally bundled geometric data.
  const step=32;ctx.strokeStyle="#a7e6e313";ctx.lineWidth=.65/scale;ctx.beginPath();
  for(let x=Math.floor(sw.x/step)*step;x<ne.x;x+=step){ctx.moveTo(x,sw.y);ctx.lineTo(x,ne.y)}
  for(let y=Math.floor(sw.y/step)*step;y<ne.y;y+=step){ctx.moveTo(sw.x,y);ctx.lineTo(ne.x,y)}
  ctx.stroke();
  for(const poly of land.polygons){
   ctx.beginPath();let minx=Infinity,miny=Infinity,maxx=-Infinity,maxy=-Infinity;
   for(const ring of poly){
    for(let i=0;i<ring.length;i++){
      const p=ring[i];if(p[0]<minx)minx=p[0];if(p[1]<miny)miny=p[1];if(p[0]>maxx)maxx=p[0];if(p[1]>maxy)maxy=p[1];
      if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);
    }ctx.closePath();
   }
   if(maxx<sw.x||maxy<sw.y||minx>ne.x||miny>ne.y)continue;
   ctx.fillStyle="#294855";ctx.strokeStyle="#5b8e87";
   ctx.lineWidth=.85/scale;ctx.fill("evenodd");ctx.stroke();
  }
  for(const [kind,color,px] of [
   ["m","#8fc1ad27",.55],["s","#9ac0b755",.8],["a","#e4c59c76",1.25],["h","#fbcd9caf",1.65]
  ]){
    if(kind==="m"&&camera.zoom<2.6)continue;
    ctx.beginPath();
    for(const road of roads){
      if(road.kind!==kind)continue;
      const [minx,miny,maxx,maxy]=road.bbox;
      if(maxx<sw.x||maxy<sw.y||minx>ne.x||miny>ne.y)continue;
      road.points.forEach((p,i)=>{if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);});
    }
    ctx.lineWidth=px/scale;ctx.strokeStyle=color;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
  }
  ctx.restore();
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const showPins=!getHideSpoilers();
  for(const label of land.labels){
    const p=worldToScreen(label.x,label.y,camera,width,height);
    if(p.x<15||p.x>width-15||p.y<15||p.y>height-15)continue;
    ctx.font="900 "+(camera.zoom>3?15:12)+"px Arial,sans-serif";
    ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineWidth=4;
    ctx.strokeStyle="#0b172dd0";ctx.strokeText(label.n.toUpperCase(),p.x,p.y);
    ctx.fillStyle="#f0dab9";ctx.fillText(label.n.toUpperCase(),p.x,p.y);
  }
  clusterCache=showPins?clusteredPins(filtered,camera,width,height,{cell:camera.zoom>=4.4?36:camera.zoom>=3?48:65}):[];
  for(const cluster of clusterCache){
    const color=MAP_COLORS[cluster.mainGroup]||"#ced6e4";
    ctx.beginPath();ctx.arc(cluster.x,cluster.y,cluster.count===1?5.5:clamp(9+Math.log2(cluster.count)*2.2,11,24),0,Math.PI*2);
    ctx.fillStyle=cluster.count===1?color:"#11182de8";ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=cluster.count===1?1.8:2.2;ctx.stroke();
    if(cluster.count>1){ctx.font="900 11px Arial,sans-serif";ctx.fillStyle="#fff6e7";
      ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(cluster.count),cluster.x,cluster.y);}
  }
  if(selected){
    const p=worldToScreen(selected.x,selected.y,camera,width,height);
    ctx.beginPath();ctx.arc(p.x,p.y,14,0,2*Math.PI);ctx.strokeStyle="#ff7099";
    ctx.lineWidth=3;ctx.stroke();
  }
  count.textContent=showPins?(filtered.length.toLocaleString("en-US")+" CANDIDATE PINS · NOT VERIFIED"):
    ("MAP READY · "+pack.count.toLocaleString("en-US")+" PINS HIDDEN BY SPOILER SHIELD");
  shield.hidden=showPins;
  stage.dataset.ready="true";stage.dataset.source="self-hosted";
  stage.dataset.externalRequests="0";status.textContent="LOCAL CARTOGRAPHY · NO THIRD-PARTY MAP SERVICE";
 }
 function changeFilter(){
   filterGroup=filter.value;
   query=search.value;
   filtered=selectPins(pins,{group:filterGroup,search:query});
   if(selected&&!filtered.includes(selected))selected=null;
   renderPinDetails(selected,detail,isSaved,isFound);
   requestDraw();
 }
 function updateSuggestions(){
  suggestions.replaceChildren();
  if(!search.value.trim()||getHideSpoilers()){suggestions.hidden=true;return}
  shownSuggestions=selectPins(pins,{group:filter.value,search:search.value}).slice(0,8);
  for(const item of shownSuggestions){
   const btn=document.createElement("button");btn.type="button";
   btn.textContent=item.name+" · "+item.group;btn.dataset.pinId=item.id;
   btn.className="native-map-suggestion";suggestions.append(btn);
  }
  suggestions.hidden=shownSuggestions.length===0;
 }
 function select(pin){
   if(!pin||getHideSpoilers())return;
   selected=pin;camera=createCamera({x:pin.x,y:pin.y,zoom:Math.max(camera.zoom,4)});
   search.value="";filter.value="all";query="";filterGroup="all";filtered=pins;
   suggestions.hidden=true;renderPinDetails(selected,detail,isSaved,isFound);
   requestDraw();detail.scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 function clickMap(x,y){
   if(getHideSpoilers())return;
   let best=null,dist=Infinity;
   for(const c of clusterCache){
    const d=Math.hypot(c.x-x,c.y-y);
    if(d<Math.max(17,c.count>1?23:15)&&d<dist){dist=d;best=c}
   }
   if(best){
     if(best.count===1)select(best.pins[0]);
     else {
      camera=zoomAt(camera,1.25,best.x,best.y,width,height);
      selected=null;renderPinDetails(null,detail,isSaved,isFound);requestDraw();
     }
   }
 }
 function coord(event){
  const r=canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};
 }
 function dpoints(){const p=[...pointerHistory.values()];return p.length>=2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):null}
 canvas.addEventListener("pointerdown",event=>{
  if(event.button!==0&&event.pointerType!=="touch")return;
  canvas.setPointerCapture(event.pointerId);
  pointerHistory.set(event.pointerId,coord(event));
  pointerMoved=false;prevPinchDistance=dpoints();
 });
 canvas.addEventListener("pointermove",event=>{
  if(!pointerHistory.has(event.pointerId))return;
  const now=coord(event),prev=pointerHistory.get(event.pointerId);
  if(Math.hypot(now.x-prev.x,now.y-prev.y)>1.5)pointerMoved=true;
  pointerHistory.set(event.pointerId,now);
  if(pointerHistory.size>=2){
   const dist=dpoints();
   if(prevPinchDistance && dist){
     const pp=[...pointerHistory.values()],mid={x:(pp[0].x+pp[1].x)/2,y:(pp[0].y+pp[1].y)/2};
     camera=zoomAt(camera,Math.log(dist/prevPinchDistance)/Math.log(1.62),mid.x,mid.y,width,height);
   }prevPinchDistance=dist;
  }else{
    const scale=viewportScale(camera,width,height);
    camera=createCamera({x:camera.x-(now.x-prev.x)/scale,y:camera.y-(now.y-prev.y)/scale,zoom:camera.zoom});
  }requestDraw();
 });
 function stop(event){
  if(!pointerHistory.has(event.pointerId))return;
  const pt=coord(event);
  pointerHistory.delete(event.pointerId);
  if(!pointerMoved&&pointerHistory.size===0)clickMap(pt.x,pt.y);
  prevPinchDistance=dpoints();
 }
 canvas.addEventListener("pointerup",stop);canvas.addEventListener("pointercancel",stop);
 canvas.addEventListener("wheel",event=>{
  event.preventDefault();const pt=coord(event);
  camera=zoomAt(camera,event.deltaY<0?.18:-.18,pt.x,pt.y,width,height);requestDraw();
 },{passive:false});
 stage.querySelectorAll("[data-native-map-action]").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.nativeMapAction;
  if(action==="reset")camera=createCamera();
  if(action==="zoom-in")camera=zoomAt(camera,.65,width/2,height/2,width,height);
  if(action==="zoom-out")camera=zoomAt(camera,-.65,width/2,height/2,width,height);
  requestDraw();
 }));
 search.addEventListener("input",()=>{changeFilter();updateSuggestions()});
 filter.addEventListener("change",()=>{changeFilter();updateSuggestions()});
 suggestions.addEventListener("click",event=>{
  const btn=event.target.closest("[data-pin-id]");if(!btn)return;
  const item=shownSuggestions.find(x=>x.id===btn.dataset.pinId);select(item);
 });
 detail.addEventListener("click",event=>{
  const btn=event.target.closest("[data-native-action]");if(!btn)return;
  if(btn.dataset.nativeAction==="save")onSave(btn.dataset.id);
  else if(btn.dataset.nativeAction==="found")onFound(btn.dataset.id);
  else if(btn.dataset.nativeAction==="close")selected=null;
  renderPinDetails(selected,detail,isSaved,isFound);requestDraw();
 });
 unlock.addEventListener("click",()=>{onUnlock();changeFilter();updateSuggestions()});
 const observer=new ResizeObserver(resize);observer.observe(canvas);
 resize();stage.dataset.ready="true";
 status.textContent="SELF-HOSTED VECTOR MAP · "+accepted.landPolygons+" LAND SHAPES";
 return {
  refresh(){renderPinDetails(selected,detail,isSaved,isFound);requestDraw()},
  jumpToId(id){const pin=pins.find(p=>p.id===id);if(pin)select(pin);return Boolean(pin)},
  destroy(){destroyed=true;observer.disconnect()}
 };
}
