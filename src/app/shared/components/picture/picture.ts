import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { IMAGE_BASE, imageMeta } from '../../../core/images/image-manifest';

/**
 * Responsive, art-directable image.
 *  • <picture> with an AVIF <source> and a WebP <img> served by NgOptimizedImage
 *  • explicit width/height (or `fill`) so there is never layout shift
 *  • a 16px blurred placeholder while the real image streams in
 *  • `priority` for the LCP image: fetchpriority=high + preload during prerender.
 *    (The AVIF source is skipped for priority images so the preload matches.)
 */
@Component({
  selector: 'app-picture',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-fill]': 'fill()' },
  template: `
    <picture>
      @if (!priority()) {
        <source type="image/avif" [attr.srcset]="avifSrcset()" [attr.sizes]="sizes()" />
      }
      @if (fill()) {
        <img
          [ngSrc]="id()"
          [ngSrcset]="srcset()"
          [sizes]="sizes()"
          [alt]="alt()"
          [priority]="priority()"
          [placeholder]="priority() ? false : meta().lqip"
          fill
          [style.object-position]="position()"
        />
      } @else {
        <img
          [ngSrc]="id()"
          [ngSrcset]="srcset()"
          [sizes]="sizes()"
          [alt]="alt()"
          [priority]="priority()"
          [placeholder]="priority() ? false : meta().lqip"
          [width]="meta().width"
          [height]="meta().height"
          [style.object-position]="position()"
        />
      }
    </picture>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    :host(.is-fill) {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    picture {
      display: contents;
    }
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      background-color: var(--c-sand);
    }
    :host(.is-fill) img {
      height: 100%;
    }
  `,
})
export class Picture {
  readonly id = input.required<string>();
  readonly alt = input.required<string>();
  /** CSS `sizes` hint. Default assumes a full-width image on mobile, half on desktop. */
  readonly sizes = input('(min-width: 1024px) 50vw, 100vw');
  readonly priority = input(false, { transform: booleanAttribute });
  readonly fill = input(false, { transform: booleanAttribute });
  readonly position = input('50% 50%');

  protected readonly meta = computed(() => imageMeta(this.id()));
  protected readonly srcset = computed(() =>
    this.meta()
      .widths.map((w) => `${w}w`)
      .join(', '),
  );
  protected readonly avifSrcset = computed(() =>
    this.meta()
      .widths.map((w) => `${IMAGE_BASE}/${this.id()}-${w}.avif ${w}w`)
      .join(', '),
  );
}
