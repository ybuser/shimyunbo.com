from playwright.sync_api import sync_playwright
import json
out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [390,768,1440]:
  ctx=b.new_context(viewport={'width':width,'height':844},has_touch=True,reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:4321/timeline/');page.wait_for_timeout(700)
  rails=page.locator('[data-rail-id]').evaluate_all('es=>es.map(e=>{const l=e.querySelector(".duration-rail");return {id:e.dataset.railId,top:+l.getAttribute("y1"),bottom:+l.getAttribute("y2")}})')
  y=max([(r['top']+r['bottom'])/2 for r in rails],key=lambda y:sum(r['top']<=y<=r['bottom'] for r in rails))
  expected=[r['id'] for r in rails if r['top']<=y<=r['bottom']]
  assert len(expected)>1
  def touch_position(y):
   page.evaluate('(y)=>scrollTo(0,document.querySelector("#chronology").getBoundingClientRect().top+scrollY+y-400)',y)
   page.wait_for_timeout(150)
   point=page.locator('#rail-hit-area').evaluate('(e,y)=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+y}}',y)
   page.touchscreen.tap(point['x'],point['y']);page.wait_for_timeout(150)
  touch_position(y)
  lens=page.locator('#rail-lens');assert lens.is_visible()
  actual=lens.locator('.lens-choice').evaluate_all('es=>es.map(e=>e.dataset.entryId)');assert actual==expected,(actual,expected)
  rect=lens.bounding_box();assert rect['x']>=0 and rect['y']>=0 and rect['x']+rect['width']<=width and rect['y']+rect['height']<=844
  page.screenshot(path=f'/tmp/duration-lens-{width}.png')
  before=page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)');scroll=page.evaluate('scrollY');page.touchscreen.tap(width-3,5);assert lens.is_hidden();assert before==page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)');assert scroll==page.evaluate('scrollY')
  touch_position(y)
  # A focusable outside summary must dismiss only, not toggle its disclosure.
  target=page.evaluate('''()=>{const bottom=document.querySelector('#rail-lens').getBoundingClientRect().bottom;for(const s of document.querySelectorAll('.entry:not([hidden]):not([open]) summary')){const r=s.getBoundingClientRect(),y=Math.max(r.top+8,bottom+15);if(y<Math.min(r.bottom-4,innerHeight-10))return {id:s.parentElement.id,x:r.left+r.width/2,y}}return null}''')
  if target:
   page.touchscreen.tap(target['x'],target['y']);assert lens.is_hidden();assert not page.locator('#'+target['id']).evaluate('(e)=>e.open')
  else:page.keyboard.press('Escape')
  touch_position(y);chosen=expected[0];lens.locator('[data-entry-id="'+chosen+'"]').click();page.wait_for_timeout(600)
  assert lens.is_hidden();entry=page.locator('#'+chosen);assert entry.evaluate('(e)=>e.open && e.classList.contains("lens-selected")');assert entry.locator('summary').evaluate('(e)=>e===document.activeElement')
  rect=entry.bounding_box();assert rect['y']<844 and rect['y']+rect['height']>0
  trigger=page.locator('#explore-rails');trigger.focus();page.keyboard.press('Enter');assert lens.is_visible();page.keyboard.press('Escape');assert lens.is_hidden();assert trigger.evaluate('(e)=>e===document.activeElement')
  for _ in range(3):
   trigger.click();assert lens.is_visible();page.keyboard.press('Escape');assert lens.is_hidden()
  trigger.click();page.mouse.wheel(0,350);page.wait_for_timeout(250);assert lens.is_hidden()
  trigger.click();page.locator('#filter-toggle').click();assert lens.is_hidden();assert page.locator('#filter-panel').is_hidden()
  page.locator('#filter-toggle').click();page.locator('[data-category=work]').click();page.keyboard.press('Escape');page.wait_for_timeout(500);trigger.click();assert lens.is_visible();assert set(lens.locator('.lens-choice').evaluate_all('es=>es.map(e=>e.dataset.entryId)'))<=set(['navy','bannangco','codime','cassopi'])
  page.set_viewport_size({'width':width,'height':740});page.wait_for_timeout(300);assert lens.is_hidden()
  page.goto('http://127.0.0.1:4321/timeline/?categories=publications');page.wait_for_timeout(500);assert trigger.is_disabled()
  paper=page.locator('#parent-resolution');assert 'Parent Resolution' not in paper.locator('summary').inner_text();assert 'ACL Rolling Review' in paper.locator('summary').inner_text();assert 'Submitted manuscript' in paper.locator('summary').inner_text();paper.locator('summary').click();assert paper.locator('.paper-title').is_visible()
  page.goto('http://127.0.0.1:4321/timeline/?categories=education');page.wait_for_timeout(500);school=page.locator('#skku');school.evaluate('(e)=>e.open=false');page.wait_for_timeout(300);assert '3.94' not in school.locator('summary').inner_text();school.locator('summary').click();assert '3.94' in school.locator('.entry-body').inner_text();assert 'School education' not in page.locator('#tashkent').inner_text()
  assert not errors,errors;out.append({'width':width,'overlapping_candidates':len(expected),'touch_keyboard_focus_scroll_filter_resize':'passed'});ctx.close()
 b.close()
print(json.dumps(out,indent=2))
