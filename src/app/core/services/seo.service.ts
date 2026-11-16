import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ContentService } from './content.service';

export interface SeoData {
  title: string;
  description: string;
  /** Optional absolute or root-relative image for social cards */
  image?: string;
  type?: 'website' | 'article';
}

const SUFFIX = 'Christu Jyoti Convent Sr. Sec. School, Garhmukteshwar';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly content = inject(ContentService);

  update(seo: SeoData, path: string): void {
    const fullTitle = seo.title.includes('Christu Jyoti') ? seo.title : `${seo.title} | ${SUFFIX}`;
    const url = `${environment.siteUrl}${path}`;
    const image = this.absolute(seo.image ?? '/og-image.jpg');

    this.title.setTitle(fullTitle);
    const tags: Record<string, string> = {
      description: seo.description,
      'og:title': fullTitle,
      'og:description': seo.description,
      'og:type': seo.type ?? 'website',
      'og:url': url,
      'og:image': image,
      'og:image:alt': `${this.content.site.name}, ${this.content.site.locality}`,
      'og:site_name': this.content.site.name,
      'og:locale': 'en_IN',
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': seo.description,
      'twitter:image': image,
    };
    for (const [key, value] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content: value }, `${attr}="${key}"`);
    }
    this.setCanonical(url);
  }

  private absolute(src: string): string {
    return src.startsWith('http') ? src : `${environment.siteUrl}${src}`;
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

/**
 * Reads `data.seo` from the deepest activated route and applies title, meta,
 * Open Graph and canonical tags. Runs on the server during prerendering, so
 * every static HTML file ships with correct tags.
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const data = route.data['seo'] as SeoData | undefined;
    if (data) {
      const path = snapshot.url.split(/[?#]/)[0] || '/';
      this.seo.update(data, path);
    }
  }
}
