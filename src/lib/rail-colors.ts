/** Entry identity, never position or the active filter, owns a duration color.
 * These muted, light colors remain readable on the charcoal timeline. */
const colors:Readonly<Record<string,string>>={
 navy:'#77baff',bannangco:'#ffb365',codime:'#c39aff',cassopi:'#64d8b2',
 'snu-hci':'#f493be',ibk:'#d4dd72',skku:'#8e9dff',pohang:'#e3c568',
 'ict-volunteer':'#91c9d0',metaverse:'#c7a2c9','triple-s':'#b6ccaa',
 'mentor-2022':'#e0aca1','mentor-2021':'#b6bbd3',hit:'#c9c5a1',
 likelion:'#91bfc0',tashkent:'#d0acb2',dubai:'#b3c4dc',hcmc:'#d6c19f',
};
export function railColor(id:string):string{
 if(colors[id])return colors[id];
 // Deterministic fallback for new entries without reshuffling existing colors.
 let hash=0;for(const char of id)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
 return `hsl(${hash%360} 32% 72%)`;
}

export function railLabel(id:string):string{return String(Object.keys(colors).indexOf(id)+1).padStart(2,'0');}
