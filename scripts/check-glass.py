from playwright.sync_api import sync_playwright
import json
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [390,768,1440]:
  ctx=b.new_context(viewport={'width':width,'height':844},has_touch=True,reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def load():
   page.goto('http://127.0.0.1:4321/timeline/');page.wait_for_timeout(500)
  def open_glass(target_index=0):
   rail_data=page.locator('[data-rail-id]').evaluate_all('es=>es.map(e=>{const l=e.querySelector(".duration-rail");return {id:e.dataset.railId,x:+l.getAttribute("x1"),top:+l.getAttribute("y1"),bottom:+l.getAttribute("y2")}})')
   y=max([(r['top']+r['bottom'])/2 for r in rail_data],key=lambda y:sum(r['top']<y<r['bottom'] for r in rail_data))
   active=sorted([r for r in rail_data if r['top']<y<r['bottom']],key=lambda r:r['x']);target=active[target_index]
   page.evaluate('(y)=>scrollTo(0,document.querySelector("#chronology").getBoundingClientRect().top+scrollY+y-400)',y);page.wait_for_timeout(100)
   rect=page.locator('#chronology').bounding_box();page.touchscreen.tap(rect['x']+target['x'],rect['y']+y);page.wait_for_timeout(100)
   return target
  for index in [0,1,2]:
   load();target=open_glass(index);lens=page.locator('#rail-lens');assert lens.is_visible();assert lens.locator('.lens-choice').count()==0
   glass=lens.locator('.glass-viewport');rect=glass.bounding_box();assert rect['x']>=0 and rect['x']+rect['width']<=width and rect['y']>=0 and rect['y']+rect['height']<=844
   scene=lens.locator('svg').evaluate('(e)=>e.getAttribute("viewBox").split(" ").map(Number)');assert scene[2]<rect['width']/3
   if index==1:page.screenshot(path=f'/tmp/literal-glass-{width}.png')
   target_button=lens.locator('[data-entry-id="'+target['id']+'"]');r=target_button.bounding_box();page.touchscreen.tap(r['x']+r['width']/2,rect['y']+rect['height']/2);page.wait_for_timeout(450)
   assert lens.is_hidden();assert page.locator('#'+target['id']).evaluate('(e)=>e.open && e.classList.contains("lens-selected")')
  load();open_glass(1);before=page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)');page.touchscreen.tap(width-2,2);assert page.locator('#rail-lens').is_hidden();assert before==page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)')
  # Dragging pans the true optical crop and never selects an underlying line.
  open_glass(1);vp=page.locator('.glass-viewport');r=vp.bounding_box();old=page.locator('.lens-scene').get_attribute('viewBox')
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+r['width']/2+55,r['y']+r['height']/2,steps=6);page.mouse.up();page.wait_for_timeout(100)
  assert page.locator('#rail-lens').is_visible();assert page.locator('.lens-scene').get_attribute('viewBox')!=old;page.keyboard.press('Escape')
  # Invisible square corners are outside the circular lens, and must dismiss only.
  open_glass(1);r=page.locator('.glass-viewport').bounding_box();before=page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)')
  page.touchscreen.tap(r['x']+2,r['y']+2);assert page.locator('#rail-lens').is_hidden();assert before==page.locator('.entry[open]').evaluate_all('es=>es.map(e=>e.id)')
  trigger=page.locator('#explore-rails');trigger.focus();page.keyboard.press('Enter');assert page.locator('#rail-lens').is_visible();page.keyboard.press('ArrowRight');page.keyboard.press('Escape');assert trigger.evaluate('(e)=>e===document.activeElement')
  for _ in range(3):trigger.click();page.keyboard.press('Escape')
  trigger.click();page.mouse.wheel(0,250);page.wait_for_timeout(150);assert page.locator('#rail-lens').is_hidden()
  page.goto('http://127.0.0.1:4321/timeline/?categories=work');page.wait_for_timeout(400);trigger.click();assert set(page.locator('.glass-line').evaluate_all('es=>es.map(e=>e.dataset.entryId)'))<=set(['navy','bannangco','codime','cassopi'])
  page.set_viewport_size({'width':width,'height':740});page.wait_for_timeout(100);assert page.locator('#rail-lens').is_hidden();assert not errors,errors
  results.append({'width':width,'three_adjacent_lines_touch_selected':'passed','outside_keyboard_filter_scroll_resize':'passed'});ctx.close()
 b.close()
print(json.dumps(results,indent=2))
