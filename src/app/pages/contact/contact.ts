import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { EnquiryForm } from '../../shared/components/enquiry-form/enquiry-form';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { Picture } from '../../shared/components/picture/picture';
import { Rich } from '../../shared/components/rich/rich';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-contact',
  imports: [EnquiryForm, Icon, PageHero, Picture, Rich, SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactPage {
  protected readonly site = inject(ContentService).site;
  private readonly q = encodeURIComponent(this.site.mapQuery);
  protected readonly mapSrc = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://maps.google.com/maps?q=${this.q}&z=15&output=embed`,
  );
  protected readonly directions = `https://www.google.com/maps/dir/?api=1&destination=${this.q}`;
  protected readonly whatsapp = `https://wa.me/${this.site.whatsapp.number}?text=${encodeURIComponent(
    'Hello, I have a question for the school office.',
  )}`;
}
