import {
  CONTACT_MAX_LENGTHS,
  CONTACT_MIN_MESSAGE_LENGTH,
  ContactMessage,
  normaliseContactMessage,
  validateContactMessage,
} from './contact.model';

function submission(overrides: Partial<ContactMessage> = {}): ContactMessage {
  return {
    name: 'Ana Pereira',
    email: 'ana@example.com',
    phone: '06 50 00 95 93',
    subject: "Cours d'essai",
    message: 'Bonjour, je souhaite essayer un cours de grappling le mardi soir.',
    ...overrides,
  };
}

describe('validateContactMessage', () => {
  it('accepts a complete submission', () => {
    expect(validateContactMessage(submission())).toEqual({});
  });

  it('accepts a submission without a phone number, which is optional', () => {
    expect(validateContactMessage(submission({ phone: '   ' }))).toEqual({});
  });

  it('reports every missing required field at once', () => {
    const errors = validateContactMessage(
      submission({ name: '', email: '', subject: '', message: '' }),
    );

    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });

  it('rejects a field that is only whitespace', () => {
    // Normalisation runs first, so spaces cannot stand in for a name.
    expect(validateContactMessage(submission({ name: '   ' })).name).toBeDefined();
  });

  it('rejects an address without a domain', () => {
    expect(validateContactMessage(submission({ email: 'ana@example' })).email).toBeDefined();
  });

  it('rejects a phone number made of letters', () => {
    expect(validateContactMessage(submission({ phone: 'rappelez-moi' })).phone).toBeDefined();
  });

  it('rejects a message shorter than the minimum', () => {
    const message = 'a'.repeat(CONTACT_MIN_MESSAGE_LENGTH - 1);

    expect(validateContactMessage(submission({ message })).message).toBeDefined();
  });

  it('rejects a message longer than the maximum', () => {
    const message = 'a'.repeat(CONTACT_MAX_LENGTHS.message + 1);

    expect(validateContactMessage(submission({ message })).message).toBeDefined();
  });

  it('does not count trailing whitespace towards a length limit', () => {
    const message = `${'a'.repeat(CONTACT_MAX_LENGTHS.message)}\n\n   `;

    expect(validateContactMessage(submission({ message }))).toEqual({});
  });
});

describe('normaliseContactMessage', () => {
  it('collapses whitespace in single-line fields', () => {
    const { name } = normaliseContactMessage(submission({ name: '  Ana   Pereira  ' }));

    expect(name).toBe('Ana Pereira');
  });

  it('strips newlines from single-line fields', () => {
    // Left in, these would let a visitor append headers of their own to the mail.
    const { subject } = normaliseContactMessage(
      submission({ subject: 'Essai\r\nBcc: victime@example.com' }),
    );

    expect(subject).toBe('Essai Bcc: victime@example.com');
  });

  it('keeps the paragraphs of the message body', () => {
    const { message } = normaliseContactMessage(
      submission({ message: 'Bonjour,\r\n\r\nMerci beaucoup.' }),
    );

    expect(message).toBe('Bonjour,\n\nMerci beaucoup.');
  });

  it('drops control characters from the message body', () => {
    const { message } = normaliseContactMessage(submission({ message: 'Bon\u0000jour\u0007' }));

    expect(message).toBe('Bonjour');
  });
});
