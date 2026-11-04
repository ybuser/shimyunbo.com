import {test} from 'node:test';import assert from 'node:assert/strict';
import {localizedEntries} from '../src/i18n/entries.ts';import {selectEntries} from '../src/lib/timeline.ts';import {durationBounds,timeKey} from '../src/lib/layout.ts';import {railLabel} from '../src/lib/rail-colors.ts';
test('fanCake is one bilingual startup duration with confirmed role, month precision and source links',()=>{
 for(const lang of ['en','ko'] as const){
  const entries=localizedEntries(lang),e=entries.find(e=>e.id==='fancake')!;
  assert.equal(entries.filter(e=>e.id==='fancake').length,1);assert.equal(e.project,true);assert.ok(e.title.includes('CTO'));
  assert.equal(e.start,'2021-04');assert.equal(e.end,'2021-12');assert.deepEqual(durationBounds({...e,start:e.start!}),{start:timeKey('2021-04-01'),end:timeKey('2022-01-01')});
  assert.ok(selectEntries(entries,['activities']).some(item=>item.id==='fancake'));
  assert.equal(selectEntries(entries,['education']).filter(e=>e.id==='fancake').length,0);
  assert.deepEqual(e.links?.map(l=>l.url),['https://github.com/ybuser/fancake_frontend','https://github.com/ybuser/fanCake','https://m.blog.naver.com/dreamkonkuk/222633750705']);
  const ids=selectEntries(entries,[]).map(e=>e.id);assert.ok(ids.indexOf('jade-apple-studio')<ids.indexOf('fancake'));assert.ok(ids.indexOf('fancake')<ids.indexOf('makers-secretariat'));
 }
 assert.notEqual(railLabel('fancake'),'00');
});
