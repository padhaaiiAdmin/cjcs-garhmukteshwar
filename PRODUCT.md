# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: prospective parents.** Families in and around Garhmukteshwar (Hapur district, Uttar Pradesh) who are choosing a school and deciding whether to apply for admission (Nursery to Class IX in the last known cycle). Their job is to judge whether Christu Jyoti is right for their child, then register or contact the office.

**Secondary: current parents.** They look up notices, holiday homework and downloads, results, timings and the Parent Login portal.

**Pitch audience: school decision-makers.** The site is a speculative pitch (see Product Purpose). The Principal, the sisters and the Christu Jyothi Educational Society will judge it in a demo before any parent sees it.

## Product Purpose

The school's website: it presents Christu Jyoti Convent Sr. Sec. School and turns interest from prospective parents into admission enquiries and registrations.

**Status: pitch/sample.** aleaon built it speculatively to win the school as a client. It runs on `aleaonsample.com` and the footer credits aleaon.com. It is meant to replace the school's current site, cjcsgarh.com. Success has two stages:
1. The school's decision-makers see their institution presented with more dignity, clarity and credibility than their current site, and commission the work.
2. Once live, prospective parents understand the school quickly and act: Register online, Book a campus visit, call or WhatsApp.

## Positioning

These are published facts that a neighbouring school cannot truthfully claim:
- It is a **convent school run by the Franciscan Clarist Congregation since 1998** (founded 31 Oct 1998). It was founded in answer to the town's wish for a convent school of its own.
- It is affiliated to **CISCE**, offering **ICSE (Class X) and ISC (Class XII)** in one school from Nursery to Class XII. It is English-medium and co-educational.
- It offers **boarding** within the rhythm of a convent: study, prayer, play and the sisters' care.
- Its motto is **"Wisdom · Life · Light"**. Its formation is built on six stated commitments, including spiritual and ethical renewal, human values and heritage, and competence and confidence.
- It publishes **board toppers year by year** as proof of academic results.

## Operating Context

- Parents usually start with a phone call, a WhatsApp message or a campus visit. The office is open 9:00 AM – 1:00 PM.
- Admission steps: online registration (external portal `cjcssh.sms.m-cms.com`), entrance test, interview, then admission formalities.
- External Staff Login and Parent Login portals live outside this site.
- School-life rituals that appear in the content: Independence Day, investiture ceremony, sports day, Christmas, prize distribution and the Silver Jubilee.
- Enquiry forms fall back to a pre-filled WhatsApp message until a form endpoint is set.

## Capabilities and Constraints

- **Stack:** Angular 22 static site. Every route is prerendered. Content lives in JSON under `src/assets/content/` and is type-checked. Deployed to GitHub Pages. Node ≥ 24.15 is required to build.
- **Content rule:** every fact and photo comes from the old site, cjcsgarh.com. Anything unstated is shown as a `[[TO CONFIRM: …]]` placeholder and tracked in `CONTENT_CHECKLIST.md`. The pitch must not invent facts to fill these gaps.
- Old WordPress URLs (`/about-us`, `/admission`, `/school-toppers`, etc.) redirect to the new pages.
- **Open questions:**
  - Device mix and language comfort of local parents are unknown.
  - Whether Hindi or bilingual content is needed is not decided.
  - Production domain, CISCE affiliation number and the current admissions session are all unconfirmed (see `CONTENT_CHECKLIST.md`).

## Brand Commitments

- **Name:** "Christu Jyoti Convent Sr. Sec. School". "Christu Jyothi" (with an h) is used only for the registered *Christu Jyothi Educational Society*. The address is spelled "Jyotinagar".
- **Assets:** the school crest/logo and the motto "Wisdom · Life · Light".
- **Colours from the school's identity:** royal blue #1D50A7, sky blue #4ACBFF and amber gold #C77E1A. These are recorded as identity facts, not as a visual direction.
- **Voice:** warm, dignified, short. The Principal's message stays close to its original wording.

## Evidence on Hand

- **Photographs** of the real campus and events, in `src/assets/images/`: the building, labs, assembly, Independence Day 2025, Glimpse 2024, Christmas 2025, toppers' portraits, the principal and management.
- **Board results archive** by session, in `results.json`.
- **News items** and downloads (holiday homework PDFs from summer 2024).
- **Not available, must not be fabricated:** testimonials, parent quotes, alumni stories, faculty count, current student strength (1,500 is the Silver Jubilee figure), fees, campus area, social media URLs, and a library photo (the old stock photo was removed).

## Product Principles

1. **Earn trust before asking for action.** Heritage, the sisters' care and published results come first. Registration follows from that trust.
2. **Truth over polish.** Show only confirmed facts. Mark gaps honestly and never paper over them with invented claims.
3. **Respect the institution.** The site has to read as worthy of a convent school with 25+ years of standing, because the first reviewers are its leaders.
4. **Make contact effortless.** Phone, WhatsApp, a visit and registration are always one step away.
5. **Real school life, not stock.** Use the school's own photographs and events.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Parents' device mix and language comfort are unknown, so the site must stay legible and usable on low-end phones and slow connections.
