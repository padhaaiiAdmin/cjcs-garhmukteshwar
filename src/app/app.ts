import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Announcement } from './shared/components/announcement/announcement';
import { FloatingContact } from './shared/components/floating-contact/floating-contact';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Announcement, Header, Footer, FloatingContact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main" (click)="skipToMain($event)">Skip to main content</a>
    <app-announcement />
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-floating-contact />
  `,
  styles: `
    main {
      display: block;
      outline: none;
    }
  `,
})
export class App {
  constructor() {
    const scroller = inject(ViewportScroller);
    let firstNavigation = true;

    afterNextRender(() => {
      // Fragment jumps (#faq, #results…) land below the sticky header, not under it.
      scroller.setOffset(() => {
        const bar = document.querySelector<HTMLElement>('.bar');
        return [0, (bar?.offsetHeight ?? 0) + 16];
      });
    });

    // After a page change, move focus to the new content so keyboard and screen-reader
    // users don't have to tab through the header again. Fragment jumps keep their target.
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (firstNavigation) {
          firstNavigation = false;
          return;
        }
        if (e.urlAfterRedirects.includes('#')) return;
        requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
      });
  }

  protected skipToMain(event: Event): void {
    // href="#main" would resolve against <base href="/"> and reload the home page.
    event.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}
