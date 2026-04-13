export interface SanityImage {
  asset: {
    altText: string;
    path: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
}

export interface PostPreview {
  title: string;
  _createdAt: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImage;
}

export interface PostSingle {
  title: string;
  _createdAt: string;
  mainImage: SanityImage;
  bodyRaw: {
    children: {
      text: string;
      _type: string;
      _key: string;
    }[];
    _type: string;
    _key: string;
    style: string;
  }[];
}

export interface FeaturedPost {
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImage;
  featuredButtons: {
    text: string;
    url: string;
    openInNewTab: boolean;
  }[];
}
