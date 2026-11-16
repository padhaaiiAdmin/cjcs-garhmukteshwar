import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { NewsCard } from '../../shared/components/card/news-card';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-news',
  imports: [NewsCard, PageHero, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      eyebrow="News & events"
      title="What’s happening at school"
      intro="Results, celebrations, notices and events from the Christu Jyoti community."
    />
    <section class="section news" aria-label="News articles">
      <div class="container">
        <h2 class="visually-hidden">Latest stories</h2>
        <div class="filters">
          <div class="chips" role="group" aria-label="Filter news by category">
            @for (c of categories; track c) {
              <button
                type="button"
                class="chip"
                [attr.aria-pressed]="category() === c"
                (click)="category.set(c)"
              >
                {{ c }}
              </button>
            }
          </div>
          <p class="count" aria-live="polite">
            {{ shown().length }} {{ shown().length === 1 ? 'story' : 'stories' }}
          </p>
        </div>
        @if (shown()[0]; as first) {
          <app-news-card class="lead-card" [item]="first" [feature]="true" [priority]="true" />
        }
        <div class="grid">
          @for (n of shown().slice(1); track n.id; let i = $index) {
            <app-news-card [item]="n" [appReveal]="(i % 3) * 80" />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'mixins' as *;
    .news {
      padding-top: 0;
    }
    .lead-card {
      padding-bottom: var(--sp-8);
      margin-bottom: var(--sp-8);
      border-bottom: 1px solid var(--c-line);
    }
    .grid {
      display: grid;
      gap: var(--sp-8) var(--grid-gap);
      @include up(md) {
        grid-template-columns: repeat(2, 1fr);
      }
      @include up(lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
})
export class NewsPage {
  private readonly news = inject(ContentService).news;
  protected readonly categories = ['All', ...new Set(this.news.map((n) => n.category))];
  protected readonly category = signal('All');
  protected readonly shown = computed(() =>
    this.category() === 'All' ? this.news : this.news.filter((n) => n.category === this.category()),
  );
}
