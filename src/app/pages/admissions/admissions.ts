import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Accordion } from '../../shared/components/accordion/accordion';
import { ButtonDirective } from '../../shared/components/button/button.directive';
import { EnquiryForm } from '../../shared/components/enquiry-form/enquiry-form';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Stepper } from '../../shared/components/stepper/stepper';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-admissions',
  imports: [
    RouterLink,
    Accordion,
    ButtonDirective,
    EnquiryForm,
    Icon,
    PageHero,
    Rich,
    SectionHeading,
    Stepper,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admissions.html',
  styleUrl: './admissions.scss',
})
export class AdmissionsPage {
  private readonly content = inject(ContentService);
  protected readonly site = this.content.site;
  protected readonly adm = this.content.admissions;
}
