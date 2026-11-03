/** A monotone, piecewise compressed time map shared by nodes and duration rails.
 * Partial dates are ordered buckets, never synthesized exact calendar days. */
export function timeKey(value:string):number {
 const [y,m,d]=value.split('-');
 const year=+y;
 // Imprecise year/semester buckets stay approximate, before known months.
 if(!m||m==='Spring'||m==='Fall')return year+(m==='Spring'?.001:m==='Fall'?.002:0);
 const origin=Date.UTC(year,0,1),days=(Date.UTC(year+1,0,1)-origin)/86400000;
 return year+((Date.UTC(year,+m-1,+(d??1))-origin)/86400000+1)/(days+1);
}
/** Month-only periods include the whole ending month; labels remain untouched. */
export function durationBounds(entry:{start:string;end?:string;ongoing?:boolean},today=new Date()){
 const start=timeKey(entry.start);
 if(entry.ongoing)return {start,end:timeKey(today.toISOString().slice(0,10))};
 const end=entry.end!;
 if(/^\d{4}-\d{2}$/.test(end)){
  const [year,month]=end.split('-').map(Number);
  const next=new Date(Date.UTC(year,month,1)).toISOString().slice(0,10);
  return {start,end:timeKey(next)};
 }
 return {start,end:timeKey(end)};
}

export interface Measured {id:string;time:number;start?:number;height:number}
export function arrange(items:Measured[],width:number){
 const desktop=width>=720, gutter=desktop?200:84, cardWidth=desktop?(width-gutter)/2:width-gutter;
 const knots=[...new Set(items.flatMap(e=>e.start===undefined?[e.time]:[e.time,e.start]))].sort((a,b)=>b-a);
 const ys=new Map<number,number>(), positions=new Map<string,{x:number;y:number;side:number}>();
 const bottoms=[0,0];let y=35,previous=knots[0]??0,lastTop=0;
 for(const time of knots){
  y+=Math.min(55,22+(previous-time)*12);previous=time;
  // Give short visual spans enough length to trace, using the same shared knot.
  for(const interval of items)if(interval.start===time&&interval.time>time){
   const endY=ys.get(interval.time);if(endY!==undefined)y=Math.max(y,endY+110);
  }
  const group=items.filter(e=>e.time===time);
  if(group.length)y=Math.max(y,lastTop+20,desktop?Math.min(...bottoms)+30:bottoms[0]+30);
  ys.set(time,y);
  for(const e of group){
   const side=desktop&&bottoms[1]<bottoms[0]?1:0;
   const top=Math.max(y-22,bottoms[side],lastTop);
   positions.set(e.id,{x:desktop?(side?cardWidth+gutter:0):gutter,y:top,side});
   bottoms[side]=top+e.height+20;lastTop=top;
  }
 }
 return {positions,ys,height:Math.max(y+65,...bottoms),cardWidth,desktop,gutter};
}
