# shimyunbo.com

Yunbo Shim’s static research website. About, Research, and CV use a light editorial design; Timeline uses navy and teal. The Timeline navigation item and CTA keep that appearance across the site.

## Local development

Node 22.12+ (tested with Node 24). In a restricted environment, set `ASTRO_TELEMETRY_DISABLED=1` and use a writable npm cache such as `/tmp/portfolio-npm-cache`. `npm ci`, then `npm run dev`. Run `npm run check`, `npm test`, and `npm run build` before publishing. `npm run preview` serves the build locally.

## Content

Edit `src/data/entries.ts`. Entries have stable IDs, multiple categories, summary/details, and either an event date or start/end dates. Use `ongoing: true` for current work. Dates retain year, month, day, or Spring/Fall precision. Ongoing entries appear first; completed entries sort by end/event date. Unknown month/day sorts after known values in that bucket. Semester-only entries remain labeled by semester. Do not convert estimated end dates into completed work.

Research, web CV, and Timeline use the same data. Mark `selected` for the concise CV. Publications automatically receive `/research/[id]/` pages. Add only verified links; submission is not acceptance. Multiple categories never create multiple copies of the same event. Keep raw CVs, private review notes, unapproved information, and confidential documents outside this public repository, including its Git history.

The CV PDF at `public/files/cv.pdf` is a selected public CV generated from the web CV, not the original source document. Replace it after editing content; keep its URL stable. A reproducible local PDF generation helper is `scripts/generate-cv.py` (requires Python Playwright and Chromium). Start the preview on port 4321, run the helper, then rebuild. The PDF uses print styling with personal phone, home address and birth date excluded. Host only cleared author manuscripts; keep each version at a distinct path and add the approved link to its research page.

## Timeline

Seven toggle filters use OR semantics. No selected filter means All. Selection is reflected in the URL, supports back/forward, and preserves expanded entries. Native details remain usable without JavaScript. Reduced-motion settings remove animations. A deep link to a hidden entry clears filters and opens that entry. Cards preserve original date precision; visual spacing is not a duration scale.

## Deployment preparation

Build outputs `dist/`. This can be hosted as static assets on Cloudflare Workers or GitHub Pages. No server, database, credentials, or analytics are included. GitHub Actions checks types, runs tests, builds, and uploads a static-site artifact on each push to master. Review the content, PDF, domain settings, and hosting limits before publishing. The owner has authorized pushes to this repository and deployment of this website. Existing services and mail DNS must be preserved. Obtain specific approval for paid services, new persistent credentials, or replacement of another existing service. Never replace existing mail DNS records.

## Cloudflare deployment

`wrangler.jsonc` describes a static-assets-only Worker named `shimyunbo-com`. No custom-domain route is hard-coded, so deployment cannot silently overwrite DNS. With an authorized Cloudflare connection, run `npm run deploy`. Alternatively connect this repository in Cloudflare Workers Builds using build command `npm run build` and deploy command `npx wrangler deploy`. Select the master branch.

Before attaching `shimyunbo.com` as a Worker Custom Domain, inspect current DNS and web hosting. Preserve MX/TXT records and unrelated services. If an existing website would be replaced, ask the owner. Verify the workers.dev deployment first, then the custom domain and TLS. Cloudflare authentication and domain attachment were not completed in the development environment. Do not place credentials in this repository.
