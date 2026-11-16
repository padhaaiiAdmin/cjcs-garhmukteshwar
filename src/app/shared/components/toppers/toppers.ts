import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import type { ResultYear, Topper } from '../../../core/models/content.models';
import { RevealDirective } from '../../directives/reveal.directive';
import { Picture } from '../picture/picture';

type Tab = 'x' | 'xii';

/**
 * Board toppers with accessible Class X / Class XII tabs (WAI-ARIA tabs pattern:
 * arrow keys move between tabs, only the active tab is in the tab order).
 */
@Component({
  selector: 'app-toppers',
  imports: [Picture, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toppers.html',
  styleUrl: './toppers.scss',
})
export class Toppers {
  readonly result = input.required<ResultYear>();
  /** How many to show as large portrait cards */
  readonly featured = input(3);
  readonly idPrefix = input('toppers');

  protected readonly tab = signal<Tab>('x');
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  protected readonly list = computed<Topper[]>(() =>
    this.tab() === 'x' ? this.result().classX : this.result().classXII,
  );
  protected readonly top = computed(() => this.list().slice(0, this.featured()));
  protected readonly rest = computed(() => this.list().slice(this.featured()));

  protected readonly tabs: { id: Tab; label: string; exam: string }[] = [
    { id: 'x', label: 'Class X', exam: 'ICSE' },
    { id: 'xii', label: 'Class XII', exam: 'ISC' },
  ];

  protected select(t: Tab, focus = false): void {
    this.tab.set(t);
    if (focus) {
      const i = this.tabs.findIndex((x) => x.id === t);
      this.tabButtons()[i]?.nativeElement.focus();
    }
  }

  protected onKey(e: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next: Tab =
      e.key === 'Home' ? 'x' : e.key === 'End' ? 'xii' : this.tab() === 'x' ? 'xii' : 'x';
    this.select(next, true);
  }

  protected rank(i: number): string {
    return ['First', 'Second', 'Third'][i] ?? `${i + 1}th`;
  }
}
