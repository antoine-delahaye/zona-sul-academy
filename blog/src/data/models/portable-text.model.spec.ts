import { PortableTextBlock, portableTextBlockToPlainText } from './portable-text.model';

function block(...texts: string[]): PortableTextBlock {
  return {
    _key: 'block',
    _type: 'block',
    style: 'normal',
    children: texts.map((text, index) => ({ _key: `span-${index}`, _type: 'span', text })),
  };
}

describe('portableTextBlockToPlainText', () => {
  it('joins every span of a block', () => {
    // Sanity splits a formatted paragraph into one span per run, so reading only
    // the first child silently truncates the sentence.
    const paragraph = block('Nous avons notre ', 'dojo', ' !');

    expect(portableTextBlockToPlainText(paragraph)).toBe('Nous avons notre dojo !');
  });

  it('returns a single span unchanged', () => {
    expect(portableTextBlockToPlainText(block('Bienvenue'))).toBe('Bienvenue');
  });

  it('returns an empty string for missing or empty blocks', () => {
    expect(portableTextBlockToPlainText(undefined)).toBe('');
    expect(portableTextBlockToPlainText(null)).toBe('');
    expect(portableTextBlockToPlainText({ _key: 'k', _type: 'block', children: null })).toBe('');
    expect(portableTextBlockToPlainText(block())).toBe('');
  });
});
