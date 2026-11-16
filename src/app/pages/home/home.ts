import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { ButtonDirective } from '../../shared/components/button/button.directive';
import { NewsCard } from '../../shared/components/card/news-card';
import { Icon } from '../../shared/components/icon/icon';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Stepper } from '../../shared/components/stepper/stepper';
import { Toppers } from '../../shared/components/toppers/toppers';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ButtonDirective,
    Icon,
    Picture,
    Rich,
    SectionHeading,
    Stepper,
    Toppers,
    NewsCard,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private readonly content = inject(ContentService);
  protected readonly site = this.content.site;
  protected readonly about = this.content.about;
  protected readonly latest = this.content.results.years[0];
  protected readonly news = this.content.news.slice(0, 3);
  protected readonly steps = this.content.admissions.steps;
  protected readonly boarding = this.content.facilities.boarding;
  protected readonly numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  /** Curated campus-life mosaic */
  protected readonly mosaic = [
    {
      id: 'id25-band',
      alt: 'The school band in ceremonial red and white marching with trumpets',
      caption: 'Independence Day 2025',
    },
    {
      id: 'lab-science',
      alt: 'Senior students conducting an experiment in the science laboratory',
      caption: 'Science laboratories',
    },
    {
      id: 'y24-race',
      alt: 'Young students sprinting on the green field on sports day',
      caption: 'Sports day',
    },
    {
      id: 'id25-classical',
      alt: 'Girls in orange costumes performing a group dance on stage',
      caption: 'On the Rangmanch stage',
    },
    {
      id: 'y24-investiture',
      alt: 'Student council members in sashes at the Investiture Ceremony',
      caption: 'Investiture Ceremony',
    },
  ];
}
