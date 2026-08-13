import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  imports: [DatePipe],
  templateUrl: './privacy-policy.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class PrivacyPolicy {
  /** Bump whenever the policy text below changes. */
  readonly lastUpdated = new Date('2026-08-13');

  readonly contactEmail = 'contact@zonasulacademy.fr';
}
