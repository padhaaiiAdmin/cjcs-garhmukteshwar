import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  viewChild,
} from '@angular/core';
import type { ImageRef } from '../../../core/models/content.models';
import { Icon } from '../icon/icon';
import { Picture } from '../picture/picture';

/**
 * Accessible lightbox on the native <dialog> element: focus is trapped and
 * restored by the browser, Esc closes, ← → navigate, and swipe works on touch.
 */
@Component({
  selector: 'app-lightbox',
  imports: [Picture, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dlg
      aria-label="Photo viewer"
      tabindex="-1"
      (close)="index.set(null)"
      (keydown)="onKey($event)"
      (pointerdown)="startX = $event.clientX"
      (pointerup)="onSwipe($event.clientX)"
      (click)="onBackdrop($event)"
    >
      @if (current(); as img) {
        <figure>
          <div class="lb-frame">
            @for (shown of [img]; track shown.id) {
              <app-picture [id]="shown.id" [alt]="shown.alt" fill sizes="100vw" />
            }
          </div>
          <figcaption>
            <span class="count" aria-live="polite"
              >{{ (index() ?? 0) + 1 }} / {{ images().length }}</span
            >
            <span class="cap">{{ img.caption ?? img.alt }}</span>
          </figcaption>
        </figure>
        @if (images().length > 1) {
          <button type="button" class="nav prev" (click)="step(-1)" aria-label="Previous photo">
            <app-icon name="left" />
          </button>
          <button type="button" class="nav next" (click)="step(1)" aria-label="Next photo">
            <app-icon name="right" />
          </button>
        }
        <button type="button" class="close" (click)="dlg.close()" aria-label="Close photo viewer">
          <app-icon name="close" />
        </button>
      }
    </dialog>
  `,
  styles: `
    @use 'mixins' as *;
    dialog {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      margin: 0;
      padding: 0;
      border: 0;
      background: #081228;
      color: var(--c-snow);
      overscroll-behavior: contain;
      touch-action: pan-y;
      &::backdrop {
        background: rgb(8 18 40 / 80%);
      }
      &:focus,
      &:focus-visible {
        outline: none;
      }
      &[open] {
        @include motion {
          animation: lb-in 260ms var(--ease-out);
        }
      }
    }
    figure {
      margin: 0;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      padding: 4rem var(--gutter) 1rem;
      @include up(md) {
        padding-inline: 5.5rem;
      }
    }
    .lb-frame {
      position: relative;
      min-height: 0;
      ::ng-deep img {
        object-fit: contain !important;
        background: transparent !important;
      }
    }
    figcaption {
      display: flex;
      gap: var(--sp-4);
      align-items: baseline;
      justify-content: center;
      padding-top: var(--sp-4);
      font-size: var(--fs-sm);
      color: rgb(255 253 249 / 80%);
      text-align: center;
    }
    .count {
      font-variant-numeric: tabular-nums;
      color: var(--c-sky-300);
      flex: none;
    }
    button {
      position: absolute;
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: 1px solid rgb(255 253 249 / 30%);
      background: rgb(8 18 40 / 50%);
      color: var(--c-snow);
      font-size: 1.25rem;
      transition: background var(--dur-fast) var(--ease);
      &:hover {
        background: rgb(255 253 249 / 15%);
      }
      &:focus-visible {
        outline: 2px solid var(--c-sky-300);
        outline-offset: 2px;
      }
    }
    .close {
      top: var(--sp-3);
      right: var(--sp-3);
    }
    .nav {
      top: 50%;
      translate: 0 -50%;
    }
    .prev {
      left: var(--sp-3);
    }
    .next {
      right: var(--sp-3);
    }
    @keyframes lb-in {
      from {
        opacity: 0;
      }
    }
  `,
})
export class Lightbox {
  readonly images = input.required<ImageRef[]>();
  /** Index of the open image; null = closed. Two-way bindable: [(index)] */
  readonly index = model<number | null>(null);

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : (this.images()[i] ?? null);
  });
  protected startX = 0;

  constructor() {
    effect(() => {
      const dialog = this.dlg().nativeElement;
      const open = this.index() !== null;
      if (open && !dialog.open) dialog.showModal();
      if (!open && dialog.open) dialog.close();
    });
  }

  protected step(delta: number): void {
    const n = this.images().length;
    this.index.update((i) => (i === null ? null : (i + delta + n) % n));
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }

  protected onSwipe(endX: number): void {
    const dx = endX - this.startX;
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }

  protected onBackdrop(e: MouseEvent): void {
    // Clicking the dark area around the figure (not the photo or controls) closes.
    if ((e.target as HTMLElement).tagName === 'FIGURE') this.dlg().nativeElement.close();
  }
}
