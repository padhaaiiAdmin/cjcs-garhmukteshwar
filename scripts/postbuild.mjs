// After prerendering: expose the 404 page at /404.html (Netlify, Firebase,
// GitHub Pages and Vercel all serve this file for unknown URLs).
import { copyFile, access } from 'node:fs/promises';
const dist = 'dist/cjcs-garhmukteshwar/browser';
try {
  await access(`${dist}/404/index.html`);
  await copyFile(`${dist}/404/index.html`, `${dist}/404.html`);
  console.log('404.html written');
} catch {
  console.warn('404 page not found in build output');
}
