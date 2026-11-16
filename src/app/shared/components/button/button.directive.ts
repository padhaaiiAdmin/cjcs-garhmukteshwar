import { Directive, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'ghost-light';

/**
 * Applies the design-system button styles to an <a> or <button>.
 *   <a appButton routerLink="/admissions">Apply</a>
 *   <button appButton variant="ghost" size="sm">More</button>
 */
@Directive({
  selector: '[appButton]',
  host: { '[class]': 'classes()' },
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<'md' | 'sm'>('md');
  protected readonly classes = computed(() =>
    [
      'btn',
      this.variant() !== 'primary' ? `btn--${this.variant()}` : '',
      this.size() === 'sm' ? 'btn--sm' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
