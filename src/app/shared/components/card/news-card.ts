import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { NewsItem } from '../../../core/models/content.models';
import { Picture } from '../picture/picture';
import { plain } from '../rich/rich';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, Picture, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-feature]': 'feature()' },
  template: `
    <article>
      <a class="media" [routerLink]="['/news', item().id]" tabindex="-1" aria-hidden="true">
        @if (item().image; as img) {
          <app-picture
            [id]="img.id"
            [alt]="img.alt"
            fill
            [priority]="priority()"
            [sizes]="
              feature()
                ? '(min-width: 1024px) 58vw, 100vw'
                : '(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw'
            "
          />
        } @else {
          <span class="placeholder">
            <img
              src="/assets/images/logo-240.webp"
              alt=""
              width="240"
              height="207"
              loading="lazy"
            />
          </span>
        }
      </a>
      <div class="body">
        <p class="meta">
          <span class="cat">{{ item().category }}</span>
          <time [attr.datetime]="item().date">{{
            item().dateLabel ?? (item().date | date: 'd MMMM y')
          }}</time>
        </p>
        <h3>
          <a [routerLink]="['/news', item().id]">{{ item().title }}</a>
        </h3>
        <p class="summary">{{ summary() }}</p>
      </div>
    </article>
  `,
  styles: `
    @use 'mixins' as *;
    :host {
      display: block;
    }
    article {
      position: relative;
      display: grid;
      gap: var(--sp-5);
      height: 100%;
    }
    .media {
      position: relative;
      display: block;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border-radius: var(--radius);
      background: var(--c-sand);
      ::ng-deep img {
        transition: transform 1.2s var(--ease-out);
      }
    }
    article:hover .media ::ng-deep img {
      transform: scale(1.04);
    }
    .placeholder {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: var(--c-paper);
      img {
        width: 34%;
        opacity: 0.5;
      }
    }
    .meta {
      display: flex;
      gap: var(--sp-3);
      align-items: center;
      margin: 0 0 var(--sp-3);
      font-size: var(--fs-xs);
      font-weight: 600;
      letter-spacing: 0.06em;
      color: var(--c-ink-mute);
      text-transform: uppercase;
    }
    .cat {
      color: var(--c-gold-600);
      &::after {
        content: '·';
        margin-left: var(--sp-3);
        color: var(--c-ink-mute);
      }
    }
    h3 {
      font-size: var(--fs-lg);
      margin-bottom: var(--sp-3);
      a {
        color: inherit;
        text-decoration: none;
        background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
        transition: background-size var(--dur) var(--ease);
        // Whole card is clickable
        &::after {
          content: '';
          position: absolute;
          inset: 0;
        }
      }
    }
    article:hover h3 a {
      background-size: 100% 1px;
    }
    .summary {
      color: var(--c-text-soft);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    :host(.is-feature) {
      @include up(lg) {
        article {
          grid-template-columns: 7fr 5fr;
          align-items: center;
          gap: var(--sp-7);
        }
        .media {
          aspect-ratio: 3 / 2;
        }
        h3 {
          font-size: var(--fs-xl);
        }
      }
    }
  `,
})
export class NewsCard {
  readonly item = input.required<NewsItem>();
  readonly feature = input(false);
  /** Set on the first, above-the-fold card so it is fetched eagerly (LCP). */
  readonly priority = input(false);
  protected summary = () => plain(this.item().summary);
}
