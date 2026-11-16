import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ImageRef } from '../../../core/models/content.models';
import { Picture } from '../picture/picture';
import { Rich } from '../rich/rich';

/** Editorial page opener used by every inner page. */
@Component({
  selector: 'app-page-hero',
  imports: [Picture, Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="container head">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1>{{ title() }}</h1>
      @if (intro()) {
        <p class="lead"><app-rich [text]="intro()" /></p>
      }
      <ng-content />
    </header>
    @if (image(); as img) {
      <div class="media">
        <app-picture
          [id]="img.id"
          [alt]="img.alt"
          fill
          priority
          sizes="100vw"
          [position]="position()"
        />
      </div>
    }
  `,
  styles: `
    @use 'mixins' as *;
    :host {
      display: block;
      padding-top: clamp(2.5rem, 1.5rem + 5vw, 6rem);
    }
    .head {
      display: grid;
      gap: var(--sp-4);
      padding-bottom: clamp(2.5rem, 1.5rem + 4vw, 5rem);
      @include up(lg) {
        grid-template-columns: 7fr 5fr;
        column-gap: var(--grid-gap);
        align-items: end;
        .eyebrow {
          grid-column: 1 / -1;
        }
      }
    }
    h1 {
      font-size: var(--fs-display);
      margin: 0;
      font-weight: 350;
    }
    .lead {
      margin: 0;
      @include up(lg) {
        padding-bottom: 0.6rem;
      }
    }
    .media {
      position: relative;
      height: clamp(15rem, 40vw, 34rem);
      margin-inline: auto;
      max-width: 1920px;
    }
  `,
})
export class PageHero {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input('');
  readonly image = input<ImageRef | null>(null);
  readonly position = input('50% 50%');
}
