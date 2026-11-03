"""Check rendered SVG geometry against independently ordered source dates."""
from playwright.sync_api import sync_playwright
import json, subprocess, datetime
entries=json.loads(subprocess.check_output(['node','--experimental-strip-types','--input-type=module','-e',"import {entries} from './src/data/entries.ts'; console.log(JSON.stringify(entries))"],text=True))
source={e['id']:e for e in entries}
def order(s):
 parts=s.split('-');y=int(parts[0]);m=parts[1] if len(parts)>1 else ''
 if m in ['', 'Spring','Fall']:return (y,0,{'':0,'Spring':1,'Fall':2}[m])
 return (y,int(m),int(parts[2]) if len(parts)>2 else 1)
def end(e):
 s=e.get('end',datetime.date.today().isoformat())
 if len(s)==7:
  y,m=map(int,s.split('-'));return f'{y+(m==12):04}-{m%12+1:02}-01'
 return s
def check(page):
 page.wait_for_timeout(350)
 state=page.evaluate('''()=>{const h=document.querySelector('#chronology').getBoundingClientRect().top;return {
 cards:[...document.querySelectorAll('#chronology>.entry:not([hidden]):not(.exit-ghost)')].map(e=>({id:e.id,y:e.getBoundingClientRect().top-h})),
 nodes:[...document.querySelectorAll('#time-lines [data-node-id]:not(.connector)')].map(e=>({id:e.dataset.nodeId,y:e.tagName==='circle'?+e.getAttribute('cy'):+e.getAttribute('y')+4})),
 rails:[...document.querySelectorAll('#time-lines [data-rail-id]')].map(e=>{const l=e.querySelector('.duration-rail');return {id:e.dataset.railId,top:+l.getAttribute('y1'),bottom:+l.getAttribute('y2')}}),
 ticks:[...document.querySelectorAll('#time-lines .year-tick')].map(e=>({date:e.dataset.date,y:+e.querySelector('line').getAttribute('y1')}))}}''')
 assert len(state['nodes'])==len(state['cards']),state
 points=[(order(t['date']),t['y'],t['date']) for t in state['ticks']]
 for n in state['nodes']:
  e=source[n['id']];d=e.get('date') or e.get('end') or datetime.date.today().isoformat();points.append((order(d),n['y'],n['id']))
 for r in state['rails']:
  e=source[r['id']];points.extend([(order(e['start']),r['bottom'],r['id']+' start'),(order(end(e)),r['top'],r['id']+' end')])
 points.sort(key=lambda x:x[0],reverse=True)
 for a,b in zip(points,points[1:]):
  assert a[1]<=b[1]+.01,(a,b)
  if a[0]==b[0]:assert abs(a[1]-b[1])<.01,(a,b)
 cards=state['cards']
 for a,b in zip(cards,cards[1:]):assert a['y']<=b['y']+.1,(a,b)
 # Every dated card header precedes ALL older boundary knots, including tied cards.
 for c in cards:
  e=source[c['id']];date=order(e.get('date') or e.get('end') or datetime.date.today().isoformat())
  for d,y,label in points:
   if d<date:assert c['y']+22<y+.1,(c,label,y)
 rails={r['id']:r for r in state['rails']};ticks={t['date']:t['y'] for t in state['ticks']}
 if 'dubai' in rails and 'tashkent' in rails:
  assert rails['dubai']['top']==rails['tashkent']['bottom']==ticks['2013-01-01']
  assert rails['dubai']['bottom']==ticks['2010-01-01']
  assert rails['tashkent']['top']==ticks['2015-01-01']
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 return len(points)
checks=0
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for lang in ['', 'ko/']:
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900});page.emulate_media(reduced_motion='reduce' if width in [320,768] else 'no-preference')
   for filters in ['life,education','','education','life','life,work']:
    page.goto(f'http://127.0.0.1:4321/{lang}timeline/?categories={filters}');check(page);checks+=1
    if filters=='life,education':
     page.locator('#tashkent summary').click();check(page);checks+=1
     page.locator('#dubai summary').click();check(page);checks+=1
     page.locator('#tashkent').scroll_into_view_if_needed();page.screenshot(path=f'/tmp/axis-{lang.replace("/", "") or "en"}-{width}.png')
     page.locator('#filter-toggle').click()
     for category in ['life','education','life','education']:page.locator(f'[data-category={category}]').click();page.wait_for_timeout(30)
     page.keyboard.press('Escape');check(page);checks+=1
   page.set_viewport_size({'width':390 if width==1440 else 1440,'height':900});check(page);checks+=1
 assert not errors,errors;b.close()
print(json.dumps({'rendered_axis_checks':checks,'widths':[320,390,768,1440],'locales':2,'filter_sets':5,'errors':errors}))
