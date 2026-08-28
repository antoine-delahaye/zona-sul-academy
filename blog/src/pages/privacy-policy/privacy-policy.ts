import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CONTACT_EMAIL } from '../../shared/contact/contact.model';

@Component({
  selector: 'app-privacy-policy',
  imports: [DatePipe, RouterLink],
  templateUrl: './privacy-policy.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class PrivacyPolicy {
  /** Bump whenever the policy text below changes. */
  readonly lastUpdated = new Date('2026-08-28');

  readonly contactEmail = CONTACT_EMAIL;
}
