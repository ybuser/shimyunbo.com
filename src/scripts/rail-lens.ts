import {railsAt,placeLens,type LensRail} from '../lib/rail-lens';
export function installRailLens(host:HTMLElement,hit:HTMLElement,trigger:HTMLButtonElement,onChoose:(id:string)=>void){
 let pointerOutside=false;
 let rails:LensRail[]=[],position=0,origin:HTMLElement=trigger;
 const panel=document.createElement('section');panel.id='rail-lens';panel.hidden=true;panel.className='rail-lens';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Duration line magnifier');
 panel.innerHTML='<header><strong>Duration lens</strong><button type="button" aria-label="Close duration lens">×</button></header><p class="lens-caption" aria-live="polite"></p><div class="lens-options"></div><nav aria-label="Timeline lens position"><button type="button" data-step="-1">↑ Newer position</button><button type="button" data-step="1">Older position ↓</button></nav>';
 document.body.append(panel);trigger.hidden=false;
 const list=panel.querySelector<HTMLElement>('.lens-options')!,caption=panel.querySelector<HTMLElement>('.lens-caption')!;
 const stop=(restore=false)=>{if(panel.hidden)return;const focused=panel.contains(document.activeElement);panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(restore||focused)origin.focus({preventScroll:true});};
 function render(){
  list.replaceChildren();const active=railsAt(rails,position);
  caption.textContent=active.length?`${active.length} ${active.length===1?'period':'overlapping periods'} here. Choose a line to open its entry.`:'No duration crosses this position.';
  for(const rail of active){
   const b=document.createElement('button');b.type='button';b.className='lens-choice';b.dataset.entryId=rail.id;b.style.setProperty('--lens-color',rail.color);
   const swatch=document.createElement('span');swatch.className='lens-swatch';swatch.setAttribute('aria-hidden','true');
   const text=document.createElement('span'),label=document.createElement('strong'),date=document.createElement('small');label.textContent=rail.label;date.textContent=rail.period;text.append(label,date);b.append(swatch,text);
   b.addEventListener('click',()=>{stop();onChoose(rail.id);});list.append(b);
  }
  const points=[...new Set(rails.flatMap(r=>[r.top,(r.top+r.bottom)/2,r.bottom]))].sort((a,b)=>a-b);
  panel.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(b=>{const next=+b.dataset.step!>0?points.find(p=>p>position+.1):points.filter(p=>p<position-.1).at(-1);b.disabled=next===undefined;});
 }
 function place(x:number,y:number){const r=panel.getBoundingClientRect(),p=placeLens(x,y,r.width,r.height,innerWidth,innerHeight);panel.style.left=`${p.left+scrollX}px`;panel.style.top=`${p.top+scrollY}px`;}
 function open(y:number,x:number,clientY:number,source:HTMLElement){position=y;origin=source;panel.hidden=false;trigger.setAttribute('aria-expanded','true');render();place(x,clientY);(list.querySelector('button')??panel.querySelector('button'))?.focus({preventScroll:true});}
 hit.addEventListener('click',e=>{const r=host.getBoundingClientRect();open(e.clientY-r.top,e.clientX,e.clientY,trigger);});
 trigger.addEventListener('click',()=>{
  if(!panel.hidden){stop(true);return;}
  const r=host.getBoundingClientRect();const visible=rails.filter(l=>r.top+l.bottom>0&&r.top+l.top<innerHeight);
  const rail=visible[0]??rails[0];const y=rail?Math.max(rail.top,Math.min(rail.bottom,innerHeight/2-r.top)):0;
  const t=trigger.getBoundingClientRect();open(y,t.left,t.bottom,trigger);
 });
 panel.querySelector('header button')!.addEventListener('click',()=>stop(true));
 panel.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(b=>b.addEventListener('click',()=>{
  const points=[...new Set(rails.flatMap(r=>[r.top,(r.top+r.bottom)/2,r.bottom]))].sort((a,b)=>a-b);
  const next=+b.dataset.step!>0?points.find(p=>p>position+.1):points.filter(p=>p<position-.1).at(-1);
  if(next!==undefined){position=next;const r=panel.getBoundingClientRect();render();place(Math.max(0,r.left-18),Math.max(0,r.top-18));}
 }));
 document.addEventListener('pointerdown',e=>{pointerOutside=!panel.hidden&&!panel.contains(e.target as Node)&&!hit.contains(e.target as Node)&&e.target!==trigger;},true);
 document.addEventListener('pointerup',()=>setTimeout(()=>{pointerOutside=false;},0),true);
 document.addEventListener('pointercancel',()=>{pointerOutside=false;stop();},true);
 document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target as Node)&&!hit.contains(e.target as Node)&&e.target!==trigger){stop();e.preventDefault();e.stopPropagation();}},true);
 document.addEventListener('keydown',e=>{if(!panel.hidden&&e.key==='Escape'){e.preventDefault();e.stopPropagation();stop(true);}},true);
 document.addEventListener('focusin',e=>{if(!pointerOutside&&!panel.hidden&&!panel.contains(e.target as Node)&&e.target!==trigger)stop();});
 window.addEventListener('scroll',()=>stop(),{passive:true});window.addEventListener('resize',()=>stop(),{passive:true});
 return {update(next:LensRail[],left:number,width:number){stop();rails=next;hit.style.left=`${left}px`;hit.style.width=`${width}px`;hit.hidden=!rails.length;trigger.disabled=!rails.length;},close:stop};
}
