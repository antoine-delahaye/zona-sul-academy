import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { SiteContentService } from '../../data/services/site-content.service';
import { Media } from '../../shared/media/media';

@Component({
  selector: 'app-planning',
  imports: [Media],
  templateUrl: './planning.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex h-full flex-col pb-8 lg:p-16 lg:px-32',
  },
})
export class Planning {
  private readonly siteContentService = inject(SiteContentService);

  private readonly allSiteContentResource = this.siteContentService.getAll();

  readonly planningContent = computed(() =>
    this.allSiteContentResource.value()?.find((content) => content.slug === 'planning'),
  );
}
