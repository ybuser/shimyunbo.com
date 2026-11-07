import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeCopy,sportIds} from '../src/i18n/home.ts';
const page=readFileSync(new URL('../src/pages/index.astro',import.meta.url),'utf8');
const style=readFileSync(new URL('../src/styles/home.css',import.meta.url),'utf8');

test('homepage introduces interests and hobbies in both languages without experience redirects',()=>{
 for(const lang of ['en','ko'] as const){
  const copy=homeCopy[lang];
  assert.equal(copy.interests.length,3);
  assert.deepEqual(copy.interests.map(i=>i.number),['01','02','03']);
  for(const id of sportIds){assert.ok(copy[id].label);assert.ok(copy[id].title);assert.ok(copy[id].text);}
  assert.ok(copy.techTitle);assert.ok(copy.techText);
 }
 assert.deepEqual(Object.keys(homeCopy.en),Object.keys(homeCopy.ko));
 assert.doesNotMatch(page,/work-notebook|journey-cta|focus-cards|timeline\/|\/research\//);
 const notes=page.slice(page.indexOf('<aside'),page.indexOf('</aside>'));
 assert.doesNotMatch(notes,/<a\s|<button|href=/);
 assert.match(notes,/interest-note/);
});

test('sailing record preserves both years and classes without pairing or invented results',()=>{
 for(const lang of ['en','ko'] as const){
  const record=homeCopy[lang].sailing;
  assert.match(record.years,/2017/);assert.match(record.years,/2018/);
  assert.equal(record.classes,'Laser 2000 · Laser 4.7');
  assert.doesNotMatch(record.classes,/2017|2018/);
 }
 assert.equal(homeCopy.ko.sailing.note,'대한요트협회 등록 선수');
 assert.equal(homeCopy.ko.sailing.result,'전국대회 고등부 2위');
});

test('sport notebook enhances readable HTML with accessible local tabs and brief reduced-motion-safe sketches',()=>{
 assert.match(page,/role="tablist"[^>]+hidden/);
 assert.match(page,/role="tab"[^>]+aria-controls=/);
 assert.match(page,/data-sport-page=\{id\}/);
 const serverPanels=page.slice(page.indexOf('<div class="sport-pages">'),page.indexOf('</Layout>'));
 assert.doesNotMatch(serverPanels,/<article[^>]*hidden/);
 for(const key of ['ArrowRight','ArrowLeft','Home','End'])assert.ok(page.includes(key));
 assert.match(page,/page\.setAttribute\('role','tabpanel'\)/);
 assert.match(page,/page\.tabIndex=0/);
 assert.match(style,/@media\(prefers-reduced-motion:no-preference\)/);
 assert.doesNotMatch(style,/infinite/);
 assert.match(style,/@media\(max-width:400px\)/);
 const sketches=readFileSync(new URL('../src/components/HobbySketch.astro',import.meta.url),'utf8');
 assert.match(sketches,/aria-hidden="true" focusable="false"/);
});
