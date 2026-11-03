import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
test('unfinished CV is excluded from public assets and download navigation',()=>{
 assert.equal(existsSync(new URL('../public/files/cv.pdf',import.meta.url)),false);
 const cv=readFileSync(new URL('../src/pages/cv.astro',import.meta.url),'utf8');
 assert.equal(cv.includes('/files/cv.pdf'),false);
 const generator=readFileSync(new URL('../scripts/generate-cv.py',import.meta.url),'utf8');
 assert.equal(generator.includes('public/files/cv.pdf'),false);
});
