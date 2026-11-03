import {entries,categories,type Category} from '../data/entries';
import {arrange,timeKey,durationBounds} from '../lib/layout';
import {railColor,railLabel} from '../lib/rail-colors';
const host=document.querySelector<HTMLElement>('#chronology')!;
const svg=document.querySelector<SVGElement>('#time-lines')!;
const cards=[...host.querySelectorAll<HTMLDetailsElement>('.entry')];
const buttons=[...document.querySelectorAll<HTMLButtonElement>('[data-category]')];
const toggle=document.querySelector<HTMLButtonElement>('#filter-toggle')!;
const panel=document.querySelector<HTMLElement>('#filter-panel')!;
const dock=document.querySelector<HTMLElement>('#filter-dock')!;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let selected=new Set<Category>(), frame=0;
const data=new Map(entries.map(e=>[e.id,e]));
const today=new Date();
function line(x1:number,y1:number,x2:number,y2:number,cls='connector'){return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;}
function layout(){
 frame=0;
 const before=new Map(cards.filter(c=>!c.hidden).map(c=>[c.id,c.getBoundingClientRect()]));
 cards.forEach(c=>c.getAnimations().forEach(a=>a.cancel()));
 const visible=cards.filter(c=>!selected.size||c.dataset.categories!.split(',').some(c=>selected.has(c as Category)));
 const width=host.clientWidth, desktop=width>=720, gutter=desktop?200:84;
 host.querySelectorAll('.exit-ghost').forEach(c=>c.remove());
 cards.forEach(c=>{if(!visible.includes(c)&&!c.hidden&&!reduced.matches){const r=c.getBoundingClientRect(),base=host.getBoundingClientRect();const ghost=c.cloneNode(true) as HTMLElement;ghost.removeAttribute('id');ghost.classList.add('exit-ghost');ghost.setAttribute('aria-hidden','true');ghost.inert=true;Object.assign(ghost.style,{position:'absolute',left:`${r.left-base.left}px`,top:`${r.top-base.top}px`,width:`${r.width}px`,pointerEvents:'none',zIndex:'2'});host.append(ghost);ghost.animate([{opacity:1},{opacity:0,transform:'scale(.97)'}],{duration:140}).finished.then(()=>ghost.remove()).catch(()=>ghost.remove());}c.hidden=!visible.includes(c);c.style.width=`${desktop?(width-gutter)/2:width-gutter}px`;});
 const measured=visible.map(c=>{const e=data.get(c.id)!;const range=e.start?durationBounds({...e,start:e.start},today):undefined;return {id:c.id,time:range?.end??timeKey(e.date!),start:range?.start,height:c.offsetHeight};});
 const result=arrange(measured,width);host.classList.add('enhanced');host.style.height=`${result.height}px`;
 const axis=desktop?width/2:14;let drawing=line(axis,0,axis,result.height,'spine');
 const lanes:number[]=[];let lastYear='';
 for(const e of measured){
  const c=cards.find(c=>c.id===e.id)!,p=result.positions.get(e.id)!,anchor=result.ys.get(e.time)!;
  c.style.left=`${p.x}px`;c.style.top=`${p.y}px`;
  const year=data.get(e.id)!.ongoing?'Now':String((data.get(e.id)!.date??data.get(e.id)!.end??'').slice(0,4));if(year!==lastYear){drawing+=`<text class="axis-year" x="${axis+8}" y="${anchor-12}">${year}</text>`;lastYear=year;}
  const edge=desktop&&p.side===0?p.x+result.cardWidth:p.x;
  drawing+=`<path class="connector" d="M ${axis} ${anchor} L ${edge+(edge<axis?12:-12)} ${anchor} L ${edge} ${p.y+22}"/>`;
  if(e.start!==undefined){
   const end=result.ys.get(e.start)!;let lane=lanes.findIndex(bottom=>bottom<=anchor);if(lane<0)lane=lanes.length;lanes[lane]=end;
   const x=desktop?axis-18-lane*12:axis+14+lane*7;
   drawing+=`<g data-rail-id="${c.id}" style="--rail-color:${railColor(c.id)}">`+line(x,anchor,x,end,`duration-rail rail-${c.dataset.primary}`)+line(x-3,anchor,x+3,anchor,'cap')+line(x-3,end,x+3,end,'cap')+`<circle class="track-stop" cx="${x}" cy="${anchor}" r="9"/><text class="track-code" x="${x}" y="${anchor+3}">${railLabel(c.id)}</text></g>`;
   drawing+=`<rect class="range-node" x="${axis-4}" y="${anchor-4}" width="8" height="8" rx="2"/>`;
  }else drawing+=`<circle class="event-node" cx="${axis}" cy="${anchor}" r="4"/>`;
  const old=before.get(c.id),next=c.getBoundingClientRect();
  if(!reduced.matches)c.animate(old?[{transform:`translate(${old.left-next.left}px,${old.top-next.top}px)`},{transform:'none'}]:[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:240,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
 svg.setAttribute('viewBox',`0 0 ${width} ${result.height}`);svg.innerHTML=drawing;emphasize(cards.find(c=>!c.hidden&&c.dataset.kind==='duration'&&c.contains(document.activeElement))?.id);
 for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.category==='all'?!selected.size:selected.has(b.dataset.category as Category)));
 document.querySelector('#results')!.textContent=`${visible.length} entries · ${selected.size?`${selected.size} categories selected`:'All categories'}`;
 document.querySelector('#filter-count')!.textContent=selected.size?String(selected.size):'All';
 (document.querySelector('#empty') as HTMLElement).hidden=!!visible.length;
}
function schedule(){if(!frame)frame=requestAnimationFrame(layout);}
function writeURL(){const u=new URL(location.href);u.hash='';selected.size?u.searchParams.set('categories',[...selected].sort().join(',')):u.searchParams.delete('categories');history.pushState(null,'',u);schedule();}
function reset(){selected.clear();writeURL();}
function close(focus=false){panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(focus)toggle.focus();}
buttons.forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.category as Category|'all';if(c==='all')selected.clear();else selected.has(c)?selected.delete(c):selected.add(c);writeURL();}));
toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close(true);});
document.addEventListener('pointerdown',e=>{if(!dock.contains(e.target as Node))close(panel.contains(document.activeElement));});
document.querySelector('#reset')!.addEventListener('click',reset);
document.querySelector('#empty-reset')!.addEventListener('click',()=>{reset();toggle.focus();});
function anchor(){const c=cards.find(c=>'#'+c.id===location.hash);if(c){if(c.hidden)selected.clear();c.open=true;layout();c.scrollIntoView({block:'start'});}}
function restore(){selected=new Set((new URL(location.href).searchParams.get('categories')??'').split(',').filter((c):c is Category=>c in categories));layout();anchor();}
window.addEventListener('popstate',restore);window.addEventListener('hashchange',anchor);
try{const ids=JSON.parse(sessionStorage.getItem('timeline-open')??'[]');cards.forEach(c=>c.open=Array.isArray(ids)&&ids.includes(c.id));}catch{}
cards.forEach(c=>c.addEventListener('toggle',()=>{schedule();try{sessionStorage.setItem('timeline-open',JSON.stringify(cards.filter(c=>c.open).map(c=>c.id)));}catch{}}));
let lastWidth=0;new ResizeObserver(()=>{if(host.clientWidth!==lastWidth){lastWidth=host.clientWidth;schedule();}}).observe(host);
// Content heights can change after font/image loading or disclosure updates.
const heights=new WeakMap<Element,number>();const observer=new ResizeObserver(list=>{let changed=false;for(const r of list){if(heights.get(r.target)!==r.contentRect.height){heights.set(r.target,r.contentRect.height);changed=true;}}if(changed)schedule();});cards.forEach(c=>observer.observe(c));
document.fonts.ready.then(schedule);host.addEventListener('load',schedule,true);dock.hidden=false;restore();

function emphasize(id?:string){
 host.classList.toggle('tracing',!!id);
 host.querySelectorAll('[data-rail-id]').forEach(el=>el.classList.toggle('is-traced',(el as SVGElement).dataset.railId===id));
 cards.forEach(c=>c.classList.toggle('is-traced',c.id===id));
}
cards.forEach(c=>{
 const trace=()=>emphasize(c.dataset.kind==='duration'?c.id:undefined);
 c.addEventListener('pointerenter',trace);
 c.addEventListener('pointerleave',()=>{if(!c.contains(document.activeElement))emphasize();});
 c.addEventListener('focusin',trace);
 c.addEventListener('focusout',e=>{if(!c.contains(e.relatedTarget as Node))emphasize();});
});
