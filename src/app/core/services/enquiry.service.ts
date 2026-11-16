import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Enquiry {
  parentName: string;
  phone: string;
  classApplying: string;
  message: string;
  source: 'admissions' | 'contact' | 'visit';
}

export interface EnquiryResult {
  ok: boolean;
  /** true when no endpoint is configured yet (see environment.ts) */
  demo: boolean;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly http = inject(HttpClient);

  submit(enquiry: Enquiry): Observable<EnquiryResult> {
    const endpoint = environment.enquiryEndpoint;
    if (!endpoint) {
      return of({ ok: true, demo: true }).pipe(delay(500));
    }
    return this.http
      .post(endpoint, {
        ...enquiry,
        phone: `+91${enquiry.phone}`,
        submittedAt: new Date().toISOString(),
      })
      .pipe(map(() => ({ ok: true, demo: false })));
  }
}
