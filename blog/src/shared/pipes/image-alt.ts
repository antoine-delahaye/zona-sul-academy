import { Pipe, PipeTransform } from '@angular/core';

import { SanityImage, sanityImageAlt } from '../../data/models/sanity-image.model';

/**
 * Resolves the alternative text of a Sanity image, with a fallback label.
 *
 * Editors fill in the image's own `alt` field; the asset-level `altText` is
 * almost always empty, so binding it directly leaves images unlabelled.
 */
@Pipe({ name: 'imageAlt' })
export class ImageAltPipe implements PipeTransform {
  transform(image: SanityImage | null | undefined, fallback = ''): string {
    return sanityImageAlt(image, fallback);
  }
}
