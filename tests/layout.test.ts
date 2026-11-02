import {test} from 'node:test';import assert from 'node:assert/strict';
import {arrange,timeKey} from '../src/lib/layout.ts';
test('shared axis is monotone and ranges use exactly the same time knots',()=>{
 const r=arrange([{id:'a',time:2026,start:2020,height:300},{id:'b',time:2024,height:180},{id:'c',time:2024,height:500},{id:'d',time:2022,start:2020,height:200}],1100);
 assert.ok(r.ys.get(2026)!<r.ys.get(2024)!&&r.ys.get(2024)!<r.ys.get(2020)!);
 const ps=[...r.positions.values()];for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++)if(ps[i].side===ps[j].side)assert.ok(ps[j].y>=ps[i].y+[300,180,500,200][i]+20);
 assert.equal(new Set(ps.map(p=>p.side)).size,2);
});
test('filter and viewport recompute sides without data-side assignments',()=>{
 const all=[{id:'a',time:2026,height:400},{id:'b',time:2025,height:100},{id:'c',time:2024,height:200}];
 assert.equal(arrange(all,1100).positions.get('b')!.side,1);
 assert.equal(arrange(all.slice(1),1100).positions.get('b')!.side,0);
 assert.ok([...arrange(all,390).positions.values()].every(p=>p.side===0));
 assert.equal(arrange([],390).positions.size,0);
});
test('partial date buckets retain chronology without exact-day substitution',()=>{assert.ok(timeKey('2023')<timeKey('2023-Spring'));assert.ok(timeKey('2023-Spring')<timeKey('2023-Fall'));assert.ok(timeKey('2023-11')<timeKey('2023-11-30'));});
