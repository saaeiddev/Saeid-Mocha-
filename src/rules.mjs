export const W=1280,H=720,TOP=84,BOTTOM=645;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const flight=(y,vy,held,dt)=>{const acc=held?-1470:1120;vy=clamp(vy+acc*dt,-580,650); y+=vy*dt;if(y<TOP){y=TOP;vy=Math.max(0,vy)}if(y>BOTTOM){y=BOTTOM;vy=Math.min(0,vy)}return {y,vy}};
export const difficulty=(distance)=>({speed:Math.min(635,345+distance*.026),gap:Math.max(230,375-distance*.015),interval:Math.max(.88,1.65-distance*.00013)});
export const nextWorld=(distance)=>Math.floor(distance/1700)%4;
export const safeGate=(r,center,gap)=>{const half=gap/2;return {top:Math.max(0,center-half),bottom:Math.min(H,center+half),clearance:gap,seed:r}};
export const canHit=(a,b)=>Math.abs(a.x-b.x)<a.w/2+b.w/2&&Math.abs(a.y-b.y)<a.h/2+b.h/2;
