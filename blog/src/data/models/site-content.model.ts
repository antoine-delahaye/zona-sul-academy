import { SanityImage } from './post.model';

export interface PortableTextBlock {
  children?:
    | {
        text: string;
        _type: string;
        _key: string;
      }[]
    | null;
  _type: string;
  _key: string;
  style: string;
}

export interface ImageSection {
  __typename: 'ImageSection';
  _key: string;
  title: string;
  bodyRaw?: PortableTextBlock[] | null;
  image: SanityImage;
}

export interface VideoSection {
  __typename: 'VideoSection';
  _key: string;
  title: string;
  bodyRaw?: PortableTextBlock[] | null;
  videoId: string;
}

export interface MembershipSection {
  __typename: 'MembershipSection';
  _key: string;
  title: string;
  descriptionRaw?: PortableTextBlock[] | null;
  requirements: string[];
  price: number;
  priceInfo: string;
  additionalInfo: string;
  buttonUrl: string;
  buttonText: string;
}

export interface SiteContent {
  _id: string;
  title: string;
  slug: string;
  subtitleRaw?: PortableTextBlock[] | null;
  pageBuilder: (ImageSection | VideoSection | MembershipSection)[];
}
