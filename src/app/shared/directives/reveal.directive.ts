import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

let observer: IntersectionObserver | undefined;

/**
 * Lightweight scroll reveal. Content is fully visible in the prerendered HTML
 * (good for SEO and no-JS). In the browser, only elements that are still below
 * the fold get the `reveal` class, then fade up when they scroll into view.
 * Users who prefer reduced motion see no movement (handled in CSS).
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements OnDestroy {
  /** Stagger delay in ms */
  readonly appReveal = input(0, { transform: (v: unknown) => Number(v) || 0 });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;
      if (!('IntersectionObserver' in window)) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) return; // already in view: leave as is
      const delay = this.appReveal();
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.classList.add('reveal');
      observer ??= new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    observer?.unobserve(this.el.nativeElement);
  }
}
