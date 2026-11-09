const KURDISH_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** 2026 → ٢٠٢٦ */
export function toKurdishDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => KURDISH_DIGITS[Number(d)])
}

/** Zero-padded Kurdish number, e.g. 7 → ٠٧ */
export function padKurdish(value: number, length = 2): string {
  return toKurdishDigits(String(value).padStart(length, '0'))
}
