import { Component, inject } from '@angular/core';

import { Media } from '../../shared/media/media';
import { SiteContentService } from '../../data/services/site-content.service';

@Component({
  selector: 'app-planning',
  imports: [Media],
  templateUrl: './planning.html',
  host: {
    class: 'flex h-full flex-col pb-8 lg:p-16 lg:px-32',
  },
})
export class Planning {
  private readonly siteContentService = inject(SiteContentService);

  readonly content = this.siteContentService.bySlug('planning');
}
