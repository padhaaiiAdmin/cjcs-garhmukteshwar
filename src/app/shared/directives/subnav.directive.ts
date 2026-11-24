import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * In-page section nav (`<nav class="subnav" appSubnav>`):
 *  • marks the link of the section being read (`aria-current="location"`) and keeps it in view,
 *  • fades the right edge while more links are hidden off-screen, so phones show it scrolls.
 */
@Directive({ selector: '[appSubnav]' })
export class SubnavDirective {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const list = host.querySelector('ul');
      const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'));
      if (!list || !links.length) return;

      const updateFade = () => {
        const more = list.scrollLeft + list.clientWidth < list.scrollWidth - 4;
        list.classList.toggle('has-more', more);
      };
      updateFade();
      list.addEventListener('scroll', updateFade, { passive: true });
      window.addEventListener('resize', updateFade, { passive: true });

      const byId = new Map<string, HTMLAnchorElement>();
      for (const a of links) {
        const id = decodeURIComponent(a.hash.slice(1));
        if (document.getElementById(id)) byId.set(id, a);
      }
      const setCurrent = (id: string) => {
        for (const [key, a] of byId) {
          const on = key === id;
          a.classList.toggle('is-current', on);
          if (on) {
            a.setAttribute('aria-current', 'location');
            const left = a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2;
            list.scrollTo({ left, behavior: 'smooth' });
          } else {
            a.removeAttribute('aria-current');
          }
        }
      };

      // The current section is the last one whose top has passed the line just below the bars.
      const visible = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.add(e.target.id);
            else visible.delete(e.target.id);
          }
          const first = [...byId.keys()].find((id) => visible.has(id));
          if (first) setCurrent(first);
        },
        { rootMargin: '-30% 0px -60% 0px' },
      );
      for (const id of byId.keys()) observer.observe(document.getElementById(id)!);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        list.removeEventListener('scroll', updateFade);
        window.removeEventListener('resize', updateFade);
      });
    });
  }
}
