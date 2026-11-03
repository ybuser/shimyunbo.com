from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlparse
import json
base='http://127.0.0.1:4321'
paths=['/'+str(p.relative_to('dist')).replace('index.html','') for p in Path('dist').rglob('*.html')]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for path in paths:
  r=page.goto(base+path);assert r.status in [200,404],(path,r.status)
  lang='ko' if path.startswith('/ko/') else 'en';assert page.locator('html').get_attribute('lang')==lang,path
  assert page.locator('[data-language][aria-current=page]').get_attribute('data-language')==lang
  assert page.locator('link[rel=alternate][hreflang=ko]').count()==1
  assert page.locator('link[rel=canonical]').count()==1
  for href in page.locator('a[href^="/"]').evaluate_all('es=>es.map(e=>e.getAttribute("href"))'):
   url=urlparse(href);target=Path('dist'+url.path)
   if target.is_dir():target/= 'index.html'
   assert target.exists(),(path,href)
  if '/research/' in path and not path.endswith('/research/'):
   assert page.locator('.original-title').count()==1
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for lang in ['en','ko']:
   root='/ko/' if lang=='ko' else '/'
   for route in ['', 'timeline/','research/','cv/']:
    page.goto(base+root+route);page.wait_for_timeout(300)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,lang,route,'overflow')
    header=page.locator('.site-header');nav=header.locator('.main-navigation').bounding_box();switch=header.locator('.language-toggle').bounding_box()
    assert switch['x']>=0 and switch['x']+switch['width']<=width
    if width<=768:assert switch['y']>=nav['y']+nav['height']-1
    else:assert switch['x']+switch['width']<=nav['x']
    if lang=='ko' and route in ['', 'timeline/']:page.screenshot(path=f'/tmp/i18n-{route.strip("/") or "about"}-{width}.png')
  page.goto(base+'/timeline/?categories=work#bannangco');page.wait_for_timeout(450)
  assert page.locator('#bannangco').evaluate('(e)=>e.open')
  page.locator('[data-language=ko]').click();page.wait_for_timeout(500)
  assert '/ko/timeline/?categories=work#bannangco' in page.url
  assert page.locator('#bannangco').evaluate('(e)=>e.open&&!e.hidden')
  assert page.locator('#results').inner_text()=='4개 이력 · 1개 카테고리 선택'
  page.locator('#filter-toggle').click();page.locator('[data-category=education]').click();page.wait_for_timeout(300)
  page.locator('[data-language=en]').click();page.wait_for_timeout(500);assert 'categories=education%2Cwork' in page.url
  assert page.locator('.entry:not([hidden])').count()==9
  page.go_back();page.wait_for_timeout(500);assert page.locator('html').get_attribute('lang')=='ko'
  page.locator('#explore-rails').focus();page.keyboard.press('Enter');assert page.locator('#rail-lens').is_visible()
  assert page.locator('#rail-lens').get_attribute('aria-label')=='타임라인 돋보기'
  assert '선 선택' in page.locator('.glass-label').inner_text() or '년' in page.locator('.glass-label').inner_text()
  page.keyboard.press('ArrowRight');page.keyboard.press('Enter');page.wait_for_timeout(300);assert page.locator('#rail-lens').is_hidden()
  assert page.locator('.entry.lens-selected[open]').count()==1
  page.goto(base+'/ko/research/drone-hyperspectral-2024/');assert page.locator('h1').inner_text().startswith('임무 중심')
  page.locator('[data-language=en]').click();assert page.locator('h1').inner_text().startswith('An Autoencoder')
  assert 'English translation (unofficial)' in page.locator('.original-title').inner_text()
 for path in ['/files/cv.pdf','/ko/files/cv.pdf']:
  r=page.goto(base+path);assert r.status==404,(path,r.status)
 page.goto(base+'/ko/does-not-exist');page.wait_for_timeout(100);assert page.locator('html').get_attribute('lang')=='ko';assert '페이지를 찾을 수 없습니다' in page.locator('h1').inner_text()
 assert not errors,errors;b.close()
print(json.dumps({'routes':len(paths),'viewports':[320,390,768,1440],'locales':['en','ko'],'links_metadata_filters_switch_back_lens_titles_404_pdf':'passed','errors':errors},ensure_ascii=False,indent=2))
