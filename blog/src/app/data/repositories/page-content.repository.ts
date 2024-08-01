import {Injectable} from '@angular/core'
import {createStore} from '@ngneat/elf'
import {
  getEntity,
  selectEntity,
  setEntities,
  withEntities
} from '@ngneat/elf-entities'

export type PageContent = {
  _id: string
  title: string
  slug: string
  bodyRaw: {
    children: {
      text: string
      _type: string
      _key: string
    }[]
    _type: string
    _key: string
    style: string
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class PageContentRepository {
  public store = createStore(
    {name: 'pageContents'},
    withEntities<PageContent, 'slug'>({
      idKey: 'slug'
    })
  )

  public pageContent$ = (slug: string) => this.store.pipe(selectEntity(slug))

  public get(slug: string): PageContent | undefined {
    return this.store.query(getEntity(slug))
  }

  public set(pageContents: PageContent[]): void {
    this.store.update(setEntities(pageContents))
  }
}
