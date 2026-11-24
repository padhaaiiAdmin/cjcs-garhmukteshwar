import { DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { NewsCard } from '../../shared/components/card/news-card';
import { NextSteps } from '../../shared/components/next-steps/next-steps';
import { Icon } from '../../shared/components/icon/icon';
import { Picture } from '../../shared/components/picture/picture';
import { Rich, plain } from '../../shared/components/rich/rich';
import { NotFoundPage } from '../not-found/not-found';

@Component({
  selector: 'app-news-detail',
  imports: [DatePipe, RouterLink, NewsCard, Icon, Picture, Rich, NotFoundPage, NextSteps],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item(); as n) {
      <article class="article">
        <header class="container container--narrow head">
          <a class="link-arrow back" routerLink="/news" (click)="back($event)"
            ><app-icon name="left" /> All news</a
          >
          <p class="meta">
            <span>{{ n.category }}</span> ·
            <time [attr.datetime]="n.date">{{ n.dateLabel ?? (n.date | date: 'd MMMM y') }}</time>
          </p>
          <h1>{{ n.title }}</h1>
          <p class="lead">{{ summary() }}</p>
        </header>
        @if (n.image; as img) {
          <div class="container media">
            <div class="frame frame--wide">
              <app-picture
                [id]="img.id"
                [alt]="img.alt"
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
              />
            </div>
          </div>
        }
        <div class="container container--narrow prose body">
          @for (p of n.body; track $index) {
            <p><app-rich [text]="p" /></p>
          }
          @if (n.albumId) {
            <p>
              <a class="btn btn--ghost" routerLink="/gallery" [fragment]="n.albumId"
                >View the photo album <app-icon name="arrow"
              /></a>
            </p>
          }
        </div>
        @if (newer() || older()) {
          <nav class="container container--narrow pager" aria-label="More stories">
            @if (older(); as o) {
              <a class="pager__link" [routerLink]="['/news', o.id]">
                <span class="pager__dir"><app-icon name="left" /> Older</span>
                <span class="pager__title">{{ o.title }}</span>
              </a>
            }
            @if (newer(); as nw) {
              <a class="pager__link pager__link--next" [routerLink]="['/news', nw.id]">
                <span class="pager__dir">Newer <app-icon name="arrow" /></span>
                <span class="pager__title">{{ nw.title }}</span>
              </a>
            }
          </nav>
        }
      </article>
      @if (more().length) {
        <section class="section section--paper" aria-labelledby="more-title">
          <div class="container">
            <h2 id="more-title">More from school</h2>
            <div class="grid">
              @for (m of more(); track m.id) {
                <app-news-card [item]="m" />
              }
            </div>
          </div>
        </section>
      }
      <app-next-steps />
    } @else {
      <app-not-found />
    }
  `,
  styles: `
    @use 'mixins' as *;
    .article {
      padding-block: var(--sp-8);
    }
    .head h1 {
      font-size: var(--fs-3xl);
    }
    .back {
      margin-bottom: var(--sp-6);
    }
    .meta {
      font-size: var(--fs-xs);
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--c-gold-600);
    }
    .media {
      margin-block: var(--sp-7);
    }
    .body {
      font-size: var(--fs-md);
      margin-inline: auto;
    }
    .pager {
      display: grid;
      gap: var(--sp-4);
      margin-top: var(--sp-8);
      padding-top: var(--sp-6);
      border-top: 1px solid var(--c-line);
      @include up(md) {
        grid-template-columns: 1fr 1fr;
      }
    }
    .pager__link {
      display: grid;
      gap: var(--sp-1);
      padding: var(--sp-4) var(--sp-5);
      border: 1px solid var(--c-line);
      border-radius: var(--radius-lg);
      text-decoration: none;
      transition:
        border-color var(--dur-fast) var(--ease),
        background var(--dur-fast) var(--ease);
      &:hover {
        border-color: var(--c-primary);
        background: var(--c-surface);
      }
    }
    .pager__link--next {
      text-align: right;
      @include up(md) {
        grid-column: 2;
      }
    }
    .pager__dir {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      font-size: var(--fs-sm);
      font-weight: 700;
      color: var(--c-primary);
    }
    .pager__link--next .pager__dir {
      justify-content: flex-end;
    }
    .pager__title {
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      line-height: 1.3;
      color: var(--c-blue-900);
    }
    .grid {
      display: grid;
      gap: var(--sp-7) var(--grid-gap);
      margin-top: var(--sp-6);
      @include up(md) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
})
export class NewsDetailPage {
  /** Bound from the :id route param (withComponentInputBinding) */
  readonly id = input('');
  private readonly content = inject(ContentService);
  protected readonly item = computed(() => this.content.newsById(this.id()));
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  /** The list URL the reader came from (keeps their ?category= filter and scroll position). */
  private readonly cameFromList = (() => {
    // Created mid-navigation, so the in-flight navigation's predecessor is the page we left.
    const nav = this.router.currentNavigation() ?? this.router.lastSuccessfulNavigation();
    const prev = nav?.previousNavigation?.finalUrl?.toString() ?? '';
    return /^\/news(\?|$)/.test(prev);
  })();

  protected back(event: MouseEvent): void {
    if (!this.cameFromList || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    this.location.back();
  }
  protected readonly summary = computed(() => plain(this.item()?.summary ?? ''));
  /** News is stored newest first. */
  private readonly position = computed(() => this.content.news.findIndex((n) => n.id === this.id()));
  protected readonly newer = computed(() => {
    const i = this.position();
    return i > 0 ? this.content.news[i - 1] : undefined;
  });
  protected readonly older = computed(() => {
    const i = this.position();
    return i >= 0 ? this.content.news[i + 1] : undefined;
  });
  protected readonly more = computed(() =>
    this.content.news.filter((n) => n.id !== this.id()).slice(0, 3),
  );
}
