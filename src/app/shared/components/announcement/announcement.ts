import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { ContentService } from '../../../core/services/content.service';
import { Icon } from '../icon/icon';
import { Rich } from '../rich/rich';

const KEY = 'cjcs-announcement-dismissed';

/**
 * Replaces the old site's on-load pop-up with a calm, dismissible bar.
 * Dismissal is remembered per announcement id (localStorage, best-effort).
 * A tiny inline script in index.html hides a dismissed bar before first paint,
 * so returning visitors never see a layout shift.
 */
@Component({
  selector: 'app-announcement',
  imports: [Icon, Rich],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <aside class="ann" [attr.data-ann-id]="ann.id" aria-label="Announcement">
        <div class="container ann__inner">
          <p>
            <span class="ann__dot" aria-hidden="true"></span>
            <app-rich [text]="ann.text" />
            <a
              [href]="ann.cta.url"
              [attr.target]="ann.cta.external ? '_blank' : null"
              rel="noopener"
              >{{ ann.cta.label }} <app-icon name="arrow" />@if (ann.cta.external) {
                <span class="visually-hidden"> (opens in new tab)</span>
              }</a
            >
          </p>
          <button type="button" (click)="dismiss()" aria-label="Dismiss announcement">
            <app-icon name="close" />
          </button>
        </div>
      </aside>
    }
  `,
  styles: `
    @use 'mixins' as *;
    .ann {
      background: var(--c-sky-100);
      color: var(--c-blue-900);
      font-size: var(--fs-sm);
      border-bottom: 1px solid color-mix(in srgb, var(--c-sky-400) 45%, transparent);
    }
    .ann__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3);
      min-height: 2.75rem;
    }
    p {
      margin: 0;
      padding-block: 0.45rem;
      line-height: 1.45;
    }
    .ann__dot {
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.6rem;
      border-radius: 50%;
      background: var(--c-sky-400);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-sky-400) 30%, transparent);
      vertical-align: middle;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 0.3em;
      margin-left: 0.6rem;
      font-weight: 700;
      color: var(--c-blue-700);
      white-space: nowrap;
    }
    button {
      display: grid;
      place-items: center;
      flex: none;
      width: 2.5rem;
      height: 2.5rem;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--c-blue-900);
      &:hover {
        background: rgb(15 42 92 / 8%);
      }
    }
  `,
})
export class Announcement {
  protected readonly ann = inject(ContentService).site.announcement;
  protected readonly visible = signal(this.ann.enabled);

  constructor() {
    afterNextRender(() => {
      try {
        if (localStorage.getItem(KEY) === this.ann.id) this.visible.set(false);
      } catch {
        /* storage unavailable: keep showing */
      }
    });
  }

  protected dismiss(): void {
    this.visible.set(false);
    // The button disappears with the bar; hand keyboard focus to the next landmark.
    document.querySelector<HTMLElement>('.bar .brand')?.focus();
    try {
      localStorage.setItem(KEY, this.ann.id);
    } catch {
      /* ignore */
    }
  }
}
