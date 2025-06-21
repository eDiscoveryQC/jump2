const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateShortCode(length = 6): string {
  let result = '';
  const max = ALPHABET.length;
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * max)];
  }
  return result;
}
