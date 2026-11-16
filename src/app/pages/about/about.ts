import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Icon, PageHero, Picture, Rich, SectionHeading, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {
  private readonly content = inject(ContentService);
  protected readonly site = this.content.site;
  protected readonly about = this.content.about;
}
