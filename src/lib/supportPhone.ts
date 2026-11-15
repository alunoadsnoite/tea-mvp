/** Accept formatted phone numbers while keeping URI delimiters out of the destination. */
export function supportPhone(value: string): string | null {
  const number = value.replace(/[ ().-]/g, "");
  return /^\+?[0-9]+$/.test(number) ? number : null;
}
