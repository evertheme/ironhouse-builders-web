export const US_PHONE_MAX_DIGITS = 10;

export function usPhoneDigitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, US_PHONE_MAX_DIGITS);
}

/** Formats up to 10 digits as (999) 999-9999 */
export function formatUsPhoneMask(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Strips non-digits, caps at 10, returns masked string or null if empty.
 * Use before persisting so DB always stores (999) 999-9999 style when present.
 */
export function normalizeUsPhoneForStorage(
  input: string | null | undefined,
): string | null {
  if (input == null || !String(input).trim()) {
    return null;
  }
  const digits = usPhoneDigitsOnly(String(input));
  if (digits.length === 0) {
    return null;
  }
  return formatUsPhoneMask(digits);
}

/** `tel:` URI for US 10-digit numbers uses +1 country code. */
export function usPhoneTelHref(maskedOrDigits: string): string | null {
  const d = maskedOrDigits.replace(/\D/g, "");
  if (d.length === 0) {
    return null;
  }
  if (d.length === 10) {
    return `tel:+1${d}`;
  }
  if (d.length === 11 && d.startsWith("1")) {
    return `tel:+${d}`;
  }
  return `tel:+${d}`;
}
