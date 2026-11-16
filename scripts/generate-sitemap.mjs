// Writes public/sitemap.xml from the site's routes + news items. Runs before every build.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(await readFile(join(root, 'src/assets/content/site.json'), 'utf8'));
const news = JSON.parse(await readFile(join(root, 'src/assets/content/news.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const pages = [
  ['/', '1.0', 'weekly'],
  ['/admissions', '0.9', 'weekly'],
  ['/about', '0.8', 'monthly'],
  ['/academics', '0.8', 'monthly'],
  ['/facilities', '0.7', 'monthly'],
  ['/gallery', '0.6', 'monthly'],
  ['/news', '0.7', 'weekly'],
  ['/downloads', '0.6', 'weekly'],
  ['/contact', '0.8', 'yearly'],
  ...news.items.map((n) => [`/news/${n.id}`, '0.5', 'yearly', n.date]),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ([path, priority, freq, lastmod]) => `  <url>
    <loc>${site.url}${path === '/' ? '/' : path}</loc>
    <lastmod>${lastmod ?? today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${pages.length} URLs`);
