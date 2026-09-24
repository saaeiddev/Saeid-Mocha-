import test from 'node:test';
import assert from 'node:assert/strict';
import {flight,difficulty,nextWorld,nextSafeGap,safeGate,canHit,TOP,BOTTOM} from '../src/rules.mjs';
test('jetpack climbs when held, descends on release and respects boundaries',()=>{
  assert.ok(flight(350,0,true,.1).y<350);
  assert.ok(flight(350,0,false,.1).y>350);
  assert.equal(flight(90,-500,true,1).y,TOP);
  assert.equal(flight(640,500,false,1).y,BOTTOM);
});
test('flight stays within world bounds for 12,000 simulation steps',()=>{
  let p={y:350,vy:0};
  for(let i=0;i<12000;i++){p=flight(p.y,p.vy,Math.floor(i/60)%2===0,1/60);assert.ok(p.y>=TOP&&p.y<=BOTTOM&&Number.isFinite(p.vy))}
});
test('difficulty ramps up but remains capped and retains clearance',()=>{
  const a=difficulty(0),b=difficulty(5000),c=difficulty(100000);
  assert.ok(b.speed>a.speed&&c.speed<=635);
  assert.ok(b.gap<=a.gap&&c.gap>=230&&c.interval>=.88);
});
test('all four game worlds rotate at distance milestones',()=>{
  assert.deepEqual([0,1700,3400,5100,6800].map(nextWorld),[0,1,2,3,0]);
});
test('every generated corridor is navigable across distances',()=>{
  for(const d of [0,1000,3000,9000,50000]) {
    const gap=difficulty(d).gap;
    for(let previous=TOP;previous<=BOTTOM;previous+=25){
      for(let offset=-115;offset<=115;offset+=23){
        const center=nextSafeGap(previous,offset,gap);
        const gate=safeGate(1,center,gap);
        assert.ok(gate.clearance>=230&&gate.top>=TOP&&gate.bottom<=BOTTOM);
        assert.ok(Math.abs(center-previous)<=115||center===TOP+gap/2+5||center===BOTTOM-gap/2-5);
      }
    }
  }
});
test('collision boxes only intersect when actually overlapping',()=>{
  const hero={x:250,y:350,w:77,h:113};
  assert.equal(canHit(hero,{x:280,y:375,w:40,h:40}),true);
  assert.equal(canHit(hero,{x:800,y:375,w:40,h:40}),false);
  assert.equal(canHit(hero,{x:280,y:600,w:40,h:40}),false);
});
