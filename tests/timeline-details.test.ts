import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localizedEntries} from '../src/i18n/entries.ts';

const page=readFileSync(new URL('../src/pages/timeline.astro',import.meta.url),'utf8');

test('both timeline languages share disclosures without redundant self-links',()=>{
 const korean=readFileSync(new URL('../src/pages/ko/timeline.astro',import.meta.url),'utf8');
 assert.match(korean,/import Page from '\.\.\/timeline\.astro'/);
 assert.doesNotMatch(page,/Link to this entry|이 이력의 링크/);
 assert.doesNotMatch(page,/href=\{['"]#['"]\s*\+\s*e\.id\}/);
 // Meaningful research pages, source links and cross-entry navigation remain.
 assert.ok(page.includes("url('/research/'+e.id+'/')"));
 assert.ok(page.includes('href={link.url}'));
 assert.ok(page.includes('href="#skku"'));
 assert.ok(page.includes('href="#navy"'));
 for(const lang of ['en','ko'] as const){
  const entries=localizedEntries(lang);
  assert.ok(entries.some(e=>e.categories.includes('publications')));
  const links=entries.flatMap(e=>e.links??[]);
  assert.ok(links.length>0);
  assert.ok(links.every(link=>/^https:\/\//.test(link.url)));
 }
});

test('all expanded entries use one timeline-only body, heading and link scale',()=>{
 assert.match(page,/#chronology \.entry-body\s*\{[^}]*--detail-body-size:\s*14px;[^}]*--detail-heading-size:\s*16px;/s);
 assert.match(page,/#chronology \.entry-body :is\(p, a, \.original-title, \.original-title strong\)\s*\{[^}]*font-size: var\(--detail-body-size\);/s);
 assert.match(page,/#chronology \.entry-body :is\(h4, \.paper-title\)\s*\{[^}]*font-size: var\(--detail-heading-size\);/s);
 // Do not let category-specific styles or compact/mobile variants redefine sizes.
 const styles=page.split('<style is:global>')[1];
 assert.ok(styles);
 assert.doesNotMatch(styles,/data-kind|data-event-style|\.compact|@media/);
});
