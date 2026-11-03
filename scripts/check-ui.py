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
  chronology=page.evaluate('''()=>{const ids=['excellence-2023','ta-fall','ta-spring','ibk'];return Object.fromEntries(ids.map(id=>{const e=document.getElementById(id);return [id,e.hidden?null:e.getBoundingClientRect().top]}))}''')
  if chronology['ibk'] is not None:
   for key in ['excellence-2023','ta-fall','ta-spring']:
    if chronology[key] is not None:assert chronology[key]<chronology['ibk'],chronology
  return info
 for width in [390,768,1440]:
  page.set_viewport_size({'width':width,'height':950});page.goto('http://127.0.0.1:4321/timeline/');r=check_layout()
  if width==1440:assert r['sides']==2
  def rail_state():
   return page.locator('[data-rail-id]').evaluate_all("es=>Object.fromEntries(es.map(e=>{const l=e.querySelector('.duration-rail');return [e.dataset.railId,{color:getComputedStyle(l).stroke,x:l.getAttribute('x1'),start:l.getAttribute('y2'),end:l.getAttribute('y1')}]}))")
  period=page.locator('#navy summary');period.focus();page.wait_for_timeout(200)
  assert page.locator('[data-rail-id=navy]').evaluate('(e)=>e.classList.contains("is-traced")')
  assert page.locator('[data-rail-id=bannangco]').evaluate('(e)=>parseFloat(getComputedStyle(e).opacity)<.2')
  page.locator('#filter-toggle').focus()
  page.locator('#ibk summary').click();check_layout()
  page.locator('#ibk summary').click();check_layout()
  rails=rail_state()
  assert rails['navy']['start']==rails['bannangco']['end'],rails
  assert rails['navy']['x']==rails['bannangco']['x'],rails
  assert rails['navy']['color']!=rails['bannangco']['color']
  page.locator('#filter-toggle').click();page.locator('[data-category="work"]').click();check_layout()
  filtered=rail_state()
  assert filtered['navy']['start']==filtered['bannangco']['end']
  assert all(v['color']==rails[k]['color'] for k,v in filtered.items())
  page.locator('#reset').click();page.keyboard.press('Escape');check_layout()

  assert page.locator('.entry[data-event-style="certificate"]').first.evaluate("e=>getComputedStyle(e).borderTopWidth==='1px'")
  assert page.locator('.entry[data-event-style="publication"]').first.evaluate("e=>getComputedStyle(e).borderLeftWidth==='3px'")
  assert page.locator('.entry[data-kind="duration"]').evaluate_all("es=>es.every(e=>parseFloat(getComputedStyle(e).borderTopWidth)>=2 || e.dataset.visual==='volunteering')")
  credential=page.locator('#opic')
  credential.evaluate('(e)=>e.open=false');check_layout()
  closed=credential.bounding_box()['height'];assert closed<95,closed
  assert credential.locator('.organization').is_hidden()
  credential.locator('summary').focus();page.keyboard.press('Enter');check_layout()
  assert credential.evaluate('(e)=>e.open')
  assert credential.bounding_box()['height']>closed
  assert credential.locator('.organization').is_visible()
  page.locator('#filter-toggle').click();page.locator('[data-category="research"]').click();check_layout()
  page.go_back();check_layout();assert credential.is_visible() and credential.evaluate('(e)=>e.open')
  page.keyboard.press('Escape');credential.locator('summary').focus();page.keyboard.press('Enter');check_layout()
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
  page.goto('http://127.0.0.1:4321/');assert page.locator('.profile-art').count()==0
  assert page.locator('.work-notebook a').count()==3
  assert page.get_by_text('I explore ideas through research and build them into software.',exact=True).count()==0
  assert page.locator('a[href="https://www.linkedin.com/in/yunbo-shim"]').count()==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=f'/tmp/shimyunbo-revised-home-{width}.png')
  results.append({'width':width,'layout':r,'filters_expansion_focus_scroll':'passed'})
 page.emulate_media(reduced_motion='reduce');page.goto('http://127.0.0.1:4321/timeline/');check_layout();page.locator('#filter-toggle').click();page.locator('[data-category="work"]').click();check_layout();assert page.locator('#chronology').evaluate('(e)=>e.getAnimations({subtree:true}).length')==0
 page.set_viewport_size({'width':1440,'height':950});check_layout();page.set_viewport_size({'width':390,'height':950});check_layout()
 page.goto('http://127.0.0.1:4321/cv/');assert page.locator('a[download],a[href="/files/cv.pdf"]').count()==0
 missing=page.request.get('http://127.0.0.1:4321/files/cv.pdf');assert missing.status==404,missing.status
 page.goto('http://127.0.0.1:4321/research/')
 assert page.locator('a[href="https://github.com/ybuser/Academic-MOIRAI"]').count()==1
 assert page.locator('a[href="https://github.com/ybuser/fancake_frontend"]').count()==1
 assert not errors,errors
 print(json.dumps({'results':results,'errors':errors,'reduced_motion_resize':'passed'},indent=2))
 b.close()
