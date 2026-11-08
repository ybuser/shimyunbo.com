"""Journal page, metadata, navigation, responsive and no-JS regression checks."""
import os, json
from playwright.sync_api import sync_playwright
BASE = os.getenv('BASE_URL', 'http://127.0.0.1:4321').rstrip('/')
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
    for lang, prefix in [('en', ''), ('ko', '/ko')]:
        for width in [320, 390, 768, 1440]:
            context = browser.new_context(viewport={'width': width, 'height': 950}, reduced_motion='reduce')
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(BASE + prefix + '/')
            links = page.locator('#latest .article-link')
            assert links.count() == 5
            assert page.locator('#latest time').evaluate_all('(els) => els.map(e => e.dateTime)') == ['2026-11-06', '2026-11-05']
            targets = links.evaluate_all('(els) => els.map(e => e.getAttribute("href"))')
            assert len(set(targets)) == 5
            assert page.locator('#latest .is-undated').count() == 3
            for i, target in enumerate(targets):
                page.goto(BASE + target)
                assert page.locator('html').get_attribute('lang') == lang
                if i < 2:
                    assert page.locator('.article-body').is_visible()
                    assert page.locator('.empty-manuscript').count() == 0
                    assert page.locator('meta[name=robots]').count() == 0
                else:
                    assert page.locator('.empty-manuscript').is_visible()
                    assert page.locator('meta[name=robots]').get_attribute('content') == 'noindex, follow'
                assert page.locator('h1').count() == 1
                assert page.locator('link[rel=canonical]').get_attribute('href') == 'https://shimyunbo.com' + target
                assert page.locator('link[hreflang=en]').count() == 1
                assert page.locator('link[hreflang=ko]').count() == 1
                assert page.locator('.article-byline time').count() == (1 if i < 2 else 0)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                assert target not in page.locator('.more-articles .article-link').evaluate_all('(els) => els.map(e => e.getAttribute("href"))')
                if i == 0:
                    assert page.locator('.article-photo').count() == 4
                    for photo in page.locator('.article-photo img').all():
                        photo.scroll_into_view_if_needed()
                        photo.evaluate('(img) => img.decode()')
                        assert photo.evaluate('(img) => img.naturalWidth === Number(img.getAttribute("width")) && img.naturalHeight === Number(img.getAttribute("height"))')
                        assert photo.get_attribute('alt')
                    assert page.locator('.article-photo figcaption').count() == 4
                    photo_link = page.locator('.article-photo a').first
                    photo_target = photo_link.get_attribute('href')
                    photo_link.click()
                    assert page.url.endswith(photo_target)
                    page.go_back()
                    assert page.url.endswith(target)
                    page.screenshot(path=f'/tmp/shimyunbo-article-{lang}-{width}.png', full_page=True)
                    page.locator('.journal-back').click()
                    assert page.url.endswith(prefix + '/#latest')
                    page.go_back()
                    assert page.url.endswith(target)
                    page.go_forward()
                    assert page.url.endswith(prefix + '/#latest')
            page.goto(BASE + targets[0])
            other = 'ko' if lang == 'en' else 'en'
            page.locator('[data-language=' + other + ']').click()
            assert page.locator('html').get_attribute('lang') == other
            assert page.url.endswith('/articles/navy-ax-center-opening/')
            assert not errors, errors
            results.append({'lang': lang, 'width': width, 'five_pages_metadata_history': 'passed'})
            context.close()
        context = browser.new_context(java_script_enabled=False, viewport={'width':320,'height':950})
        page = context.new_page()
        page.goto(BASE + prefix + '/')
        page.locator('#latest .article-link').first.click()
        assert page.locator('.article-body').is_visible()
        assert page.locator('.article-photo').count() == 4
        page.locator('.journal-return').click()
        assert page.url.endswith('/#latest')
        context.close()
    browser.close()
print(json.dumps(results, indent=2))
