import {railColor} from '../src/lib/rail-colors.ts';
import {entries} from '../src/data/entries.ts';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {arrange,timeKey,durationBounds} from '../src/lib/layout.ts';
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

test('inclusive ending months share exact boundaries with following starts',()=>{
 const a=durationBounds({start:'2024-03',end:'2025-07'});
 const b=durationBounds({start:'2025-08',ongoing:true},new Date('2026-11-03T12:00:00Z'));
 assert.equal(a.end,b.start);
 assert.equal(b.end,timeKey('2026-11-03'));
 for(const width of [390,768,1440])for(const extra of [[],[{id:'event',time:timeKey('2025-09'),height:140}]]){
  const r=arrange([{id:'navy',start:b.start,time:b.end,height:220},{id:'bannangco',start:a.start,time:a.end,height:260},...extra],width);
  assert.equal(r.ys.get(a.end),r.ys.get(b.start));
 }
 assert.ok(durationBounds({start:'2025-01',end:'2025-06'}).end<b.start,'a real July gap remains');
});
test('month endpoints roll through December and leap/common February',()=>{
 for(const [end,next] of [['2023-12','2024-01-01'],['2024-02','2024-03-01'],['2025-02','2025-03-01']]){
  const r=durationBounds({start:end,end});assert.equal(r.end,timeKey(next));assert.ok(r.end>r.start);
 }
 assert.ok(timeKey('2024-02-28')<timeKey('2024-02-29'));
 assert.ok(timeKey('2024-02-29')<timeKey('2024-03-01'));
 assert.equal(durationBounds({start:'2024-02-02',end:'2024-02-20'}).end,timeKey('2024-02-20'));
 assert.equal(durationBounds({start:'2013',end:'2014'}).end,timeKey('2014'));
});
test('duration colors belong to stable entry IDs, not category, order or filter',()=>{
 const ranges=entries.filter(e=>e.start);
 const snapshot=new Map(ranges.map(e=>[e.id,railColor(e.id)]));
 assert.equal(new Set(snapshot.values()).size,ranges.length);
 for(const list of [[...ranges].reverse(),ranges.filter(e=>e.categories.includes('work'))])
  for(const e of list)assert.equal(railColor(e.id),snapshot.get(e.id));
 assert.notEqual(railColor('navy'),railColor('bannangco'));
 assert.equal(railColor('future-entry'),railColor('future-entry'));
});

test('duration ribbons retain a readable span on the single shared axis',()=>{
 const end=timeKey('2025-08'),start=timeKey('2025-07');
 const r=arrange([{id:'a',time:end,start,height:200},{id:'moment',time:start,height:100}],1100);
 assert.ok(r.ys.get(start)!-r.ys.get(end)!>=110);
 assert.ok(r.positions.has('moment'));
});

test('2022 inclusive end boundary cannot promote the IBK card into 2023',()=>{
 const ibk=entries.find(e=>e.id==='ibk')!;const range=durationBounds({...ibk,start:ibk.start!});
 const ids=['ibk','excellence-2023','ta-fall','ta-spring'];
 const items=entries.filter(e=>ids.includes(e.id)).map(e=>({id:e.id,time:timeKey(e.date??e.end!),start:e.start?range.start:undefined,end:e.start?range.end:undefined,height:240}));
 for(const width of [390,768,1440]){
  const r=arrange(items,width);for(const id of ids.filter(id=>id!=='ibk'))assert.ok(r.positions.get(id)!.y<r.positions.get('ibk')!.y);
  assert.equal(range.end,timeKey('2023-01-01'));
  assert.ok(r.ys.get(range.end)!<r.ys.get(timeKey('2022-12'))!);
 }
});
