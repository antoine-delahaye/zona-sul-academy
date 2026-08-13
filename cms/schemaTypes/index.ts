import type { SchemaTypeDefinition } from 'sanity';

import blockContent from './blockContent';
import dayName from './dayName';
import duration from './duration';
import featuredButton from './featuredButton';
import imageSection from './imageSection';
import media from './media';
import membershipSection from './membershipSection';
import planningEvent from './planningEvent';
import post from './post';
import siteContent from './siteContent';
import timeValue from './timeValue';
import videoSection from './videoSection';

/** Documents editors create directly. */
const documents = [post, planningEvent, media, siteContent];

/** Objects reused inside documents. */
const objects = [
  blockContent,
  featuredButton,
  duration,
  timeValue,
  dayName,
  imageSection,
  videoSection,
  membershipSection,
];

export const schemaTypes: SchemaTypeDefinition[] = [...documents, ...objects];
