"""Generate the selected public CV from a running local preview, then rebuild."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
    page = browser.new_page()
    page.goto('http://127.0.0.1:4321/cv/', wait_until='networkidle')
    page.pdf(path=str(Path(__file__).resolve().parents[1] / 'public/files/cv.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
    browser.close()
