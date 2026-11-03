import {railsAt,projectRail,lensZoom,placeGlass,type LensRail} from '../lib/rail-lens';
export function installRailLens(host:HTMLElement,hit:HTMLElement,trigger:HTMLButtonElement,onChoose:(id:string)=>void){
 let openScrollX=0,openScrollY=0;
 let rails:LensRail[]=[],cx=0,cy=0,zoom=4,size=300,pointerOutside=false,drag:{x:number;y:number;cx:number;cy:number;moved:boolean}|null=null,suppressClick=false;
 const panel=document.createElement('section');panel.id='rail-lens';panel.hidden=true;panel.className='glass-lens';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Timeline magnifying glass');
 panel.innerHTML='<div class="glass-viewport" tabindex="0" role="group" aria-label="Magnified timeline. Select a line. Drag to pan. Arrow keys explore lines and time."><svg class="lens-scene" aria-hidden="true"></svg><div class="glass-targets"></div></div><button class="glass-close" aria-label="Close magnifying glass">×</button><p class="glass-label" aria-live="polite">Select a line · drag to pan</p>';
 const marker=document.createElement('div');marker.className='glass-source';marker.hidden=true;marker.setAttribute('aria-hidden','true');
 document.body.append(marker,panel);trigger.hidden=false;
 const viewport=panel.querySelector<HTMLElement>('.glass-viewport')!,scene=panel.querySelector<SVGElement>('.lens-scene')!,targets=panel.querySelector<HTMLElement>('.glass-targets')!,label=panel.querySelector<HTMLElement>('.glass-label')!;
 function stop(restore=false){if(panel.hidden)return;const focused=panel.contains(document.activeElement);panel.hidden=true;marker.hidden=true;trigger.setAttribute('aria-expanded','false');drag=null;if(restore||focused)trigger.focus({preventScroll:true});}
 function render(){
  scene.innerHTML=host.querySelector('#time-lines')!.innerHTML;
  scene.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  scene.setAttribute('viewBox',`${cx-size/(2*zoom)} ${cy-size/(2*zoom)} ${size/zoom} ${size/zoom}`);
  targets.replaceChildren();
  for(const rail of rails){
   const p=projectRail(rail,cx,cy,zoom,size);if(p.x<0||p.x>size||p.bottom<=0||p.top>=size)continue;
   const b=document.createElement('button');b.type='button';b.className='glass-line';b.dataset.entryId=rail.id;b.setAttribute('aria-label',`${rail.label}, ${rail.period}`);
   // Hit zones never cross the true endpoints or the midpoint to an adjacent lane.
   const adjacent=rails.filter(r=>r.id!==rail.id&&r.x!==rail.x&&r.top<rail.bottom&&r.bottom>rail.top).map(r=>Math.abs(r.x-rail.x)*zoom);
   const width=Math.min(44,...adjacent);Object.assign(b.style,{left:`${p.x-width/2}px`,top:`${Math.max(0,p.top)}px`,width:`${width}px`,height:`${Math.min(size,p.bottom)-Math.max(0,p.top)}px`});
   b.style.setProperty('--lens-color',rail.color);
   const describe=()=>{label.textContent=`${rail.label} · ${rail.period}`;};b.addEventListener('focus',describe);b.addEventListener('pointerenter',describe);
   b.addEventListener('click',e=>{if(suppressClick){e.preventDefault();return;}stop();onChoose(rail.id);});targets.append(b);
  }
 }
 function open(localX:number,localY:number,clientX:number,clientY:number,keyboard=false){
  openScrollX=scrollX;openScrollY=scrollY;cx=localX;cy=localY;size=Math.min(310,innerWidth-32,innerHeight-110);zoom=lensZoom(rails);panel.style.setProperty('--glass-size',`${size}px`);
  const {left,top}=placeGlass(clientX,clientY,size,innerWidth,innerHeight);
  panel.style.left=`${left+scrollX}px`;panel.style.top=`${top+scrollY}px`;
  marker.style.left=`${clientX+scrollX}px`;marker.style.top=`${clientY+scrollY}px`;marker.hidden=false;
  panel.hidden=false;trigger.setAttribute('aria-expanded','true');label.textContent='Select a line · drag to pan';render();
  // A source crosshair remains at the exact sampled point when the lens is edge-shifted.
  viewport.focus({preventScroll:true});if(keyboard)(targets.querySelector('button') as HTMLElement|null)?.focus({preventScroll:true});
 }
 hit.addEventListener('click',e=>{const r=host.getBoundingClientRect();open(e.clientX-r.left,e.clientY-r.top,e.clientX,e.clientY);});
 trigger.addEventListener('click',()=>{if(!panel.hidden){stop(true);return;}const r=host.getBoundingClientRect();const rail=rails.find(l=>r.top+l.bottom>0&&r.top+l.top<innerHeight)??rails[0];if(!rail)return;const y=Math.max(rail.top,Math.min(rail.bottom,(innerHeight/2-r.top)));open(rail.x,y,r.left+rail.x,Math.max(100,Math.min(innerHeight-100,r.top+y)),true);});
 panel.querySelector('.glass-close')!.addEventListener('click',()=>stop(true));
 viewport.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,cx,cy,moved:false};suppressClick=false;});
 viewport.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>8){drag.moved=true;suppressClick=true;viewport.setPointerCapture(e.pointerId);cx=drag.cx-dx/zoom;cy=drag.cy-dy/zoom;render();label.textContent='Select a line · drag to pan';}});
 viewport.addEventListener('pointerup',()=>{drag=null;setTimeout(()=>{suppressClick=false;},0);});
 panel.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
   const active=railsAt(rails,cy).sort((a,b)=>a.x-b.x);const current=(document.activeElement as HTMLElement)?.dataset.entryId;let index=active.findIndex(r=>r.id===current);index=Math.max(0,Math.min(active.length-1,index+(e.key==='ArrowRight'?1:-1)));const rail=active[index];if(rail){cx=rail.x;render();(targets.querySelector(`[data-entry-id="${rail.id}"]`) as HTMLElement)?.focus({preventScroll:true});}
  }else{cy+=e.key==='ArrowDown'?size/(3*zoom):-size/(3*zoom);render();viewport.focus({preventScroll:true});label.textContent='Select a line · drag to pan';}
 });
 document.addEventListener('pointerdown',e=>{pointerOutside=!panel.hidden&&!panel.contains(e.target as Node)&&e.target!==trigger;},true);
 document.addEventListener('pointerup',()=>setTimeout(()=>{pointerOutside=false;},0),true);
 document.addEventListener('pointercancel',()=>{drag=null;pointerOutside=false;},true);
 document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target as Node)&&e.target!==trigger){stop();e.preventDefault();e.stopPropagation();}},true);
 document.addEventListener('keydown',e=>{if(!panel.hidden&&e.key==='Escape'){e.preventDefault();e.stopPropagation();stop(true);}},true);
 document.addEventListener('focusin',e=>{if(!drag&&!pointerOutside&&!panel.hidden&&!panel.contains(e.target as Node)&&e.target!==trigger)stop();});
 window.addEventListener('scroll',()=>{if(scrollX!==openScrollX||scrollY!==openScrollY)stop();},{passive:true});window.addEventListener('resize',()=>stop(),{passive:true});
 return {update(next:LensRail[],left:number,width:number){stop();rails=next;hit.style.left=`${left}px`;hit.style.width=`${width}px`;hit.hidden=!rails.length;trigger.disabled=!rails.length;},close:stop};
}
