import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentService } from '../../../core/services/content.service';
import type { NavItem } from '../../../core/models/content.models';
import { Icon } from '../icon/icon';
import { Picture } from '../picture/picture';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, Picture],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '(document:keydown.escape)': 'closeMega()',
  },
})
export class Header {
  protected readonly site = inject(ContentService).site;
  protected readonly nav = this.site.nav;
  protected readonly scrolled = signal(false);
  protected readonly openMega = signal<string | null>(null);
  protected readonly menuOpen = signal(false);
  private readonly path = signal('/');

  private readonly menu = viewChild.required<ElementRef<HTMLDialogElement>>('menu');
  private hoverTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.path.set(e.urlAfterRedirects.split(/[?#]/)[0]);
        this.openMega.set(null);
        this.closeMenu();
      });

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected toggleMega(label: string): void {
    this.openMega.update((open) => (open === label ? null : label));
  }

  protected hoverMega(label: string | null): void {
    clearTimeout(this.hoverTimer);
    // Small grace period so the panel doesn't flicker when the pointer crosses gaps.
    this.hoverTimer = setTimeout(() => this.openMega.set(label), label ? 80 : 220);
  }

  protected onMegaFocusOut(event: FocusEvent, host: HTMLElement): void {
    if (!host.contains(event.relatedTarget as Node | null)) this.openMega.set(null);
  }

  closeMega(): void {
    this.openMega.set(null);
  }

  protected openMenu(): void {
    this.menu().nativeElement.showModal();
    this.menuOpen.set(true);
    document.body.classList.add('no-scroll');
  }

  protected closeMenu(): void {
    const dlg = this.menu().nativeElement;
    if (dlg.open) dlg.close();
  }

  protected onMenuClosed(): void {
    this.menuOpen.set(false);
    document.body.classList.remove('no-scroll');
  }

  protected isActive(item: NavItem): boolean {
    const p = this.path();
    const paths = [item.path, ...(item.children ?? []).map((c) => c.path)];
    return paths.some((x) => x !== '/' && (p === x || p.startsWith(x + '/')));
  }

  protected trackNav = (item: NavItem) => item.label;
}
