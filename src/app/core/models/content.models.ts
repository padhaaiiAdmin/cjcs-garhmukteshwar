/**
 * Typed shapes for every JSON file in src/assets/content/.
 * Any string may contain a visible placeholder such as
 * "[[TO CONFIRM: affiliation number]]". The <app-rich> component renders those
 * as highlighted marks so they are impossible to miss before launch.
 */

export interface Link {
  label: string;
  url: string;
  external?: boolean;
}

export interface ImageRef {
  /** id from src/assets/content/images.json */
  id: string;
  alt: string;
  caption?: string;
}

export interface Stat {
  value: string;
  label: string;
  note?: string;
}

export interface SocialLink {
  network: 'facebook' | 'instagram' | 'x' | 'pinterest' | 'youtube';
  label: string;
  /** Empty string = not yet confirmed; the footer shows a placeholder instead of a dead link. */
  url: string;
}

export interface NavItem {
  label: string;
  path: string;
  fragment?: string;
  description?: string;
  image?: ImageRef;
  children?: NavItem[];
}

export interface SiteContent {
  name: string;
  shortName: string;
  locality: string;
  motto: string;
  heroLine: string;
  heroIntro: string;
  founded: number;
  foundedOn: string;
  board: string;
  boardExams: string;
  affiliationNumber: string;
  medium: string;
  type: string;
  management: string;
  congregation: string;
  principal: string;
  url: string;
  address: {
    line1: string;
    city: string;
    district: string;
    state: string;
    postalCode: string;
    country: string;
  };
  mapQuery: string;
  phone: { display: string; tel: string };
  altPhones: { display: string; tel: string; note: string }[];
  whatsapp: { number: string; note: string };
  email: string;
  officeHours: string;
  timings: { label: string; summer: string; winter: string }[];
  principalHours: string;
  portals: { staffLogin: string; parentLogin: string; registration: string };
  announcement: { enabled: boolean; id: string; text: string; cta: Link };
  admissionsOpen: boolean;
  stats: Stat[];
  values: { title: string; text: string }[];
  social: SocialLink[];
  mandatoryDisclosureUrl: string;
  /** Website credit shown at the very bottom of the footer */
  credit: { label: string; url: string };
  nav: NavItem[];
}

export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
}

export interface AboutContent {
  intro: string;
  story: string[];
  timeline: TimelineEntry[];
  vision: string;
  mission: string[];
  motto: { words: string[]; text: string; scripture: string };
  management: {
    society: string;
    text: string[];
    image: ImageRef;
  };
  principal: {
    name: string;
    title: string;
    image: ImageRef;
    greeting: string;
    scripture: { text: string; ref: string };
    paragraphs: string[];
    closingQuote: string;
    signOff: string;
    teaser: string;
  };
  gratitude: string;
}

export interface Stage {
  id: string;
  name: string;
  classes: string;
  board: string;
  summary: string;
  points: string[];
}

export interface AcademicsContent {
  intro: string;
  stages: Stage[];
  iscSubjects: { compulsory: string[]; electives: string[]; note: string };
  xiAdmission: { criteria: string[]; note: string };
  pedagogy: { title: string; text: string }[];
  coCurricular: { title: string; text: string }[];
  codeOfDiscipline: string[];
  uniform: { group: string; regular: string; wedSat: string }[];
  uniformNote: string;
  fees: string;
}

export interface Topper {
  name: string;
  percent: string;
  image?: string;
}

export interface ResultYear {
  session: string;
  classX: Topper[];
  classXII: Topper[];
  note?: string;
}

export interface ResultsContent {
  latest: string;
  years: ResultYear[];
}

export interface AdmissionsContent {
  intro: string;
  steps: { title: string; text: string }[];
  eligibility: string[];
  ageNorms: { stage: string; age: string }[];
  documents: string[];
  dates: { label: string; value: string }[];
  feesNote: string;
  faq: { q: string; a: string }[];
  classes: string[];
}

export type FacilityCategory = 'learning' | 'sports' | 'arts' | 'campus' | 'care';

export interface Facility {
  id: string;
  title: string;
  category: FacilityCategory;
  text: string;
  details?: string;
  image?: ImageRef;
}

export interface FacilitiesContent {
  intro: string;
  facilities: Facility[];
  boarding: { title: string; lead: string; text: string[]; points: string[]; image: ImageRef };
  safety: { title: string; text: string }[];
  service: { title: string; text: string }[];
  parents: string[];
  gallery: (ImageRef & { category: string })[];
}

export interface Album {
  id: string;
  title: string;
  year: number;
  date?: string;
  category: string;
  cover: ImageRef;
  images: ImageRef[];
  note?: string;
}

export interface GalleryContent {
  albums: Album[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  /** Human date shown when the exact day is unconfirmed */
  dateLabel?: string;
  category: 'Celebration' | 'Achievement' | 'Academics' | 'Admissions' | 'Event' | 'Notice';
  summary: string;
  body: string[];
  image?: ImageRef;
  albumId?: string;
}

export interface NewsContent {
  items: NewsItem[];
}

export interface DownloadItem {
  id: string;
  title: string;
  kind: 'Holiday Homework' | 'Form' | 'Circular' | 'Disclosure' | 'Syllabus';
  className: string;
  subject: string;
  session: string;
  /** Path under /assets/downloads or an absolute URL. Empty = awaiting file. */
  file: string;
  sizeKb: number;
  pages?: number;
}

export interface DownloadsContent {
  note: string;
  items: DownloadItem[];
}

export interface ImageMeta {
  width: number;
  height: number;
  widths: number[];
  fallback: string;
  lqip: string;
}

export type ImageManifest = Record<string, ImageMeta>;
