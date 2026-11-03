import {test} from 'node:test';import assert from 'node:assert/strict';import {localizedEntries} from '../src/i18n/entries.ts';import {categoryLabels,translate} from '../src/i18n/ui.ts';
test('confirmed roles, company names and technical terms stay consistent across languages',()=>{
 const ko=new Map(localizedEntries('ko').map(e=>[e.id,e])),en=new Map(localizedEntries('en').map(e=>[e.id,e]));
 assert.equal(ko.get('navy')!.title,'AI개발특기병');assert.equal(ko.get('bannangco')!.title,'대표이사');assert.equal(ko.get('bannangco')!.organization,'(주)반낭코');assert.equal(ko.get('cassopi')!.title,'대표');
 assert.equal(en.get('bannangco')!.title,'Chief Executive Officer');assert.equal(en.get('cassopi')!.title,'Representative');
 for(const entries of [ko,en])for(const id of ['bannangco','cassopi'])assert.doesNotMatch(entries.get(id)!.title,/Founder|창업자/i);
 assert.match(ko.get('ibk')!.summary,/Sector Clustering/);assert.doesNotMatch(JSON.stringify(ko.get('ibk')),/업종별 군집화/);assert.equal(categoryLabels('ko').work,'업무 경력');
 assert.match(translate('Bannangco Co., Ltd. · CEO','ko'),/대표이사/);
});
test('credentials retain historical acquisition dates while using current official names and scoped grades',()=>{
 for(const lang of ['en','ko'] as const){const entries=localizedEntries(lang),c=entries.find(e=>e.id==='craftsman')!,o=entries.find(e=>e.id==='opic')!;
  assert.equal(c.date,'2017-12-27');assert.equal(c.title,lang==='ko'?'프로그래밍기능사':'Craftsman Programming');assert.match(c.details.join(' '),/정보처리기능사/);
  assert.match(o.summary,lang==='ko'?/국내 OPIc 최고/:/highest OPIc grade reported in Korea/);
  const training=entries.find(e=>e.id==='likelion')!;assert.match(training.organization,lang==='ko'?/멋쟁이사자처럼 · 카카오 그라운드X/:/LikeLion · Kakao GroundX/);
  for(const id of ['defense-ms-records-2026','civilian-impact-2026'])assert.match(entries.find(e=>e.id===id)!.organization,/국방M&S 세미나/);
 }
});
