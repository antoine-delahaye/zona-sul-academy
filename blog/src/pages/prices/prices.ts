import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { BlockTextPipe } from '../../shared/pipes/block-text';
import { MembershipSection } from '../../data/models/site-content.model';
import { SiteContentService } from '../../data/services/site-content.service';

@Component({
  selector: 'app-prices',
  imports: [CurrencyPipe, BlockTextPipe],
  templateUrl: './prices.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class Prices {
  private readonly siteContentService = inject(SiteContentService);

  readonly content = this.siteContentService.bySlug('tarifs');

  /** The pricing page is built exclusively from membership sections. */
  readonly memberships = computed<MembershipSection[]>(
    () =>
      this.content()?.pageBuilder?.filter(
        (section): section is MembershipSection => section._type === 'membershipSection',
      ) ?? [],
  );
}
