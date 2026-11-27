import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Rich } from '../rich/rich';

/** The admission journey as an ordered list: horizontal on desktop, vertical on mobile. */
@Component({
  selector: 'app-stepper',
  imports: [Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-compact]': 'compact()', '[class.is-light]': 'light()' },
  template: `
    <ol>
      @for (step of steps(); track step.title; let i = $index) {
        <li>
          <span class="num" aria-hidden="true">{{ i + 1 }}</span>
          <div>
            <h3>
              <span class="visually-hidden">Step {{ i + 1 }}: </span>{{ step.title }}
            </h3>
            @if (!compact()) {
              <p><app-rich [text]="step.text" /></p>
            }
          </div>
        </li>
      }
    </ol>
  `,
  styles: `
    @use 'mixins' as *;
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--sp-6);
      counter-reset: step;
      @include up(md) {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--grid-gap);
      }
    }
    li {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--sp-4);
      @include up(md) {
        grid-template-columns: 1fr;
      }
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        background: var(--c-stone);
        left: 1.5rem;
        top: 3.25rem;
        bottom: calc(-1 * var(--sp-6) + 0.25rem);
        width: 1px;
        @include up(md) {
          left: 3.75rem;
          right: calc(-1 * var(--grid-gap) + 0.5rem);
          top: 1.5rem;
          bottom: auto;
          width: auto;
          height: 1px;
        }
      }
    }
    .num {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: 1px solid var(--c-gold-500);
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      color: var(--c-blue-700);
      background: var(--c-bg);
    }
    h3 {
      font-size: var(--fs-md);
      margin: 0.6rem 0 var(--sp-2);
    }
    p {
      margin: 0;
      color: var(--c-text-soft);
      font-size: var(--fs-base);
      max-width: 34ch;
    }
    :host(.is-light) {
      .num {
        background: transparent;
        color: var(--c-sky-300);
        border-color: var(--c-sky-300);
      }
      h3 {
        color: var(--c-snow);
      }
      li::after {
        background: rgb(255 253 249 / 25%);
      }
    }
  `,
})
export class Stepper {
  readonly steps = input.required<{ title: string; text: string }[]>();
  readonly compact = input(false);
  readonly light = input(false);
}
