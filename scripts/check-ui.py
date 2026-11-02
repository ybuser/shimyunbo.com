from playwright.sync_api import sync_playwright
import json
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 def check_layout():
  page.wait_for_timeout(500)
  info=page.evaluate('''()=>{const a=[...document.querySelectorAll('#chronology>.entry:not([hidden]):not(.exit-ghost)')].map(c=>{const r=c.getBoundingClientRect();return {id:c.id,x:r.x,y:r.y,w:r.width,h:r.height}});let overlaps=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){let x=a[i],y=a[j];if(x.x<y.x+y.w-1&&x.x+x.w>y.x+1&&x.y<y.y+y.h-1&&x.y+x.h>y.y+1)overlaps.push([x.id,y.id])}return {overlaps,count:a.length,sides:new Set(a.map(x=>x.x)).size,overflow:document.documentElement.scrollWidth>innerWidth}}''')
  assert not info['overlaps'],info
  assert not info['overflow'],info
  return info
 for width in [390,768,1440]:
  page.set_viewport_size({'width':width,'height':950});page.goto('http://127.0.0.1:4321/timeline/');r=check_layout()
  if width==1440:assert r['sides']==2
  assert page.locator('.entry[data-kind="event"]').evaluate_all("es=>es.every(e=>getComputedStyle(e).backgroundColor==='rgba(0, 0, 0, 0)' && getComputedStyle(e).borderTopWidth==='0px')")
  assert page.locator('.entry[data-kind="duration"]').evaluate_all("es=>es.every(e=>parseFloat(getComputedStyle(e).borderLeftWidth)>=3)")
  first=page.locator('.entry[data-kind="event"] summary').first
  first.focus();page.keyboard.press('Enter');page.wait_for_timeout(300)
  assert first.evaluate('(e)=>e.parentElement.open')
  check_layout();page.keyboard.press('Enter');check_layout()

  page.locator('#filter-toggle').click();page.locator('[data-category="research"]').click();check_layout()
  page.locator('[data-category="honors"]').click();check_layout()
  page.keyboard.press('Escape');assert page.locator('#filter-toggle').evaluate('(e)=>e===document.activeElement')
  page.locator('.entry:not([hidden]) summary').first.click();check_layout()
  page.locator('#filter-toggle').click()
  for c in ['work','education','activities','certificates','publications']*3:page.locator('[data-category="'+c+'"]').click()
  check_layout();page.locator('#reset').click();check_layout()
  page.mouse.click(5,5);assert page.locator('#filter-panel').is_hidden()
  page.evaluate('window.scrollTo(0,1500)');assert page.locator('#filter-toggle').bounding_box()['y']<950
  page.evaluate('window.scrollTo(0,0)');page.screenshot(path=f'/tmp/shimyunbo-revised-timeline-{width}.png')
  page.goto('http://127.0.0.1:4321/');assert page.locator('a[href="https://www.linkedin.com/in/yunbo-shim"]').count()==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=f'/tmp/shimyunbo-revised-home-{width}.png')
  results.append({'width':width,'layout':r,'filters_expansion_focus_scroll':'passed'})
 page.emulate_media(reduced_motion='reduce');page.goto('http://127.0.0.1:4321/timeline/');check_layout();page.locator('#filter-toggle').click();page.locator('[data-category="work"]').click();check_layout();assert page.locator('#chronology').evaluate('(e)=>e.getAnimations({subtree:true}).length')==0
 page.set_viewport_size({'width':1440,'height':950});check_layout();page.set_viewport_size({'width':390,'height':950});check_layout()
 assert not errors,errors
 print(json.dumps({'results':results,'errors':errors,'reduced_motion_resize':'passed'},indent=2))
 b.close()
