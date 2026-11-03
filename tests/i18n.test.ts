import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {localizedEntries,paperTitles} from '../src/i18n/entries.ts';
import {language,localizedPath,korean,categoryLabels} from '../src/i18n/ui.ts';
import {period,dateText,selectEntries} from '../src/lib/timeline.ts';
test('language URLs preserve existing English routes, query and entry anchors',()=>{
 for(const path of ['/','/research/','/research/kiit-2023/','/cv/','/timeline/?categories=work#navy']){
  const ko=localizedPath(path,'ko');assert.equal(language(ko),'ko');assert.equal(localizedPath(ko,'en'),path);assert.equal(localizedPath(ko,'ko'),ko);
 }
 assert.equal(language('/knowledge/'),'en');
});
test('all translations share factual dates, IDs, category membership, chronology and relation targets',()=>{
 const en=localizedEntries('en'),ko=localizedEntries('ko');assert.equal(ko.length,50);
 for(let i=0;i<en.length;i++){for(const key of ['id','date','start','end','ongoing','categories','relatedIds'] as const)assert.deepEqual(ko[i][key],en[i][key]);assert.ok(ko[i].organization);assert.ok(ko[i].details.length);}
 assert.deepEqual(selectEntries(en,[]).map(e=>e.id),selectEntries(ko,[]).map(e=>e.id));assert.equal(Object.keys(categoryLabels('ko')).length,8);
});
test('paper titles use CV Korean titles and overseas originals; English titles and original titles are explicit',()=>{
 const en=localizedEntries('en'),ko=localizedEntries('ko');
 for(const [id,p] of Object.entries(paperTitles)){assert.equal(en.find(e=>e.id===id)?.title,p.en);assert.equal(ko.find(e=>e.id===id)?.title,p.ko);assert.ok(!/[가-힣]/.test(p.en));assert.ok(p.original);}
 assert.equal(paperTitles['kiit-2023'].ko,'가상 환경에서의 고차원 시계열 데이터 시각화');
 assert.equal(paperTitles['icact-2022'].ko,paperTitles['icact-2022'].original);
 assert.equal(en.find(e=>e.id==='drone-hyperspectral-2024')?.date,'2026-06');
 assert.equal(en.find(e=>e.id==='parent-resolution')?.status,'Submitted manuscript');
});
test('localized partial dates retain their precision and ongoing state',()=>{
 assert.equal(dateText('2026-06','ko'),'2026년 6월');assert.equal(dateText('2023-Fall','ko'),'2023년 가을학기');assert.equal(dateText('2013','ko'),'2013년');assert.match(period(localizedEntries('ko').find(e=>e.id==='navy')!,'ko'),/현재$/);
});
test('authored literal UI translation keys are complete',()=>{
 const files=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(dir+'/'+f.name):[dir+'/'+f.name]);
 for(const file of [...files('src/pages'),...files('src/scripts'),...files('src/layouts')]){
  const s=readFileSync(file,'utf8');for(const match of s.matchAll(/\bt\((['"])(.*?)\1\)/g))assert.ok(match[2] in korean,`${file}: ${match[2]}`);
 }
});
