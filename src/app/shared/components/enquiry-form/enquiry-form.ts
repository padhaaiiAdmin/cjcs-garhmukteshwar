import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { EnquiryService } from '../../../core/services/enquiry.service';
import { Icon } from '../icon/icon';

/** Normalises "+91 98765-43210", "098765 43210", "9876543210" → "9876543210". */
export function normaliseIndianMobile(value: string): string {
  let digits = (value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

/** Valid Indian mobile: 10 digits starting 6–9 (with or without +91 / 0 prefix). */
export function indianMobileValidator(control: AbstractControl<string>): ValidationErrors | null {
  if (!control.value) return null; // `required` handles empty
  return /^[6-9]\d{9}$/.test(normaliseIndianMobile(control.value)) ? null : { indianMobile: true };
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

let uid = 0;

@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './enquiry-form.html',
  styleUrl: './enquiry-form.scss',
})
export class EnquiryForm {
  readonly source = input<'admissions' | 'contact' | 'visit'>('contact');
  readonly submitLabel = input('Send enquiry');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(EnquiryService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  /** Without a form endpoint the form hands off to WhatsApp, so say so up front. */
  protected readonly demoMode = this.api.isDemo;
  protected readonly site = inject(ContentService).site;
  protected readonly classes = inject(ContentService).admissions.classes;
  protected readonly id = `enq-${++uid}`;

  protected readonly status = signal<Status>('idle');
  protected readonly demo = signal(false);
  protected readonly submittedName = signal('');
  protected readonly submittedPhone = signal('');

  protected readonly form = this.fb.group({
    parentName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        // \p{M} keeps Devanagari vowel signs (e.g. "राम शर्मा"); "/" and "()" allow "S/o …"
        Validators.pattern(/^[\p{L}\p{M} .'/()-]+$/u),
      ],
    ],
    phone: ['', [Validators.required, indianMobileValidator]],
    classApplying: ['', Validators.required],
    preferredTime: ['', Validators.maxLength(80)],
    message: ['', Validators.maxLength(1000)],
    company: [''], // honeypot: real people never see or fill this
  });

  protected whatsappLink(): string {
    const v = this.form.getRawValue();
    const name = this.submittedName() || v.parentName.trim();
    const forClass =
      v.classApplying && v.classApplying !== 'General enquiry' ? ` for ${v.classApplying}` : '';
    const lines =
      this.source() === 'visit'
        ? [
            `Campus visit request: I am ${name} and would like to visit the school${forClass}.`,
            v.preferredTime.trim() ? `Preferred day/time: ${v.preferredTime.trim()}.` : '',
          ]
        : [`Hello, I am ${name}. I have an enquiry${forClass}.`];
    if (v.message.trim()) lines.push(v.message.trim());
    const text = lines.filter(Boolean).join('\n');
    return `https://wa.me/${this.site.whatsapp.number}?text=${encodeURIComponent(text)}`;
  }

  protected buttonLabel(): string {
    return this.demoMode ? 'Continue on WhatsApp' : this.submitLabel();
  }

  protected show(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected error(name: 'parentName' | 'phone' | 'classApplying' | 'message'): string {
    const e = this.form.controls[name].errors ?? {};
    switch (name) {
      case 'parentName':
        if (e['required']) return 'Please tell us your name.';
        if (e['pattern']) return 'Names can use letters, spaces and . \' - / ( ) only.';
        return 'Please enter your full name.';
      case 'phone':
        if (e['required']) return 'We need a number to call you back.';
        return 'Enter a 10-digit Indian mobile number, e.g. 98765 43210.';
      case 'classApplying':
        return 'Please choose a class.';
      case 'message':
        return 'Please keep your message under 1,000 characters.';
    }
  }

  protected formatPhone(): void {
    const c = this.form.controls.phone;
    const digits = normaliseIndianMobile(c.value);
    if (/^[6-9]\d{9}$/.test(digits)) c.setValue(`${digits.slice(0, 5)} ${digits.slice(5)}`);
    c.markAsTouched();
  }

  protected submit(): void {
    if (this.status() === 'submitting') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('idle');
      const ids: Record<string, string> = {
        parentName: 'name',
        phone: 'phone',
        classApplying: 'class',
        message: 'msg',
      };
      const first = Object.keys(ids).find((k) => this.form.get(k)?.invalid);
      if (first)
        this.host.nativeElement.querySelector<HTMLElement>(`#${this.id}-${ids[first]}`)?.focus();
      return;
    }
    const v = this.form.getRawValue();
    if (v.company) {
      this.status.set('success'); // silently drop bots
      return;
    }
    this.status.set('submitting');
    this.api
      .submit({
        parentName: v.parentName.trim(),
        phone: normaliseIndianMobile(v.phone),
        classApplying: v.classApplying,
        message: [
          v.preferredTime.trim() ? `Preferred day/time: ${v.preferredTime.trim()}` : '',
          v.message.trim(),
        ]
          .filter(Boolean)
          .join('\n'),
        source: this.source(),
      })
      .subscribe({
        next: (res) => {
          this.demo.set(res.demo);
          this.submittedName.set(v.parentName.trim().split(' ')[0]);
          const d = normaliseIndianMobile(v.phone);
          this.submittedPhone.set(`+91 ${d.slice(0, 5)} ${d.slice(5)}`);
          this.status.set('success');
          // The success panel only exists after the next render (zoneless); focus it then.
          afterNextRender(
            () => this.host.nativeElement.querySelector<HTMLElement>('.success')?.focus(),
            { injector: this.injector },
          );
        },
        error: () => this.status.set('error'),
      });
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
