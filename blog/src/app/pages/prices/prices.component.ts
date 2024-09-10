import {Component, inject, OnInit} from '@angular/core'
import {CurrencyPipe, NgClass} from '@angular/common'

import {
  MembershipSection,
  SiteContent,
  SiteContentRepository
} from '@repository/site-content.repository'
import {SkeletonComponent} from '@shared/skeleton/skeleton.component'

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [SkeletonComponent, CurrencyPipe, NgClass],
  templateUrl: 'prices.component.html'
})
export class PricesComponent implements OnInit {
  private siteContentRepository: SiteContentRepository = inject(
    SiteContentRepository
  )

  protected content?: SiteContent & {pageBuilder: MembershipSection[]}

  public ngOnInit(): void {
    this.siteContentRepository
      .siteContent$('tarifs')
      .subscribe((content: SiteContent | undefined): void => {
        this.content = content as
          | (SiteContent & {pageBuilder: MembershipSection[]})
          | undefined
      })
  }
}
