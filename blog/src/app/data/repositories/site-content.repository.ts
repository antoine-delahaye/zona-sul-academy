import {Injectable} from '@angular/core'
import {createStore} from '@ngneat/elf'
import {selectEntity, setEntities, withEntities} from '@ngneat/elf-entities'

export type ImageSection = {
  __typename: 'ImageSection'
  _key: string
  title: string
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
  image: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
}

export type VideoSection = {
  __typename: 'VideoSection'
  _key: string
  title: string
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
  url: string
}

export type MembershipSection = {
  __typename: 'MembershipSection'
  _key: string
  title: string
  descriptionRaw: {
    children: {
      text: string
      _type: string
      _key: string
    }[]
    _type: string
    _key: string
    style: string
  }[]
  requirements: string[]
  price: number
  url: string
}

export type SiteContent = {
  _id: string
  title: string
  slug: string
  subtitleRaw: {
    children: {
      text: string
      _type: string
      _key: string
    }[]
    _type: string
    _key: string
    style: string
  }[]
  pageBuilder: (ImageSection | VideoSection | MembershipSection)[]
}

@Injectable({
  providedIn: 'root'
})
export class SiteContentRepository {
  public store = createStore(
    {name: 'siteContents'},
    withEntities<SiteContent, 'slug'>({
      idKey: 'slug'
    })
  )

  public siteContent$ = (slug: string) => this.store.pipe(selectEntity(slug))

  public set(siteContents: SiteContent[]): void {
    this.store.update(setEntities(siteContents))
  }
}
