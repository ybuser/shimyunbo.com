export interface LensRail {id:string;x:number;top:number;bottom:number;color:string;label:string;period:string}
export function railsAt(rails:LensRail[],y:number){return rails.filter(r=>r.top<=y&&r.bottom>=y);}
export function placeGlass(x:number,y:number,size:number,vw:number,vh:number){
 return {left:Math.max(16,Math.min(x-size/2,vw-size-16)),top:Math.max(16,Math.min(y-size/2,vh-size-84))};
}
export function projectRail(r:LensRail,cx:number,cy:number,zoom:number,size:number){return {x:(r.x-cx)*zoom+size/2,top:(r.top-cy)*zoom+size/2,bottom:(r.bottom-cy)*zoom+size/2};}
export function lensZoom(rails:LensRail[]){const xs=[...new Set(rails.map(r=>r.x))].sort((a,b)=>a-b);const gaps=xs.slice(1).map((x,i)=>x-xs[i]).filter(x=>x>0);return Math.max(4,44/Math.min(12,...gaps));}
