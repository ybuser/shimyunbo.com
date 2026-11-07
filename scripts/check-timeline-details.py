"""Run against the static preview on port 4321 after building.
Check the actual typography cascade and useful links in every EN/KO disclosure.
"""
import os
from playwright.sync_api import sync_playwright

BASE = os.getenv('BASE_URL', 'http://127.0.0.1:4321').rstrip('/')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(reduced_motion='reduce')
    for width in [320, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        for language in ['en', 'ko']:
            path = '/ko/timeline/' if language == 'ko' else '/timeline/'
            page.goto(BASE + path)
            page.locator('.entry').evaluate_all('(es) => es.forEach(e => e.open = true)')
            page.wait_for_timeout(400)
            failures = page.locator('.entry').evaluate_all('''entries => entries.flatMap(entry => {
                const errors = [];
                const check = (element, size) => {
                    if (getComputedStyle(element).fontSize !== size)
                        errors.push(`${entry.id}: ${element.tagName} expected ${size}, got ${getComputedStyle(element).fontSize}`);
                };
                check(entry.querySelector('.entry-body'), '14px');
                entry.querySelectorAll('.entry-body p, .entry-body a, .original-title, .original-title strong').forEach(el => check(el, '14px'));
                entry.querySelectorAll('.entry-body h4').forEach(el => check(el, '16px'));
                entry.querySelectorAll('.entry-body a').forEach(a => {
                    const target = new URL(a.href);
                    if (target.origin === location.origin && target.pathname === location.pathname && (!target.hash || target.hash === '#' + entry.id))
                        errors.push(`${entry.id}: redundant same-entry link ${a.href}`);
                });
                return errors;
            })''')
            assert not failures, (width, language, failures)
            assert page.locator('.entry-body a[href^="https://"]').count() > 0
            publications = page.locator('.entry[data-event-style="publication"]')
            assert publications.count() == page.locator('.entry-body a[href^="' + ('/ko' if language == 'ko' else '') + '/research/"]').count()
            assert page.locator('#navy-enlistment .entry-body a[href="#navy"]').count() == 1
            assert page.locator('.entry-body a[href="#skku"]').count() > 0
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, language, 'overflow')
    browser.close()
print('Timeline disclosures: consistent typography and useful links at all four widths in both languages.')
