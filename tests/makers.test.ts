import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localizedEntries} from '../src/i18n/entries.ts';
import {selectEntries} from '../src/lib/timeline.ts';
import {durationBounds,timeKey} from '../src/lib/layout.ts';
import {railColor,railLabel} from '../src/lib/rail-colors.ts';
test('Makers Secretariat is a separate bilingual activity with owner-confirmed dates and role',()=>{
 for(const lang of ['en','ko'] as const){
  const entries=localizedEntries(lang),makers=entries.find(e=>e.id==='makers-secretariat')!,school=entries.find(e=>e.id==='pohang')!;
  assert.deepEqual(makers.categories,['activities']);assert.equal(makers.start,'2018-03');assert.equal(makers.end,'2019-12');
  assert.equal(durationBounds({...makers,start:makers.start!}).end,timeKey('2020-01-01'));
  assert.ok(makers.details.join(' ').includes('1기 사무국장'));
  for(const name of ['무한상상 메이커즈','함께하는 메이커즈'])assert.ok(makers.details.join(' ').includes(name));
  assert.ok(!/Makers|메이커즈/i.test(school.details.join(' ')));
  assert.deepEqual(school.categories,['education']);assert.equal(school.start,'2017-03');assert.equal(school.end,'2020-02');
  assert.ok(!selectEntries(entries,['education']).some(e=>e.id===makers.id));
  assert.equal(selectEntries(entries,['activities']).filter(e=>e.id===makers.id).length,1);
  const ids=selectEntries(entries,[]).map(e=>e.id);assert.ok(ids.indexOf('pohang')<ids.indexOf(makers.id));assert.ok(ids.indexOf(makers.id)<ids.indexOf('move-pohang'));
 }
 assert.notEqual(railColor('makers-secretariat'),railColor('pohang'));assert.notEqual(railLabel('makers-secretariat'),'00');
});
