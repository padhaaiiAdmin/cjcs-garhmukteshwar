# Content checklist: items for the school to confirm

Everything below is either missing from the old website or inconsistent on it. On the live site, each item appears as a yellow **`[[TO CONFIRM: …]]`** highlight. Replace each one in the JSON file shown (in `src/assets/content/` unless noted), then rebuild.

> Tip: search the project for `TO CONFIRM` to find every remaining placeholder. Before launch, that search should return nothing outside this file and the code that renders the marks.

## 🔴 Must confirm before launch

| # | Item | Where | Notes |
|---|---|---|---|
| 1 | **CISCE affiliation number / school code** | `site.json → affiliationNumber` | Shown in the footer on every page |
| 2 | **Admissions session** in the announcement bar (e.g. 2027–28) and which classes are open | `site.json → announcement.text`, `admissions.json → faq` | The last known cycle opened 29 Dec 2025 for Nursery–Class IX |
| 3 | **Form endpoint** for enquiries | `src/environments/environment.ts → enquiryEndpoint` | Until set, forms fall back to a pre-filled WhatsApp message. See README → Forms |
| 4 | **Phone numbers**: the home page used +91 75000 01547, the old Contact page used +91 98733 36049 | `site.json → phone`, `altPhones` | The site uses 7500001547 as primary and lists the second as "also listed". Keep or remove? |
| 5 | Is **+91 75000 01547 on WhatsApp**? | `site.json → whatsapp` | The floating WhatsApp button and the form fallback use it |
| 6 | **Production domain** (assumed `https://cjcsgarh.com`) | `environment.ts`, `site.json → url`, `public/robots.txt`, `src/index.html` (JSON-LD) | |
| 7 | **Mandatory Public Disclosure** PDF | `site.json → mandatoryDisclosureUrl` or upload via `downloads.json` | Footer link currently points to the Downloads page entry |
| 8 | **Online registration / login portal** links (`cjcssh.sms.m-cms.com`) still current? | `site.json → portals` | Taken from the old site's Staff Login / Parent Login / Online Registration buttons |

## 🟠 School facts

| # | Item | Where |
|---|---|---|
| 9 | Number of **faculty members** | `site.json → stats` |
| 10 | Current **student strength** (the site shows 1,500, the figure recorded at the Silver Jubilee) | `site.json → stats` |
| 11 | **Campus area**, number of **classrooms**, which spaces are **air-conditioned** | `facilities.json → infrastructure` |
| 12 | One-line **vision statement** (if the school uses one; the mission list is already published) | `about.json → vision` |
| 13 | Name of the present **Manager** | `src/app/pages/about/about.html` (Management facts) |
| 14 | **Social media profile URLs**: Facebook, Instagram, X/Twitter, Pinterest (the old site's icons linked nowhere) | `site.json → social` |
| 15 | Are **Commerce or Humanities** streams offered at ISC? (Only science subjects were published) | `academics.json → iscSubjects.note` |
| 16 | **Library**: number of books, and a real photograph (the old site used an Alamy stock photo, which has been removed) | `facilities.json → library` |
| 17 | **Transport**: routes, areas covered, transport contact | `facilities.json → transport`, `admissions.json → faq` |
| 18 | **CCTV / surveillance** coverage details | `facilities.json → surveillance` |
| 19 | Silver Jubilee **date** (the site assumes 2023, i.e. 25 years after 1998) and more photos | `about.json → timeline`, `gallery.json → silver-jubilee` |

## 🟡 Admissions

| # | Item | Where |
|---|---|---|
| 20 | **Age criteria** for Nursery, LKG, UKG and Class I (e.g. age as on 31 March) | `admissions.json → ageNorms` |
| 21 | **Documents** required at admission | `admissions.json → documents` |
| 22 | **Dates**: registration, entrance test, interviews, session start | `admissions.json → dates` |
| 23 | **Entrance test** format/syllabus by class | `admissions.json → steps[1]` |
| 24 | **Fee structure** by class (or a decision not to publish it) | `admissions.json → feesNote`, `faq`, `src/app/pages/academics/academics.html` |

## 🟡 Boarding

| # | Item | Where |
|---|---|---|
| 25 | Boarding for **boys, girls or both**, and **from which class** | `facilities.json → boarding.points`, `admissions.json → faq` |
| 26 | Dormitories, meals, supervised study, visiting days | `facilities.json → boarding.points` |

## 🟢 Results, news, gallery & downloads

| # | Item | Where |
|---|---|---|
| 27 | Confirm the **exam year** for the 2025–26 toppers (assumed board exams of 2026) | `results.json` |
| 28 | Name spellings in the **results archive** (typed from images on the old site): "Diskha Agrawal" (Diksha?), "Sandhiya Verma" (file was named Sandhya), "Aditiya Pratap Singh", "Yuraj Singh" (Yuvraj?). Also "Aditya Rajput" vs "Rajpoot" (the old site used both) | `results.json` |
| 29 | **Christmas Day 2025**: exact date, programme, the rest of the photos | `news.json`, `gallery.json` |
| 30 | **Prize Distribution 2025**: date, chief guest, highlights, photos | `news.json` |
| 31 | Replace the old **admissions news** item with the next cycle's announcement | `news.json → admissions-2026-27` |
| 32 | Upload the **current session's holiday homework** (the files online are from summer 2024) | `downloads.json`, `src/assets/downloads/` |
| 33 | Upload the **Transfer Certificate form** and **book list** (or remove those rows) | `downloads.json` |

## ℹ️ Decisions already made (for review)

- **Spelling**: "Christu Jyoti" is used throughout for the school. "Christu Jyothi" is kept only for the registered *Christu Jyothi Educational Society*, as it appears on the old site.
- **Address**: "Jyotinagar" (the old Contact page said "Jyothinagar").
- **Old news items left out**: the old News page contained stories about the sister school in **Baraut** (Brainiac Expo 2K22, STP opening, etc. with Principal Sr. Dr. Jessy Jose). They were not published here. Send any Garhmukteshwar-specific achievements (e.g. sports medals) to add.
- **Office hours**: the header shows 9:00 AM – 1:00 PM (from the old home page). The Contact page also lists the published summer/winter school and office timings. Please check they agree.
- **Copy** was rewritten to be shorter and warmer without changing facts. The Principal's message is kept close to the original wording.
- **Old URLs** (`/about-us`, `/brief-history`, `/principal-desk`, `/admission`, `/download`, `/holiday-homework`, `/school-toppers`) redirect to the new pages.
