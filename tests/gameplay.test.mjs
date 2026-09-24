import test from 'node:test'; import assert from 'node:assert/strict';
import {flight,difficulty,nextWorld,safeGate,canHit,TOP,BOTTOM} from '../src/rules.mjs';
test('jetpack accelerates upward, gravity descends, bounds stay safe',()=>{let p=flight(350,0,true,.1);assert.ok(p.y<350);p=flight(350,0,false,.1);assert.ok(p.y>350);assert.equal(flight(90,-500,true,1).y,TOP);assert.equal(flight(640,500,false,1).y,BOTTOM)});
test('difficulty grows but remains capped and gap navigable',()=>{const a=difficulty(0),b=difficulty(30000);assert.ok(b.speed>a.speed&&b.speed<=635);assert.ok(b.gap>=230);assert.ok(b.interval>=.88)});
test('worlds cycle every 1700m',()=>{assert.deepEqual([0,1700,3400,5100,6800].map(nextWorld),[0,1,2,3,0])});
test('collision boundaries and safe gates',()=>{assert.equal(canHit({x:10,y:10,w:40,h:40},{x:49,y:10,w:40,h:40}),true);assert.equal(canHit({x:10,y:10,w:40,h:40},{x:150,y:10,w:40,h:40}),false);assert.ok(safeGate(1,360,260).clearance>=230)});
