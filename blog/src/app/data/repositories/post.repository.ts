import {Injectable} from '@angular/core'
import {createStore, withProps} from '@ngneat/elf'
import {getAllEntities, setEntities, withEntities} from '@ngneat/elf-entities'
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

export type FeaturedPost = {
  title: string
  slug: string
  excerpt: string
  mainImage: {
    asset: {
      altText: string
      path: string
      metadata: {dimensions: {width: number; height: number}}
    }
  }
  featuredButtons: {
    text: string
    url: string
    openInNewTab: boolean
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

  public postPreviews$ = this.postPreviewStore.pipe(selectCurrentPageEntities())

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

  public postSingleStore = createStore(
    {name: 'postSingle'},
    withProps<PostSingle>({
      _createdAt: '',
      bodyRaw: [],
      mainImage: {
        asset: {
          altText: '',
          metadata: {dimensions: {height: 0, width: 0}},
          path: ''
        }
      },
      title: ''
    })
  )

  public setPostSingle(post: PostSingle): void {
    this.postSingleStore.update((state: PostSingle) => ({
      ...state,
      ...post
    }))
  }

  public featuredPostStore = createStore(
    {name: 'featuredPosts'},
    withEntities<FeaturedPost, 'slug'>({
      idKey: 'slug'
    })
  )

  public getFeaturedPosts(): FeaturedPost[] {
    return this.featuredPostStore.query(getAllEntities())
  }

  public setFeaturedPosts(posts: FeaturedPost[]): void {
    this.featuredPostStore.update(setEntities(posts))
  }
}
