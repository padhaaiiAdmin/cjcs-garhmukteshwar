import { RenderMode, ServerRoute } from '@angular/ssr';
import news from '../assets/content/news.json';

/** Static site generation: every route is prerendered to HTML at build time. */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'news/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => news.items.map((n) => ({ id: n.id })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
