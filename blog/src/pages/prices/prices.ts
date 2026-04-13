import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { SiteContentService } from '../../data/services/site-content.service';

@Component({
  selector: 'app-prices',
  imports: [CurrencyPipe],
  templateUrl: './prices.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Prices {
  private readonly siteContentService = inject(SiteContentService);

  private readonly allSiteContentResource = this.siteContentService.getAll();

  readonly content = computed(() =>
    this.allSiteContentResource.value()?.find((content) => content.slug === 'tarifs'),
  );
}
