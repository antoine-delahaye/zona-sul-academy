import {Injectable} from '@angular/core'
import {createStore, select, withProps} from '@ngneat/elf'
import {getEntity, setEntities, withEntities} from '@ngneat/elf-entities'
import {
  PaginationData,
  selectCurrentPageEntities,
  setPage,
  updatePaginationData,
  withPagination
} from '@ngneat/elf-pagination'

export type PostPreview = {
  title: string
  _createdAt: string
  slug: string
  excerpt: string
  mainImage: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
}

export type PostSingle = {
  title: string
  _createdAt: string
  mainImage: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
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
export class PostRepository {
  public postPreviewStore = createStore(
    {name: 'postPreviews'},
    withEntities<PostPreview, 'slug'>({
      idKey: 'slug'
    }),
    withPagination()
  )

  public getPostPreview(slug: string): PostPreview | undefined {
    return this.postPreviewStore.query(getEntity(slug))
  }

  public setPostPreviews(
    response: PaginationData & {data: PostPreview[]}
  ): void {
    const {data, ...paginationData} = response

    this.postPreviewStore.update(
      setEntities(data),
      updatePaginationData(paginationData),
      setPage(
        paginationData.currentPage,
        data.map(({slug}) => slug)
      )
    )
  }

  public postPreviews$ = this.postPreviewStore.pipe(selectCurrentPageEntities())

  public postSingleStore = createStore(
    {name: 'postSingle'},
    withProps<PostSingle | undefined>(undefined)
  )

  public setPostSingle(post: PostSingle): void {
    this.postSingleStore.update(() => post)
  }
}
