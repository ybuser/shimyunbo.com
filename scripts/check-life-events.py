from playwright.sync_api import sync_playwright
import json
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(reduced_motion='reduce');page.add_init_script('sessionStorage.clear()');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 order=['navy-enlistment','move-suwon','move-pohang','move-ulsan','move-tashkent','move-dubai','move-seoul','move-hcmc','born']
 for lang in ['en','ko']:
  root='/ko/' if lang=='ko' else '/'
  for w in [320,390,768,1440]:
   page.set_viewport_size({'width':w,'height':900});page.goto('http://127.0.0.1:4321'+root+'timeline/?categories=life');page.wait_for_timeout(400)
   visible=page.locator('#chronology>.entry:not([hidden])');assert visible.count()==9
   assert visible.evaluate_all('es=>es.map(e=>e.id)')==order
   ys=[page.locator('#'+id).bounding_box()['y'] for id in order];assert ys==sorted(ys)
   assert not page.locator('[data-rail-id]').count();assert page.locator('#explore-rails').is_disabled()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
   page.screenshot(path=f'/tmp/life-{lang}-{w}.png')
   page.locator('#born summary').focus();page.keyboard.press('Enter');page.wait_for_timeout(150);assert page.locator('#born').evaluate('(e)=>e.open');assert '2001' in page.locator('#born .entry-body').inner_text()
   page.locator('#filter-toggle').click();page.locator('[data-category=work]').click();page.wait_for_timeout(300);assert page.locator('#chronology>.entry:not([hidden])').count()==13
   page.keyboard.press('Escape');page.locator('#explore-rails').click();assert page.locator('#rail-lens').is_visible();page.keyboard.press('Escape')
   page.goto('http://127.0.0.1:4321'+root+'timeline/?categories=honors');page.wait_for_timeout(300)
   award=page.locator('#hackathon-2022');assert award.locator('summary .organization').count()==0;assert award.locator('.award-organizer').is_hidden()
   award.locator('summary').click();page.wait_for_timeout(200);assert award.locator('.award-organizer').is_visible();assert ('한국컴퓨터교육학회' if lang=='ko' else 'Korean Association of Computer Education') in award.locator('.award-organizer').inner_text()
   page.goto('http://127.0.0.1:4321'+root+'timeline/?categories=education');page.wait_for_timeout(300)
   for id in ['dubai','tashkent']:
    text=page.locator('#'+id+' .date').inner_text();assert ('1월' in text and '12월' in text) if lang=='ko' else ('Jan' in text and 'Dec' in text)
   results.append({'lang':lang,'width':w,'life_order_filters_awards_school_dates':'passed'})
 assert not errors,errors;b.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
