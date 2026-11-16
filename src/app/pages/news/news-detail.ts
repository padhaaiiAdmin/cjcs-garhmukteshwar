import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { NewsCard } from '../../shared/components/card/news-card';
import { Icon } from '../../shared/components/icon/icon';
import { Picture } from '../../shared/components/picture/picture';
import { Rich, plain } from '../../shared/components/rich/rich';
import { NotFoundPage } from '../not-found/not-found';

@Component({
  selector: 'app-news-detail',
  imports: [DatePipe, RouterLink, NewsCard, Icon, Picture, Rich, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item(); as n) {
      <article class="article">
        <header class="container container--narrow head">
          <a class="link-arrow back" routerLink="/news"><app-icon name="left" /> All news</a>
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
  protected readonly summary = computed(() => plain(this.item()?.summary ?? ''));
  protected readonly more = computed(() =>
    this.content.news.filter((n) => n.id !== this.id()).slice(0, 3),
  );
}
