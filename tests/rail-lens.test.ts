import {test} from 'node:test';import assert from 'node:assert/strict';
import {railsAt,placeLens,type LensRail} from '../src/lib/rail-lens.ts';
const base={color:'#fff',label:'Period',period:'2020–2021'};
const rails:LensRail[]=[{...base,id:'a',top:100,bottom:300},{...base,id:'b',top:200,bottom:400},{...base,id:'c',top:400,bottom:500}];
test('lens only offers lines at the selected shared position, including adjacent boundaries',()=>{
 assert.deepEqual(railsAt(rails,250).map(r=>r.id),['a','b']);
 assert.deepEqual(railsAt(rails,400).map(r=>r.id),['b','c']);
 assert.deepEqual(railsAt(rails,50),[]);
 assert.deepEqual(railsAt(rails.filter(r=>r.id!=='b'),250).map(r=>r.id),['a']);
});
test('lens fits mobile and desktop edges without a fullscreen overlay',()=>{
 for(const [vw,vh] of [[390,844],[1440,900]])for(const [x,y] of [[0,0],[vw-1,vh-1],[vw/2,vh/2]]){
  const width=Math.min(340,vw-24),height=400,p=placeLens(x,y,width,height,vw,vh);
  assert.ok(p.left>=12&&p.top>=12);assert.ok(p.left+width<=vw-12);assert.ok(p.top+height<=vh-12);
 }
});
