const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeBase64(bytes: Uint8Array): string {
  let output = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index] ?? 0;
    const b = bytes[index + 1] ?? 0;
    const c = bytes[index + 2] ?? 0;

    const triple = (a << 16) | (b << 8) | c;

    output += BASE64_ALPHABET[(triple >> 18) & 0x3f];
    output += BASE64_ALPHABET[(triple >> 12) & 0x3f];
    output += index + 1 < bytes.length ? BASE64_ALPHABET[(triple >> 6) & 0x3f] : '=';
    output += index + 2 < bytes.length ? BASE64_ALPHABET[triple & 0x3f] : '=';
  }

  return output;
}

export function decodeBase64(value: string): Uint8Array {
  const sanitized = value.replace(/\s/g, '');

  if (sanitized.length % 4 !== 0) {
    throw new Error('Invalid base64 payload');
  }

  const padding = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;
  const outputLength = (sanitized.length / 4) * 3 - padding;
  const output = new Uint8Array(outputLength);

  let outputIndex = 0;

  for (let index = 0; index < sanitized.length; index += 4) {
    const chunk = sanitized.slice(index, index + 4);
    const encoded = [
      BASE64_ALPHABET.indexOf(chunk[0] ?? 'A'),
      BASE64_ALPHABET.indexOf(chunk[1] ?? 'A'),
      chunk[2] === '=' ? 0 : BASE64_ALPHABET.indexOf(chunk[2] ?? 'A'),
      chunk[3] === '=' ? 0 : BASE64_ALPHABET.indexOf(chunk[3] ?? 'A'),
    ];

    if (encoded.some((part, partIndex) => part < 0 && chunk[partIndex] !== '=')) {
      throw new Error('Invalid base64 payload');
    }

    const triple = (encoded[0] << 18) | (encoded[1] << 12) | (encoded[2] << 6) | encoded[3];

    if (outputIndex < outputLength) output[outputIndex++] = (triple >> 16) & 0xff;
    if (outputIndex < outputLength) output[outputIndex++] = (triple >> 8) & 0xff;
    if (outputIndex < outputLength) output[outputIndex++] = triple & 0xff;
  }

  return output;
}
