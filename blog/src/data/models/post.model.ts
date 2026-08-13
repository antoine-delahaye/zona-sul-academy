import { PortableTextBlock } from './portable-text.model';
import { SanityImage } from './sanity-image.model';

export interface FeaturedButton {
  text: string;
  url: string;
  openInNewTab: boolean;
}

/** Shape shared by every post projection. */
interface PostBase {
  title: string;
  slug: string;
  mainImage: SanityImage;
}

/** Card representation used by the news listing. */
export interface PostPreview extends PostBase {
  _createdAt: string;
  excerpt: string;
}

/** Full article, as rendered on `/actualites/:slug`. */
export interface PostSingle extends PostBase {
  _createdAt: string;
  body?: PortableTextBlock[] | null;
}

/** Post promoted to the hero section of the home page. */
export interface FeaturedPost extends PostBase {
  excerpt: string;
  featuredButtons?: FeaturedButton[] | null;
}
