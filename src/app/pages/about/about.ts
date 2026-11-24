import { NextSteps } from '../../shared/components/next-steps/next-steps';
import { SubnavDirective } from '../../shared/directives/subnav.directive';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RouterLink, PageHero, Picture, Rich, SectionHeading, RevealDirective, SubnavDirective, NextSteps],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {
  private readonly content = inject(ContentService);
  protected readonly site = this.content.site;
  protected readonly about = this.content.about;
}
