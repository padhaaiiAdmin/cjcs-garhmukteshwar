import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ContentService } from '../../../core/services/content.service';
import { Icon } from '../icon/icon';

/** Thumb-reachable call + WhatsApp buttons, shown on phones and tablets only. */
@Component({
  selector: 'app-floating-contact',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fab" [class.is-visible]="visible()" role="group" aria-label="Contact the school">
      <a
        class="fab__btn fab__btn--wa"
        [href]="whatsapp"
        target="_blank"
        rel="noopener"
        aria-label="Chat with the school office on WhatsApp"
      >
        <app-icon name="whatsapp" /><span>WhatsApp</span>
      </a>
      <a class="fab__btn" [href]="'tel:' + site.phone.tel" aria-label="Call the school office">
        <app-icon name="phone" /><span>Call</span>
      </a>
    </div>
  `,
  styles: `
    @use 'mixins' as *;
    .fab {
      position: fixed;
      right: max(0.75rem, env(safe-area-inset-right));
      bottom: max(0.75rem, env(safe-area-inset-bottom));
      z-index: 40;
      display: flex;
      gap: 0.5rem;
      padding: 0.35rem;
      border-radius: var(--radius-pill);
      background: color-mix(in srgb, var(--c-maroon-900) 94%, transparent);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
      opacity: 0;
      visibility: hidden;
      transform: translateY(1rem);
      transition:
        opacity var(--dur) var(--ease),
        transform var(--dur) var(--ease),
        visibility 0s linear var(--dur);
      &.is-visible {
        opacity: 1;
        visibility: visible;
        transform: none;
        transition-delay: 0s;
      }
      @include up(lg) {
        display: none;
      }
    }
    .fab__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      min-height: 2.9rem;
      padding: 0 1rem;
      border-radius: var(--radius-pill);
      color: var(--c-snow);
      font-size: var(--fs-sm);
      font-weight: 700;
      text-decoration: none;
      &:hover {
        color: var(--c-snow);
        background: rgb(255 253 249 / 10%);
      }
      app-icon {
        color: var(--c-gold-300);
        font-size: 1.15rem;
      }
    }
    .fab__btn--wa {
      background: var(--c-gold-300);
      color: var(--c-maroon-950);
      app-icon {
        color: var(--c-maroon-900);
      }
      &:hover {
        background: var(--c-gold-100);
        color: var(--c-maroon-950);
      }
    }
  `,
})
export class FloatingContact {
  protected readonly site = inject(ContentService).site;
  /** Appears once the visitor scrolls past the first screen, so it never covers the hero CTAs. */
  protected readonly visible = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.visible.set(window.scrollY > window.innerHeight * 0.6);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
  protected readonly whatsapp = `https://wa.me/${this.site.whatsapp.number}?text=${encodeURIComponent(
    'Hello, I would like to know more about admissions at Christu Jyoti Convent School.',
  )}`;
}
