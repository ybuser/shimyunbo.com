/** A monotone, piecewise compressed time map shared by nodes and duration rails.
 * Partial dates are ordered buckets, never synthesized exact calendar days. */
export function timeKey(value:string):number {
 const [y,m,d]=value.split('-');
 return +y+(m==='Spring'?.001:m==='Fall'?.002:m?(+m)/13:0)+(Number(d)||0)/500;
}
export interface Measured {id:string;time:number;start?:number;height:number}
export function arrange(items:Measured[],width:number){
 const desktop=width>=720, gutter=desktop?132:66, cardWidth=desktop?(width-gutter)/2:width-gutter;
 const knots=[...new Set(items.flatMap(e=>e.start===undefined?[e.time]:[e.time,e.start]))].sort((a,b)=>b-a);
 const ys=new Map<number,number>(), positions=new Map<string,{x:number;y:number;side:number}>();
 const bottoms=[0,0];let y=35,previous=knots[0]??0,lastTop=0;
 for(const time of knots){
  y+=Math.min(55,22+(previous-time)*12);previous=time;
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
