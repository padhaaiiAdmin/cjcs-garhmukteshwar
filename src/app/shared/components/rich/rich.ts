import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Part {
  text: string;
  tbc: boolean;
}

const TBC = /(\[\[TO CONFIRM[^\]]*\]\])/g;

/**
 * Renders content text and turns any "[[TO CONFIRM: …]]" into a highlighted,
 * clearly visible placeholder, so missing facts can never slip into
 * production unnoticed.
 */
@Component({
  selector: 'app-rich',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (part of parts(); track $index) {
    @if (part.tbc) {
      <mark class="tbc" title="Content to be confirmed by the school">{{ part.text }}</mark>
    } @else {
      {{ part.text }}
    }
  }`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Rich {
  readonly text = input.required<string>();
  protected readonly parts = computed<Part[]>(() =>
    this.text()
      .split(TBC)
      .filter(Boolean)
      .map((text) => ({ text, tbc: text.startsWith('[[TO CONFIRM') })),
  );
}

/** Strips placeholders for attributes (alt, aria-label, meta) where marks can't render. */
export function plain(text: string): string {
  return text
    .replace(TBC, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
