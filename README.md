# Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar: website

The official website of **Christu Jyoti Convent Sr. Sec. School**, Jyotinagar, Garhmukteshwar (Hapur), Uttar Pradesh. The school is a co-educational CISCE (ICSE & ISC) school run by the Franciscan Clarist sisters since 1998.

The site was rebuilt from scratch as a fast, accessible static site. All facts and photographs come from the previous site (cjcsgarh.com). Anything that site did not state is shown as a highlighted **`[[TO CONFIRM: …]]`** placeholder. See [`CONTENT_CHECKLIST.md`](./CONTENT_CHECKLIST.md).

---

## Tech stack

| | |
|---|---|
| Framework | **Angular 22**: standalone components, signals, zoneless change detection, new control flow (`@if`, `@for`) |
| Rendering | **Static site generation**: every route is prerendered to HTML at build time (`outputMode: "static"`, `RenderMode.Prerender`) |
| Styling | SCSS with design tokens as CSS custom properties (`src/styles/_tokens.scss`). No UI kit. |
| Fonts | Fraunces (headings) + Manrope (body), self-hosted via Fontsource (latin subset, `font-display: swap`) |
| Images | `NgOptimizedImage` with a custom loader; AVIF + WebP at 480–2000 px, JPEG fallback, blurred placeholders, explicit dimensions (no layout shift) |
| Forms | Reactive Forms with Indian mobile (+91) validation, inline errors, honeypot spam trap |
| Quality | Strict TypeScript + strict templates, ESLint (angular-eslint incl. template a11y rules), Prettier |

**Node:** ≥ 24.15 (see `.nvmrc`). With nvm, run `nvm use`.

## Run it

```bash
npm install
npm start            # dev server on http://localhost:4200
```

## Build & prerender

```bash
npm run build        # = npm run prerender
```

`npm run build` does three things:

1. **prebuild**: generates `public/sitemap.xml` from the routes and news items.
2. **ng build**: production build that prerenders every route to static HTML in `dist/cjcs-garhmukteshwar/browser/`: home, about, academics, admissions, facilities, gallery, news (plus one page per news story), downloads, contact, the 404 page and redirects from the old WordPress URLs (`/about-us`, `/admission`, `/school-toppers`, …).
3. **postbuild**: copies the 404 page to `404.html`.

Preview the production build locally:

```bash
npm run serve:static # http://localhost:4300
```

Other scripts: `npm run lint`, `npm run format`, `npm run format:check`, `npm run images`.

## Project structure

```
src/
  app/
    core/            services (content, SEO, enquiry), models, image loader, HTTP interceptor
    shared/
      components/    header, footer, announcement bar, button, news card, section heading,
                     page hero, picture, lightbox, accordion, stepper, toppers, enquiry form,
                     floating contact, icon, rich text (renders [[TO CONFIRM]] marks)
      directives/    scroll-reveal (IntersectionObserver, respects reduced motion)
    pages/           one folder per route (home, about, academics, admissions, facilities,
                     gallery, news, downloads, contact, not-found)
  assets/
    content/         ← ALL school content lives here (JSON)
    images/          optimised images (generated, see below)
    downloads/       PDFs (holiday homework etc.)
  styles/            _tokens, _mixins, _base, _typography, _utilities, _patterns
scripts/             image optimiser, sitemap generator, postbuild
```

## Updating content (no Angular knowledge needed)

Every word, number and photo reference on the site comes from the JSON files in **`src/assets/content/`**. Each file is type-checked against the interfaces in `src/app/core/models/content.models.ts`, so a typo in a field name fails the build instead of breaking the live site.

| File | What it controls |
|---|---|
| `site.json` | School name, contact details, timings, portal links, **announcement bar**, "Admissions Open" badge, stats strip, values, social links, menu |
| `about.json` | History, timeline, vision & mission, motto, management, Principal’s message |
| `academics.json` | Stages (Early Years / ICSE / ISC), ISC subjects, teaching approach, co-curricular, code of discipline, uniform, fees |
| `results.json` | Board toppers by session (newest first). Add a new session at the **top** of `years`. |
| `admissions.json` | Steps, eligibility, age norms, documents, dates, FAQ, class list used by forms |
| `facilities.json` | Facilities, boarding, safety, service, parent guidelines, campus photo gallery |
| `gallery.json` | Photo albums |
| `news.json` | News & events (each item also becomes its own page at `/news/<id>`) |
| `downloads.json` | Holiday homework and other files |
| `images.json` | **Generated**: do not edit by hand |

Common tasks:

