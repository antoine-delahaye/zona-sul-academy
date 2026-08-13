import { Pipe, PipeTransform } from '@angular/core';

import {
  PortableTextBlock,
  portableTextBlockToPlainText,
} from '../../data/models/portable-text.model';

/**
 * Renders a Portable Text block as plain text.
 *
 * Sanity splits a block into one span per formatting run, so a paragraph
 * containing bold or italic text arrives as several children. Reading only
 * `children[0].text` drops everything after the first run.
 */
@Pipe({ name: 'blockText' })
export class BlockTextPipe implements PipeTransform {
  transform(block: PortableTextBlock | null | undefined): string {
    return portableTextBlockToPlainText(block);
  }
}
