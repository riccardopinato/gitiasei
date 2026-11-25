// Dependency-free PNG rendering of the first-party Gitiasei badge for PWA installs.
import { deflateSync } from "node:zlib";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
const TABLE=Array.from({length:256},(_,i)=>{
 let c=i;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
 return c>>>0;
});
function crc(bytes){
 let value=0xffffffff;
 for(const byte of bytes)value=TABLE[(value^byte)&255]^(value>>>8);
 return (value^0xffffffff)>>>0;
}
function chunk(name,body){
 const type=Buffer.from(name,"ascii"),length=Buffer.alloc(4),check=Buffer.alloc(4);
 length.writeUInt32BE(body.length);check.writeUInt32BE(crc(Buffer.concat([type,body])));
 return Buffer.concat([length,type,body,check]);
}
export function renderPwaIcon(size){
 if(![192,512].includes(size))throw new Error("Unsupported PWA icon size");
 const pixels=Buffer.alloc(size*(1+4*size));
 for(let y=0;y<size;y++){
  const v=(y+.5)/size,row=y*(size*4+1);
  pixels[row]=0; // PNG filter 0 for each scanline.
  for(let x=0;x<size;x++){
   const u=(x+.5)/size,p=row+1+4*x,r=.175;
   const dx=Math.max(Math.abs(u-.5)-(.5-r),0),dy=Math.max(Math.abs(v-.5)-(.5-r),0);
   const visible=dx*dx+dy*dy<=r*r;
   const glow=Math.max(0,1-Math.hypot(u-.8,v-.1)/.9);
   let rgb=[Math.round(13+glow*14),Math.round(16+glow*8),Math.round(32+glow*23)];
   const l=(u>.19&&u<.33&&v>.26&&v<.76)||(u>.19&&u<.51&&v>.64&&v<.76);
   const s=(u>.54&&u<.81&&v>.26&&v<.37)||(u>.54&&u<.81&&v>.46&&v<.56)||
    (u>.54&&u<.81&&v>.66&&v<.77)||(u>.54&&u<.65&&v>.35&&v<.51)||
    (u>.7&&u<.81&&v>.53&&v<.69);
   const dot=(u-.805)**2+(v-.177)**2<.045**2;
   if(l)rgb=[255,Math.round(87+v*70),Math.round(120-v*25)];
   if(s)rgb=[251,247,238];
   if(dot)rgb=[83,229,215];
   pixels[p]=rgb[0];pixels[p+1]=rgb[1];pixels[p+2]=rgb[2];pixels[p+3]=visible?255:0;
  }
 }
 const ihdr=Buffer.alloc(13);
 ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);
 ihdr[8]=8;ihdr[9]=6; // RGBA, 8-bit.
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),
   chunk("IDAT",deflateSync(pixels,{level:9})),chunk("IEND",Buffer.alloc(0))]);
}
export async function writePwaIcons(destination){
 for(const size of [192,512])await writeFile(join(destination,"icon-"+size+".png"),renderPwaIcon(size));
}
