import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {articles,latestArticles,articleDate} from '../src/data/articles.ts';
import {articleCopy} from '../src/i18n/articles.ts';
import {localizedPath} from '../src/i18n/ui.ts';

test('two bilingual articles and three empty slots preserve the supplied story dates',()=>{
 assert.equal(articles.length,5);
 assert.equal(new Set(articles.map(a=>a.id)).size,5);
 assert.deepEqual(articles.map(a=>a.number),['01','02','03','04','05']);
 assert.deepEqual(articles.map(a=>a.date),['2026-11-05','2026-11-06',null,null,null]);
 for(const article of articles){
  assert.equal(article.status,Number(article.number)<=2?'published':'placeholder');
  for(const lang of ['en','ko'] as const){
   assert.ok(article.copy[lang].title);assert.ok(article.copy[lang].category);
   if(article.status==='placeholder')assert.deepEqual(article.copy[lang].paragraphs,[]);
   else assert.ok(article.copy[lang].paragraphs.length>=2);
   assert.ok(localizedPath(`/articles/${article.id}/`,lang).endsWith(`/${article.id}/`));
  }
 }
 assert.match(articles[0].copy.en.title,/shimyunbo.com/);
 assert.equal(articles[0].copy.ko.title,'shimyunbo.com [경]大 오 픈[축]');
 assert.match(articles[1].copy.en.title,/Busan Centum City/);
 assert.match(articles[1].copy.ko.title,/부산 센텀시티/);
 assert.deepEqual(Object.keys(articleCopy.en),Object.keys(articleCopy.ko));
});
test('newest-first sorting does not fabricate dates or mutate planned sequence',()=>{
 assert.deepEqual(latestArticles().map(a=>a.number),['02','01','03','04','05']);
 assert.equal(articles[0].number,'01');
 assert.equal(articleDate('2026-11-05','en'),'Nov 5, 2026');
 assert.match(articleDate('2026-11-06','ko'),/2026.*11.*6/);
});
test('the Navy story places four approved photos with localized captions and no originals',()=>{
 const navy=articles.find(a=>a.id==='navy-ax-center-opening')!;
 assert.equal(navy.photos?.length,4);
 assert.equal(new Set(navy.photos!.map(p=>p.src)).size,4);
 for(const photo of navy.photos!){
  assert.match(photo.src,/^\/images\/articles\/navy-ax-center-opening\/navy-ax-center-[a-z]+\.webp$/);
  assert.ok(existsSync('public'+photo.src));
  assert.ok(photo.width>0&&photo.height>0);
  for(const lang of ['en','ko'] as const){
   assert.ok(photo.copy[lang].alt);assert.ok(photo.copy[lang].caption);
   assert.ok(photo.copy[lang].afterParagraph>=1&&photo.copy[lang].afterParagraph<=navy.copy[lang].paragraphs.length);
  }
 }
 assert.equal(readdirSync('public/images/articles/navy-ax-center-opening').length,4);
 assert.equal(articles[0].photos,undefined);
});
test('empty pages are explicit, crawlable between languages, and not indexed as published articles',()=>{
 const page=readFileSync('src/pages/articles/[slug].astro','utf8');
 const list=readFileSync('src/components/ArticleList.astro','utf8');
 const layout=readFileSync('src/layouts/Layout.astro','utf8');
 assert.match(page,/noindex=\{empty\}/);
 assert.match(layout,/name="robots" content="noindex, follow"/);
 assert.match(page,/copy\.emptyText/);assert.match(page,/copy\.dateNote/);assert.match(page,/copy\.undatedNote/);
 assert.match(list,/href=\{localizedPath\(`\/articles\/\$\{article.id\}\//);
 assert.doesNotMatch(list,/href="#/);
 assert.match(page,/localizedPath\('\/#latest',lang\)/);
});
