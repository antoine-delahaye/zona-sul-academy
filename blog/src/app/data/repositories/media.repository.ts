import {Injectable} from '@angular/core'
import {createStore} from '@ngneat/elf'
import {selectEntity, setEntities, withEntities} from '@ngneat/elf-entities'

export type Media = {
  _id: string
  title: string
  slug: string
  image: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class MediaRepository {
  public store = createStore(
    {name: 'medias'},
    withEntities<Media, 'slug'>({
      idKey: 'slug'
    })
  )

  public media$ = (slug: string) => this.store.pipe(selectEntity(slug))

  public set(medias: Media[]): void {
    this.store.update(setEntities(medias))
  }
}
