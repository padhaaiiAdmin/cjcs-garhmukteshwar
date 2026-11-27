import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container nf">
      <h1>This page has wandered off.</h1>
      <p class="lead">
        The page you were looking for may have moved when our website was renewed. Holiday
        homework and forms are now on the Downloads page.
      </p>
      <div class="links">
        <a class="btn" routerLink="/">Back to home <app-icon name="arrow" /></a>
        <a class="btn btn--ghost" routerLink="/downloads">Downloads</a>
        <a class="btn btn--ghost" routerLink="/admissions">Admissions</a>
        <a class="btn btn--ghost" routerLink="/contact">Contact</a>
      </div>
    </section>
  `,
  styles: `
    .nf {
      padding-block: clamp(4rem, 3rem + 8vw, 10rem);
      max-width: 52rem;
    }
    h1 {
      font-size: var(--fs-display);
      font-weight: 350;
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
      margin-top: var(--sp-6);
    }
  `,
})
export class NotFoundPage {}
