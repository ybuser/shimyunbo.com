import {test} from 'node:test';import assert from 'node:assert/strict';
import {railsAt,placeGlass,projectRail,lensZoom,type LensRail} from '../src/lib/rail-lens.ts';
const base={x:10,color:'#fff',label:'Period',period:'2020–2021'};
const rails:LensRail[]=[{...base,id:'a',top:100,bottom:300},{...base,id:'b',top:200,bottom:400},{...base,id:'c',top:400,bottom:500}];
test('lens only offers lines at the selected shared position, including adjacent boundaries',()=>{
 assert.deepEqual(railsAt(rails,250).map(r=>r.id),['a','b']);
 assert.deepEqual(railsAt(rails,400).map(r=>r.id),['b','c']);
 assert.deepEqual(railsAt(rails,50),[]);
 assert.deepEqual(railsAt(rails.filter(r=>r.id!=='b'),250).map(r=>r.id),['a']);
});
test('lens fits mobile and desktop edges without a fullscreen overlay',()=>{
 for(const [vw,vh] of [[390,844],[1440,900]])for(const [x,y] of [[0,0],[vw-1,vh-1],[vw/2,vh/2]]){
  const width=Math.min(310,vw-32,vh-110),height=width,p=placeGlass(x,y,width,vw,vh);
  assert.ok(p.left>=12&&p.top>=12);assert.ok(p.left+width<=vw-12);assert.ok(p.top+height<=vh-12);
 }
});

test('optical projection preserves order, true endpoints, and shared boundaries with separable hit widths',()=>{
 const a={...base,id:'a',x:28,top:100,bottom:300},b={...base,id:'b',x:35,top:150,bottom:400};
 const zoom=lensZoom([a,b]);const pa=projectRail(a,28,200,zoom,310),pb=projectRail(b,28,200,zoom,310);
 assert.ok(pb.x-pa.x>=44);assert.equal(pa.x,155);assert.equal(pa.top,155-100*zoom);
 const adjacent=projectRail({...a,id:'c',top:300,bottom:500},28,200,zoom,310);assert.equal(pa.bottom,adjacent.top);
});
