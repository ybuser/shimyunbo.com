export interface LensRail {id:string;top:number;bottom:number;color:string;label:string;period:string}
export function railsAt(rails:LensRail[],y:number){return rails.filter(r=>r.top<=y&&r.bottom>=y);}
export function placeLens(x:number,y:number,width:number,height:number,vw:number,vh:number){
 const left=Math.max(12,Math.min(x+18,vw-width-12));
 const top=Math.max(12,Math.min(y+18+height<=vh-12?y+18:y-height-18,vh-height-12));
 return {left,top};
}