- **Change the announcement bar**: edit `site.json → announcement`. Change its `id` whenever the message changes, so visitors who dismissed the old one see the new one. Set `"enabled": false` to hide it.
- **Add a news story**: add an object to `news.json → items` with a unique `id` (it becomes the URL), a `date` (`YYYY-MM-DD`), `category`, `summary` and `body` paragraphs.
- **Add holiday homework**: put the PDF in `src/assets/downloads/` and add an entry to `downloads.json` (`file: "/assets/downloads/<name>.pdf"`, `sizeKb`, `className`, `subject`, `session`).
- **Add toppers for a new year**: add a new object at the top of `results.json → years`. Portraits are optional (`"image": "topper-<name>"`, see below).
- **Placeholders**: any text containing `[[TO CONFIRM: …]]` is rendered as a yellow highlight. Replace it with the confirmed fact. Search the repo for `TO CONFIRM` before launch.

After editing, run `npm run build` and redeploy. Hosts connected to GitHub rebuild automatically on push.

### Adding or replacing photos

1. Put the original photo in `image-sources/`. This folder is git-ignored because originals are large; keep a copy elsewhere.
2. Add a line to `scripts/images.config.json`: `{ "id": "sports-day-2026", "file": "IMG_1234.jpg", "max": 1600 }`. You can add an optional `crop` (`left`, `top`, `width`, `height` in source pixels).
3. Run `npm run images`. This writes AVIF/WebP/JPEG sizes to `src/assets/images/` and updates `images.json`. Images are never upscaled.
4. Reference the photo by its `id` in any content JSON, always with descriptive `alt` text.

## Forms

The admissions, contact and campus-visit forms POST JSON to `enquiryEndpoint` in `src/environments/environment.ts`:

```json
{ "parentName": "…", "phone": "+919876543210", "classApplying": "Class VI", "message": "…", "source": "admissions", "submittedAt": "…" }
```

It is **empty by default**. While it is empty, a valid submission shows a success state and asks the parent to also send the details on WhatsApp (pre-filled), so no enquiry is lost. Before launch, point it at a form backend, for example Formspree, Web3Forms, Netlify Forms, a Google Apps Script web app writing to a Sheet, or the school ERP. The interceptor (`core/interceptors/api.interceptor.ts`) adds JSON headers, a 15 s timeout, and one retry on network failure.

## SEO

- Per-route `<title>`, description, canonical, Open Graph and Twitter tags come from `data.seo` in `app.routes.ts`, applied by `SeoTitleStrategy` during prerendering. Each news story gets its own tags via a resolver.
- schema.org `School` JSON-LD lives in `src/index.html`.
- `public/robots.txt`, a generated `public/sitemap.xml` and `site.webmanifest`.
- The production domain is set in `environment.ts → siteUrl`, `site.json → url`, `robots.txt` and `index.html` (JSON-LD). Update all four if the domain changes.

## Deployment

The build output is plain static files in **`dist/cjcs-garhmukteshwar/browser`**. No server is needed.

**Vercel**: import the repo. Set Framework preset to *Other*, Build command to `npm run build`, Output directory to `dist/cjcs-garhmukteshwar/browser`, and Node 24.

**Netlify**: Build command `npm run build`, publish directory `dist/cjcs-garhmukteshwar/browser`, environment `NODE_VERSION=24`. Netlify serves `404.html` automatically.

**Firebase Hosting**: `firebase init hosting`, public directory `dist/cjcs-garhmukteshwar/browser`, answer **No** to "single-page app". Then `npm run build && firebase deploy`.

**GitHub Pages**: build in a GitHub Action and upload `dist/cjcs-garhmukteshwar/browser` with `actions/upload-pages-artifact` + `actions/deploy-pages`. For a custom domain, add a `CNAME` file to `public/`. For a project page (`username.github.io/repo/`), build with `npx ng build --base-href /repo/`.

All hosts compress text (gzip/brotli) automatically, which the site relies on for its performance budget. Set long cache headers for `/assets/*` and the hashed `*.js`/`*.css` files if your host allows it.

## Accessibility & performance notes

- WCAG 2.2 AA colour contrast (tokens were checked), semantic landmarks, skip link, visible focus rings, native `<dialog>` for the mobile menu and lightbox, ARIA tabs for toppers, native `<details>` accordions, labelled form fields with linked error messages.
- All motion (Ken Burns hero, reveals, view transitions) is disabled under `prefers-reduced-motion`.
- The hero image is preloaded with `fetchpriority="high"`. Everything else lazy-loads. Explicit dimensions mean no layout shift.
- Lighthouse (mobile, run against a local compressed build): Accessibility 100, Best Practices 100 and SEO 100 on every page. Performance was 95–100 with applied (DevTools) throttling and 76–92 with Lighthouse's default simulated throttling. Simulated scores against localhost are pessimistic. Re-run against the deployed URL (e.g. PageSpeed Insights) after launch.
