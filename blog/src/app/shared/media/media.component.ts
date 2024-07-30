import {Component, inject, Input, OnInit} from '@angular/core'

import {Media, MediaRepository} from '@repository/media.repository'
import {NgOptimizedImage} from '@angular/common'

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: 'media.component.html'
})
export class MediaComponent implements OnInit {
  private mediaRepository: MediaRepository = inject(MediaRepository)

  @Input()
  public slug?: string
  @Input()
  public class: string = ''

  protected media?: Media

  public ngOnInit(): void {
    if (this.slug) {
      this.mediaRepository
        .media$(this.slug)
        .subscribe((media: Media | undefined): void => {
          this.media = media
        })
    }
  }
}
