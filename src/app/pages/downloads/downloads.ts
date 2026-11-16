import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { DownloadItem } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Rich } from '../../shared/components/rich/rich';

@Component({
  selector: 'app-downloads',
  imports: [Icon, PageHero, Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './downloads.html',
  styleUrl: './downloads.scss',
})
export class DownloadsPage {
  private readonly data = inject(ContentService).downloads;
  protected readonly note = this.data.note;
  protected readonly items = this.data.items;

  protected readonly kinds = ['All', ...new Set(this.items.map((i) => i.kind))];
  protected readonly classes = ['All classes', ...new Set(this.items.map((i) => i.className))];
  protected readonly subjects = [
    'All subjects',
    ...new Set(this.items.map((i) => i.subject)),
  ].filter((s, i, arr) => arr.indexOf(s) === i);

  protected readonly kind = signal('All');
  protected readonly klass = signal('All classes');
  protected readonly subject = signal('All subjects');
  protected readonly query = signal('');

  protected readonly shown = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.items.filter(
      (i) =>
        (this.kind() === 'All' || i.kind === this.kind()) &&
        (this.klass() === 'All classes' || i.className === this.klass() || i.className === 'All') &&
        (this.subject() === 'All subjects' || i.subject === this.subject()) &&
        (!q || `${i.title} ${i.className} ${i.subject}`.toLowerCase().includes(q)),
    );
  });

  protected size(i: DownloadItem): string {
    if (!i.sizeKb) return '';
    return i.sizeKb >= 1024 ? `${(i.sizeKb / 1024).toFixed(1)} MB` : `${i.sizeKb} KB`;
  }

  protected reset(): void {
    this.kind.set('All');
    this.klass.set('All classes');
    this.subject.set('All subjects');
    this.query.set('');
  }

  protected value(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }
}
