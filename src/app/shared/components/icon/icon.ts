import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Fine-line 24px icons (1.5 stroke), drawn to match the editorial type. */
const PATHS: Record<string, string> = {
  phone:
    'M5 4h3l1.5 4.5-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2L20 16v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  mail: 'M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
  arrow: 'M4 12h15m-5.5-6 6 6-6 6',
  external: 'M14 4h6v6m0-6-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M3.5 7h17M3.5 12h17M3.5 17h11',
  chevron: 'm6 9 6 6 6-6',
  left: 'm15 5-7 7 7 7',
  right: 'm9 5 7 7-7 7',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  file: 'M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Zm0 0v4h4M9 13h6M9 16.5h4',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  calendar: 'M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8.5a7 7 0 0 1 14 0',
  lock: 'M6.5 11h11v9h-11zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  facebook:
    'M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6.5H14V14h2.5l.5-3.5h-3V8.5c0-.3.2-.5.5-.5Z',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 7h.01',
  x: 'M4.5 4h4l11 16h-4zM19.5 4l-6.2 7.2M4.5 20l6.3-7.2',
  pinterest:
    'M12 3.5a8.5 8.5 0 0 0-3.1 16.4c0-.8 0-1.7.2-2.5l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2-1.4-3.6-3.9-3.6-2.9 0-4.6 2.1-4.6 4.5 0 .8.2 1.4.6 1.9',
  youtube:
    'M3.5 8.5c0-1.7 1.3-3 3-3h11c1.7 0 3 1.3 3 3v7c0 1.7-1.3 3-3 3h-11a3 3 0 0 1-3-3zM10 9.2v5.6l4.8-2.8z',
  whatsapp:
    'M4 20l1.2-4.1A8 8 0 1 1 8.4 19L4 20Zm5.1-12.3c-.3 0-.7.1-.9.5-.3.5-.7 1.3-.4 2.4.5 1.6 2.4 4 5 5 1.2.4 2 .2 2.5-.2.3-.3.5-.8.5-1.2l-1.8-1-1 .9c-1-.4-2.1-1.4-2.6-2.5l.8-1-.9-1.9-1.2-.1Z',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    [class]="name()"
  >
    <path [attr.d]="d()" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  readonly name = input.required<string>();
  protected readonly d = computed(() => PATHS[this.name()] ?? '');
}
