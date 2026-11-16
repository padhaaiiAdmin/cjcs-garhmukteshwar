import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Rich } from '../rich/rich';

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Built on native <details>/<summary>: keyboard and screen-reader accessible
 * with zero JavaScript, and content stays in the HTML for search engines.
 * Items sharing a `name` behave exclusively (one open at a time) in modern browsers.
 */
@Component({
  selector: 'app-accordion',
  imports: [Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.q; let first = $first) {
      <details [attr.name]="name()" [open]="openFirst() && first">
        <summary>
          <span class="q">{{ item.q }}</span>
          <span class="marker" aria-hidden="true"></span>
        </summary>
        <div class="a">
          <p><app-rich [text]="item.a" /></p>
        </div>
      </details>
    }
  `,
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--c-line);
    }
    details {
      border-bottom: 1px solid var(--c-line);
    }
    summary {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-5);
      padding: var(--sp-5) 0;
      cursor: pointer;
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      color: var(--c-blue-900);
      transition: color var(--dur-fast) var(--ease);
      &::-webkit-details-marker {
        display: none;
      }
      &:hover {
        color: var(--c-primary);
      }
    }
    .marker {
      position: relative;
      width: 1.5rem;
      height: 1.5rem;
      flex: none;
      border: 1px solid var(--c-line-strong);
      border-radius: 50%;
      &::before,
      &::after {
        content: '';
        position: absolute;
        inset: 50% auto auto 50%;
        width: 0.6rem;
        height: 1px;
        background: currentColor;
        translate: -50% -50%;
        transition: rotate var(--dur) var(--ease);
      }
      &::after {
        rotate: 90deg;
      }
    }
    details[open] .marker::after {
      rotate: 0deg;
    }
    .a {
      padding: 0 2.5rem var(--sp-5) 0;
      color: var(--c-text-soft);
      max-width: var(--measure);
      p {
        margin: 0;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      details[open] .a {
        animation: fade-down var(--dur) var(--ease-out);
      }
    }
    @keyframes fade-down {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
    }
  `,
})
export class Accordion {
  readonly items = input.required<AccordionItem[]>();
  readonly name = input<string | null>(null);
  readonly openFirst = input(false);
}
