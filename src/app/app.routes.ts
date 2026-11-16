import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { IMAGE_MANIFEST } from './core/images/image-manifest';
import { ContentService } from './core/services/content.service';
import type { SeoData } from './core/services/seo.service';
import { plain } from './shared/components/rich/rich';

/** Per-article title, description and social image for /news/:id */
const newsSeo: ResolveFn<SeoData> = (route) => {
  const n = inject(ContentService).newsById(route.paramMap.get('id') ?? '');
  if (!n) return { title: 'Page not found', description: 'This news story could not be found.' };
  const meta = n.image ? IMAGE_MANIFEST[n.image.id] : undefined;
  return {
    title: plain(n.title),
    description: plain(n.summary),
    image: meta ? `/assets/images/${meta.fallback}` : undefined,
    type: 'article',
  };
};

const seo = (title: string, description: string, image?: string): { seo: SeoData } => ({
  seo: { title, description, image },
});

/**
 * Every page is lazy-loaded and prerendered to static HTML at build time
 * (see app.routes.server.ts). Titles/meta come from `data.seo`.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    data: seo(
      'Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar | CISCE (ICSE & ISC) School, Hapur',
      'Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar (Hapur): a co-educational CISCE school (ICSE & ISC) run by the FCC sisters since 1998. Nursery to Class XII, boarding available. Admissions open.',
    ),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    data: seo(
      'About the School: History, Vision & Principal',
      'Founded in 1998 by the Franciscan Clarist sisters, Christu Jyoti Convent is a value-based CISCE school in Garhmukteshwar. Read our history, mission and the Principal’s message.',
      '/assets/images/building-front-968.jpg',
    ),
  },
  {
    path: 'academics',
    loadComponent: () => import('./pages/academics/academics').then((m) => m.AcademicsPage),
    data: seo(
      'Academics: ICSE & ISC Curriculum and Results',
      'ICSE (Nursery to Class X) and ISC (Classes XI–XII) at the best CISCE school in Garhmukteshwar, Hapur. Subjects, teaching approach, co-curricular life and board results.',
      '/assets/images/lab-science-1200.jpg',
    ),
  },
  {
    path: 'admissions',
    loadComponent: () => import('./pages/admissions/admissions').then((m) => m.AdmissionsPage),
    data: seo(
      'Admissions: How to Apply',
      'Admissions at Christu Jyoti Convent, Garhmukteshwar: online registration, entrance test, interview and admission. Eligibility, documents, dates and FAQs for parents.',
      '/assets/images/y24-pre-primary-1200.jpg',
    ),
  },
  {
    path: 'facilities',
    loadComponent: () => import('./pages/facilities/facilities').then((m) => m.FacilitiesPage),
    data: seo(
      'Facilities & Boarding',
      'Science and computer labs, library, sports fields, transport, a supervised campus and boarding at Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar.',
      '/assets/images/y24-sports-day-1200.jpg',
    ),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.GalleryPage),
    data: seo(
      'Photo Gallery',
      'Photographs of school life at Christu Jyoti Convent, Garhmukteshwar: Independence Day, results felicitation, sports day, the Investiture Ceremony and more.',
      '/assets/images/id25-band-1200.jpg',
    ),
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news').then((m) => m.NewsPage),
    data: seo(
      'News & Events',
      'Latest news, results, celebrations and events from Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar.',
    ),
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./pages/news/news-detail').then((m) => m.NewsDetailPage),
    resolve: { seo: newsSeo },
  },
  {
    path: 'downloads',
    loadComponent: () => import('./pages/downloads/downloads').then((m) => m.DownloadsPage),
    data: seo(
      'Downloads & Holiday Homework',
      'Download holiday homework by class, forms and school documents from Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar.',
    ),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
    data: seo(
      'Contact & Directions',
      'Call +91 75000 01547, WhatsApp or email cjcsgarh@gmail.com. Visit Christu Jyoti Convent Sr. Sec. School, Jyotinagar, Garhmukteshwar, Uttar Pradesh 245205.',
    ),
  },
  // Legacy URLs from the old WordPress site → new pages
  { path: 'about-us', redirectTo: 'about' },
  { path: 'brief-history', redirectTo: 'about' },
  { path: 'principal-desk', redirectTo: 'about' },
  { path: 'admission', redirectTo: 'admissions' },
  { path: 'download', redirectTo: 'downloads' },
  { path: 'holiday-homework', redirectTo: 'downloads' },
  { path: 'school-toppers', redirectTo: 'academics' },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    data: seo('Page not found', 'The page you were looking for could not be found.'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    data: seo('Page not found', 'The page you were looking for could not be found.'),
  },
];
