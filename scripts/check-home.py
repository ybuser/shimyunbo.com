"""Homepage regression QA. Run against the local preview or an authorized deployment."""
import json
import os
from playwright.sync_api import sync_playwright
BASE = os.getenv('BASE_URL', 'http://127.0.0.1:4321').rstrip('/')
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
    for lang, route in [('en', '/'), ('ko', '/ko/')]:
        for width in [320, 390, 768, 1440]:
            page = browser.new_page(viewport={'width': width, 'height': 950})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(BASE + route)
            assert page.locator('html').get_attribute('lang') == lang
            assert page.locator('.interest-note').count() == 3
            assert page.locator('.interest-notes a, main a[href*="timeline"]').count() == 0
            assert page.locator('.sport-picker').is_visible()
            initial = page.url
            for sport in ['sailing', 'running', 'climbing', 'running', 'sailing', 'sailing']:
                page.locator('#tab-' + sport).click()
                assert page.url == initial
                assert page.locator('#sport-' + sport).is_visible()
                assert page.locator('[role=tabpanel]:visible').count() == 1
                assert page.locator('#tab-' + sport).get_attribute('aria-selected') == 'true'
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.locator('#tab-sailing').press('ArrowRight')
            assert page.locator('#tab-running').evaluate('e => e === document.activeElement')
            page.locator('#tab-running').press('End')
            assert page.locator('#sport-climbing').is_visible()
            page.locator('#tab-climbing').press('Home')
            page.locator('#tab-sailing').press('ArrowLeft')
            assert page.locator('#tab-climbing').evaluate('e => e === document.activeElement')
            page.locator('#tab-climbing').press('Tab')
            assert page.locator('#sport-climbing').evaluate('e => e === document.activeElement')
            page.locator('#tab-sailing').click()
            page.emulate_media(reduced_motion='reduce')
            assert page.locator('.playgrounds').evaluate('e => e.getAnimations({subtree:true}).length') == 0
            assert not errors, errors
            page.screenshot(path=f'/tmp/shimyunbo-home-{lang}-{width}.png', full_page=True)
            results.append({'language': lang, 'width': width, 'tabs_keyboard_overflow_motion': 'passed'})
            page.close()
        context = browser.new_context(java_script_enabled=False, viewport={'width': 320, 'height': 950})
        page = context.new_page()
        page.goto(BASE + route)
        assert page.locator('.sport-picker').is_hidden()
        for sport in ['sailing', 'running', 'climbing']:
            assert page.locator('#sport-' + sport).is_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        context.close()
    browser.close()
print(json.dumps(results, indent=2))
