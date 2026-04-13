import { SanityImage } from './post.model';

export interface Media {
  _id: string;
  title: string;
  slug: string;
  image: SanityImage;
}
