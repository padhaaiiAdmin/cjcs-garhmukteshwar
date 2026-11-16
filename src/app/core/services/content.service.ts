import { Injectable } from '@angular/core';
import type {
  AboutContent,
  AcademicsContent,
  AdmissionsContent,
  DownloadsContent,
  FacilitiesContent,
  GalleryContent,
  NewsContent,
  NewsItem,
  ResultsContent,
  SiteContent,
} from '../models/content.models';

import site from '../../../assets/content/site.json';
import about from '../../../assets/content/about.json';
import academics from '../../../assets/content/academics.json';
import results from '../../../assets/content/results.json';
import admissions from '../../../assets/content/admissions.json';
import facilities from '../../../assets/content/facilities.json';
import gallery from '../../../assets/content/gallery.json';
import news from '../../../assets/content/news.json';
import downloads from '../../../assets/content/downloads.json';

/**
 * Single source of school content. Every page reads from here, never from
 * hard-coded strings, so staff only ever edit the JSON in src/assets/content/.
 *
 * The JSON is imported at build time (type-checked against the interfaces in
 * content.models.ts) so each prerendered page ships fully rendered HTML with no
 * extra network requests. After editing JSON, rebuild and redeploy.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly site = site as SiteContent;
  readonly about = about as AboutContent;
  readonly academics = academics as AcademicsContent;
  readonly results = results as ResultsContent;
  readonly admissions = admissions as AdmissionsContent;
  readonly facilities = facilities as FacilitiesContent;
  readonly gallery = gallery as GalleryContent;
  readonly downloads = downloads as DownloadsContent;

  /** News, newest first. */
  readonly news: NewsItem[] = [...(news as NewsContent).items].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  newsById(id: string): NewsItem | undefined {
    return this.news.find((n) => n.id === id);
  }
}
