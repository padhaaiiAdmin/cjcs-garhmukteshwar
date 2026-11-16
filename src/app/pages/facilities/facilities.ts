import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Icon } from '../../shared/components/icon/icon';
import { Lightbox } from '../../shared/components/lightbox/lightbox';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-facilities',
  imports: [RouterLink, Icon, Lightbox, PageHero, Picture, Rich, SectionHeading, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facilities.html',
  styleUrl: './facilities.scss',
})
export class FacilitiesPage {
  private readonly content = inject(ContentService);
  protected readonly fac = this.content.facilities;
  protected readonly featured = this.fac.facilities.filter((f) => f.image);
  protected readonly others = this.fac.facilities.filter((f) => !f.image);

  protected readonly categories = ['All', ...new Set(this.fac.gallery.map((g) => g.category))];
  protected readonly filter = signal('All');
  protected readonly shown = computed(() =>
    this.filter() === 'All'
      ? this.fac.gallery
      : this.fac.gallery.filter((g) => g.category === this.filter()),
  );
  protected readonly open = signal<number | null>(null);
}
