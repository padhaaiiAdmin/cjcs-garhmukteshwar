// Generates responsive AVIF + WebP (+ a JPEG fallback) for every image listed in
// scripts/images.config.json, and writes src/assets/content/images.json, the
// manifest the <app-picture> component reads (dimensions, widths, blur placeholder).
//
// Usage: npm run images            (all images)
//        npm run images -- hero    (only ids containing "hero")
//
// Images are never upscaled: the output widths stop at the source width.
import sharp from 'sharp';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'image-sources');
const outDir = join(root, 'src/assets/images');
const manifestPath = join(root, 'src/assets/content/images.json');

const config = JSON.parse(await readFile(join(root, 'scripts/images.config.json'), 'utf8'));
const filter = process.argv[2];
await mkdir(outDir, { recursive: true });

let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch {
  /* first run */
}

for (const img of config.images) {
  if (filter && !img.id.includes(filter)) continue;
  const input = join(srcDir, img.file);
  try {
    await access(input);
  } catch {
    console.warn(`skip ${img.id}: ${img.file} not found in image-sources/`);
    continue;
  }

  let base = sharp(input).rotate();
  if (img.crop) base = base.extract(img.crop);
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  const cap = Math.min(meta.width, img.max ?? Infinity);
  const widths = [...new Set([...config.widths.filter((w) => w < cap), cap])].sort((a, b) => a - b);
  const height = Math.round((meta.height * cap) / meta.width);

  for (const w of widths) {
    const resized = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await resized
      .clone()
      .webp({ quality: 74, effort: 5 })
      .toFile(join(outDir, `${img.id}-${w}.webp`));
    await resized
      .clone()
      .avif({ quality: 52, effort: 5 })
      .toFile(join(outDir, `${img.id}-${w}.avif`));
  }
  // Single JPEG fallback for very old browsers and for Open Graph scrapers.
  const fallbackW = Math.min(cap, 1200);
  await sharp(buf)
    .resize({ width: fallbackW, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(join(outDir, `${img.id}-${fallbackW}.jpg`));

  const lqip = await sharp(buf).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[img.id] = {
    width: cap,
    height,
    widths,
    fallback: `${img.id}-${fallbackW}.jpg`,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(`✓ ${img.id} ${cap}×${height} [${widths.join(', ')}]`);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, JSON.stringify(sorted, null, 2) + '\n');

// Brand assets: logo, favicons, Open Graph card.
if (!filter || filter === 'brand') {
  const logo = join(srcDir, 'LOGO.png');
  await sharp(logo)
    .resize({ width: 240 })
    .webp({ quality: 90 })
    .toFile(join(outDir, 'logo-240.webp'));
  await sharp(logo)
    .resize({ width: 240 })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, 'logo-240.png'));
  const pub = join(root, 'public');
  const square = (s) =>
    sharp(logo).resize(s, s, { fit: 'contain', background: { r: 251, g: 248, b: 242, alpha: 1 } });
  await square(180).png().toFile(join(pub, 'apple-touch-icon.png'));
  await square(192).png().toFile(join(pub, 'icon-192.png'));
  await square(512).png().toFile(join(pub, 'icon-512.png'));
  await square(48).png().toFile(join(pub, 'favicon.png'));
  await sharp(join(srcDir, 'SIDE-SCHOOL-IMAGE.jpeg'))
    .rotate()
    .extract({ left: 0, top: 600, width: 4160, height: 2184 })
    .resize(1200, 630)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(pub, 'og-image.jpg'));
  console.log('✓ brand assets');
}
