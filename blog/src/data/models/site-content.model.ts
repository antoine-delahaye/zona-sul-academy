import { PortableTextBlock } from './portable-text.model';
import { SanityImage } from './sanity-image.model';

/**
 * Page builder sections, discriminated by Sanity's own `_type`.
 *
 * Narrowing on `_type` in a template (`@if (section._type === 'imageSection')`)
 * gives the compiler a fully typed section, so no `$any()` cast is needed.
 */
export interface ImageSection {
  _type: 'imageSection';
  _key: string;
  title: string;
  body?: PortableTextBlock[] | null;
  image: SanityImage;
}

export interface VideoSection {
  _type: 'videoSection';
  _key: string;
  title: string;
  body?: PortableTextBlock[] | null;
  videoId: string | null;
}

export interface MembershipSection {
  _type: 'membershipSection';
  _key: string;
  title: string;
  description?: PortableTextBlock[] | null;
  requirements?: string[] | null;
  price: number | null;
  priceInfo: string | null;
  additionalInfo: string | null;
  buttonUrl: string | null;
  buttonText: string | null;
}

export type PageSection = ImageSection | VideoSection | MembershipSection;

/** A Studio-managed page, addressed by slug (`presentation`, `tarifs`, `planning`…). */
export interface SiteContent {
  _id: string;
  title: string;
  slug: string;
  subtitle?: PortableTextBlock[] | null;
  pageBuilder?: PageSection[] | null;
}
