import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { Icon } from '../icon/icon';

/**
 * Closing band for inner pages, so no page ends in a dead end.
 *  • `admissions`: register online / book a visit / call (prospective parents)
 *  • `help`: call / WhatsApp the office (current parents who couldn't find something)
 */
@Component({
  selector: 'app-next-steps',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="next" [attr.aria-labelledby]="headingId">
      <div class="container next__inner">
        <div class="next__text">
          <h2 [id]="headingId">{{ heading() }}</h2>
          <p>{{ text() }}</p>
        </div>
        <div class="next__actions">
          @if (mode() === 'admissions') {
            <a class="btn btn--gold" [href]="site.portals.registration" target="_blank" rel="noopener"
              >Register online <app-icon name="external" /><span class="visually-hidden">
                (opens in new tab)</span
              ></a
            >
            <a class="btn btn--ghost-light" routerLink="/contact" fragment="visit"
              >Book a campus visit</a
            >
          } @else {
            <a class="btn btn--gold" [href]="'tel:' + site.phone.tel"
              ><app-icon name="phone" /> Call {{ site.phone.display }}</a
            >
            <a class="btn btn--ghost-light" [href]="whatsapp" target="_blank" rel="noopener"
              ><app-icon name="whatsapp" /> WhatsApp the office<span class="visually-hidden">
                (opens WhatsApp)</span
              ></a
            >
          }
          <p class="next__meta">
            @if (mode() === 'admissions') {
              Or call <a [href]="'tel:' + site.phone.tel">{{ site.phone.display }}</a> ·
            }
            Office {{ site.officeHours }}
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'mixins' as *;
    :host {
      display: block;
    }
    .next {
      background: var(--c-blue-800);
      color: rgb(255 253 249 / 85%);
      padding-block: clamp(3rem, 2rem + 4vw, 5.5rem);
    }
    .next__inner {
      display: grid;
      gap: var(--sp-6);
      @include up(lg) {
        grid-template-columns: 7fr 5fr;
        align-items: center;
        gap: var(--sp-8);
      }
    }
    h2 {
      color: var(--c-snow);
      font-size: var(--fs-2xl);
      font-weight: 350;
      margin-bottom: var(--sp-3);
    }
    .next__text p {
      margin: 0;
      font-size: var(--fs-md);
      max-width: 46ch;
    }
    .next__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
      @include down(sm) {
        .btn {
          flex: 1 1 100%;
        }
      }
    }
    .next__meta {
      flex-basis: 100%;
      margin: var(--sp-2) 0 0;
      font-size: var(--fs-sm);
      color: rgb(255 253 249 / 72%);
      a {
        color: var(--c-snow);
        font-weight: 600;
      }
    }
  `,
})
export class NextSteps {
  protected readonly site = inject(ContentService).site;
  readonly mode = input<'admissions' | 'help'>('admissions');
  readonly heading = input('Come and see Christu Jyoti for yourself');
  readonly text = input(
    'Register online for admission, or visit the campus and meet the sisters and teachers first.',
  );
  protected readonly headingId = `next-${Math.random().toString(36).slice(2, 8)}`;
  protected readonly whatsapp = `https://wa.me/${this.site.whatsapp.number}`;
}
