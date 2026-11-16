import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Announcement } from './shared/components/announcement/announcement';
import { FloatingContact } from './shared/components/floating-contact/floating-contact';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Announcement, Header, Footer, FloatingContact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to main content</a>
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
export class App {}
