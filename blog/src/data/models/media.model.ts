import { SanityImage } from './sanity-image.model';

/** A reusable image managed in the Studio and referenced by slug (logo, icons, planning…). */
export interface Media {
  _id: string;
  title: string;
  slug: string;
  image: SanityImage;
}
