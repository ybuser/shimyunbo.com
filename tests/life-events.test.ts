import {test} from 'node:test';import assert from 'node:assert/strict';import {entries} from '../src/data/entries.ts';import {localizedEntries} from '../src/i18n/entries.ts';import {selectEntries} from '../src/lib/timeline.ts';import {durationBounds,timeKey} from '../src/lib/layout.ts';
test('authorized life points retain exact supplied precision and both translations',()=>{
 const dates={born:'2001-07-05','move-hcmc':'2002-07','move-seoul':'2007-01','move-dubai':'2009-12','move-tashkent':'2012-12','move-ulsan':'2014-12','move-pohang':'2017-03','move-suwon':'2020-03','navy-enlistment':'2025-08-18'};
 for(const lang of ['en','ko'] as const){const localized=localizedEntries(lang),life=selectEntries(localized,['life']);assert.equal(life.length,9);assert.equal(life[0].id,'navy-enlistment');assert.equal(life.at(-1)!.id,'born');for(const [id,date] of Object.entries(dates)){const e=life.find(e=>e.id===id)!;assert.equal(e.date,date);assert.equal(e.start,undefined);assert.ok(e.milestone);assert.ok(e.title&&e.details.length);}}
 assert.equal(selectEntries(entries,['work']).length,4);assert.equal(selectEntries(entries,['life','work']).length,13);
});
test('corrected school months include their entire final December',()=>{
 for(const [id,start,end,next] of [['dubai','2010-01','2012-12','2013-01-01'],['tashkent','2013-01','2014-12','2015-01-01']]){const e=entries.find(e=>e.id===id)!;assert.equal(e.start,start);assert.equal(e.end,end);assert.equal(durationBounds({...e,start:e.start!}).end,timeKey(next));}
});
test('precise enlistment aligns with the one Navy duration without erasing the now-known August gap',()=>{
 const navy=entries.find(e=>e.id==='navy')!,point=entries.find(e=>e.id==='navy-enlistment')!,b=entries.find(e=>e.id==='bannangco')!;
 assert.equal(navy.start,point.date);assert.equal(entries.filter(e=>e.id.startsWith('navy')&&e.start).length,1);
 assert.ok(durationBounds({...navy,start:navy.start!}).start>durationBounds({...b,start:b.start!}).end);
});
