import { ImageLoaderConfig } from '@angular/common';
import { IMAGE_BASE, IMAGE_MANIFEST } from './image-manifest';

/**
 * NgOptimizedImage loader: maps an image id + requested width to the
 * pre-generated WebP file, e.g. ("campus-hero", 800) → /assets/images/campus-hero-800.webp.
 * Widths are snapped to the nearest generated size at or above the request
 * (never larger than the source, so nothing is ever upscaled).
 */
export function schoolImageLoader(config: ImageLoaderConfig): string {
  const meta = IMAGE_MANIFEST[config.src];
  if (!meta) return `${IMAGE_BASE}/${config.src}`;
  const target = config.width ?? 1200;
  const width = meta.widths.find((w) => w >= target) ?? meta.widths[meta.widths.length - 1];
  return `${IMAGE_BASE}/${config.src}-${width}.webp`;
}
