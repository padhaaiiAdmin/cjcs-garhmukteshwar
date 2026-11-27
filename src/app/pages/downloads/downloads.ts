import { NextSteps } from '../../shared/components/next-steps/next-steps';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import type { DownloadItem } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Rich } from '../../shared/components/rich/rich';

@Component({
  selector: 'app-downloads',
  imports: [Icon, PageHero, Rich, NextSteps],
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

  /** Only offer a subject filter once files are actually split by subject. */
  protected readonly showSubject = this.subjects.length > 3;

  /** ?class=…&type=… so a teacher can share "Class V homework" as one link. */
  readonly class = input('');
  readonly type = input('');
  protected readonly kind = computed(() => (this.kinds.includes(this.type()) ? this.type() : 'All'));
  protected readonly klass = computed(() =>
    this.classes.includes(this.class()) ? this.class() : 'All classes',
  );
  private readonly router = inject(Router);
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

  /** Announce the result count once typing pauses, not on every keystroke. */
  protected readonly announced = signal('');

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
    effect(() => {
      const n = this.shown().length;
      clearTimeout(timer);
      timer = setTimeout(() => this.announced.set(`${n} ${n === 1 ? 'file' : 'files'}`), 600);
    });
  }

  protected setFilter(key: 'class' | 'type', v: string): void {
    const blank = key === 'class' ? v === 'All classes' : v === 'All';
    this.router.navigate([], {
      queryParams: { [key]: blank ? null : v },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected reset(): void {
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
    this.subject.set('All subjects');
    this.query.set('');
  }

  protected value(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }
}
