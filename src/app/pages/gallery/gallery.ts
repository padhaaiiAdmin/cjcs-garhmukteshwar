import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { Album, ImageRef } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { Lightbox } from '../../shared/components/lightbox/lightbox';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';

@Component({
  selector: 'app-gallery',
  imports: [Lightbox, PageHero, Picture, Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class GalleryPage {
  protected readonly albums = inject(ContentService).gallery.albums;
  protected readonly years = ['All', ...new Set(this.albums.map((a) => String(a.year)))];
  protected readonly year = signal('All');
  protected readonly shown = computed(() =>
    this.year() === 'All' ? this.albums : this.albums.filter((a) => String(a.year) === this.year()),
  );
  protected readonly lightboxImages = signal<ImageRef[]>([]);
  protected readonly open = signal<number | null>(null);

  protected view(album: Album, index: number): void {
    this.lightboxImages.set(album.images);
    this.open.set(index);
  }
}
