import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Rich } from '../rich/rich';

@Component({
  selector: 'app-section-heading',
  imports: [Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-center]': "align() === 'center'", '[class.is-light]': 'light()' },
  template: `
    @if (eyebrow()) {
      <p class="eyebrow">{{ eyebrow() }}</p>
    }
    @switch (level()) {
      @case (1) {
        <h1 [id]="headingId()">{{ title() }}</h1>
      }
      @case (3) {
        <h3 [id]="headingId()">{{ title() }}</h3>
      }
      @default {
        <h2 [id]="headingId()">{{ title() }}</h2>
      }
    }
    @if (intro()) {
      <p class="lead"><app-rich [text]="intro()" /></p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
      max-width: 44rem;
      margin-bottom: var(--sp-7);
    }
    :host(.is-center) {
      text-align: center;
      margin-inline: auto;
      .lead {
        margin-inline: auto;
      }
      .eyebrow::after {
        content: '';
        width: 1.75rem;
        height: 1px;
        background: currentColor;
      }
    }
    :host(.is-light) {
      h1,
      h2,
      h3 {
        color: var(--c-snow);
      }
      .eyebrow {
        color: var(--c-gold-300);
      }
      .lead {
        color: rgb(255 253 249 / 82%);
      }
    }
    .lead {
      margin-top: var(--sp-4);
      margin-bottom: 0;
    }
  `,
})
export class SectionHeading {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly intro = input('');
  readonly level = input<1 | 2 | 3>(2);
  readonly align = input<'start' | 'center'>('start');
  readonly light = input(false);
  readonly headingId = input<string | null>(null);
}
