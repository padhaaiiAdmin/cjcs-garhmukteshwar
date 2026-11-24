import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ImageRef } from '../../../core/models/content.models';
import { Picture } from '../picture/picture';
import { Rich } from '../rich/rich';

/** Editorial page opener used by every inner page. */
@Component({
  selector: 'app-page-hero',
  imports: [Picture, Rich, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="container head">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a routerLink="/">Home</a></li>
          <li aria-current="page">{{ crumb() }}</li>
        </ol>
      </nav>
      <h1>{{ title() }}</h1>
      @if (intro()) {
        <p class="lead"><app-rich [text]="intro()" /></p>
      }
      <ng-content />
    </header>
    @if (image(); as img) {
      <div class="media">
        <app-picture
          [id]="img.id"
          [alt]="img.alt"
          fill
          priority
          sizes="100vw"
          [position]="position()"
        />
      </div>
    }
  `,
  styles: `
    @use 'mixins' as *;
    :host {
      display: block;
      padding-top: clamp(2.5rem, 1.5rem + 5vw, 6rem);
    }
    .head {
      display: grid;
      gap: var(--sp-4);
      padding-bottom: clamp(2.5rem, 1.5rem + 4vw, 5rem);
      @include up(lg) {
        grid-template-columns: 7fr 5fr;
        column-gap: var(--grid-gap);
        align-items: end;
        .crumbs {
          grid-column: 1 / -1;
        }
      }
    }
    .crumbs ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: var(--fs-sm);
      color: var(--c-ink-mute);
    }
    .crumbs li + li::before {
      content: '/';
      margin-right: 0.4rem;
      color: var(--c-stone);
    }
    .crumbs a {
      color: var(--c-primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .crumbs [aria-current] {
      font-weight: 600;
      color: var(--c-ink-soft);
    }
    h1 {
      font-size: var(--fs-display);
      margin: 0;
      font-weight: 350;
    }
    .lead {
      margin: 0;
      @include up(lg) {
        padding-bottom: 0.6rem;
      }
    }
    .media {
      position: relative;
      height: clamp(15rem, 40vw, 34rem);
      margin-inline: auto;
      max-width: 1920px;
    }
  `,
})
export class PageHero {
  /** This page's name in the "Home / …" breadcrumb. */
  readonly crumb = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input('');
  readonly image = input<ImageRef | null>(null);
  readonly position = input('50% 50%');
}
