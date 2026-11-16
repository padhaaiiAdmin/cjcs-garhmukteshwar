import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { Icon } from '../icon/icon';
import { Rich } from '../rich/rich';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly site = inject(ContentService).site;
  protected readonly year = new Date().getFullYear();
  protected readonly mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.site.mapQuery)}`;
}
