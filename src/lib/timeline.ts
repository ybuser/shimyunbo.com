import type { Entry, Category } from '../data/entries.ts';
export function dateText(value?: string): string {
 if (!value) return '';
 const [y,m,d]=value.split('-');
 if (!m) return y;
 if (m==='Spring'||m==='Fall') return `${m} ${y}`;
 const month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m)-1];
 return `${month}${d ? ` ${Number(d)},` : ''} ${y}`;
}
export function period(e: Entry): string { return e.dateLabel ?? (e.date ? dateText(e.date) : `${dateText(e.start)} — ${e.ongoing ? 'Present' : dateText(e.end)}`); }
// Missing months/days sort last within their known bucket; semester is its own bucket.
function key(d=''): number[] { const [y,m,day]=d.split('-'); return [Number(y)||0, m==='Fall'||m==='Spring' ? 0 : Number(m)||0, Number(day)||0,m==='Fall'?2:m==='Spring'?1:0]; }
export function compareEntries(a:Entry,b:Entry):number {
 if (!!a.ongoing!==!!b.ongoing) return a.ongoing?-1:1;
 const ak=key(a.ongoing?a.start:a.date??a.end), bk=key(b.ongoing?b.start:b.date??b.end);
 for(let i=0;i<ak.length;i++) if(ak[i]!==bk[i]) return bk[i]-ak[i];
 return a.id.localeCompare(b.id);
}
export function selectEntries(items:Entry[], selected:Category[]):Entry[]{return [...new Map(items.map(e=>[e.id,e])).values()].filter(e=>!selected.length||e.categories.some(c=>selected.includes(c))).sort(compareEntries);}
export function groupLabel(e:Entry):string { return e.ongoing ? 'Present' : (e.date??e.end??e.start??'').slice(0,4); }
