import { NextSteps } from '../../shared/components/next-steps/next-steps';
import { SubnavDirective } from '../../shared/directives/subnav.directive';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Accordion } from '../../shared/components/accordion/accordion';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Toppers } from '../../shared/components/toppers/toppers';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-academics',
  imports: [
    RouterLink,
    Accordion,
    Icon,
    PageHero,
    Picture,
    Rich,
    SectionHeading,
    Toppers,
    RevealDirective,
    SubnavDirective,
    NextSteps,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academics.html',
  styleUrl: './academics.scss',
})
export class AcademicsPage {
  private readonly content = inject(ContentService);
  protected readonly ac = this.content.academics;
  protected readonly results = this.content.results;
  protected readonly session = signal(this.results.years[0].session);
  protected readonly year = computed(
    () => this.results.years.find((y) => y.session === this.session()) ?? this.results.years[0],
  );
  protected readonly uniformItems = this.ac.uniform.map((u) => ({
    q: u.group,
    a: `Mon, Tue, Thu, Fri: ${u.regular} Wednesday & Saturday: ${u.wedSat}`,
  }));
}
