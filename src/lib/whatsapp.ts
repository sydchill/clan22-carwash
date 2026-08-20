/** Default South African country code, used when a number starts with 0. */
const SA_DIALLING_CODE = '27'

/**
 * Normalise a typed number to bare international digits.
 * "073 242 3298" and "+27732423298" both become "27732423298".
 */
export function toInternational(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits.slice(1)
  if (digits.startsWith('0')) return SA_DIALLING_CODE + digits.slice(1)
  return digits
}

/**
 * Render an international number back in the local grouping South Africans
 * read at a glance ("073 242 3298"). Anything that is not a recognisable SA
 * mobile number falls back to the digits as typed.
 */
export function toLocalDisplay(raw: string, intl = toInternational(raw)): string {
  const isSaMobile = intl.startsWith(SA_DIALLING_CODE) && intl.length === 11
  if (!isSaMobile) return raw.replace(/[^\d+]/g, '')
  return `0${intl.slice(2, 4)} ${intl.slice(4, 7)} ${intl.slice(7)}`
}

/**
 * Is this a number the owner can actually call back? Accepts local and
 * international forms of an SA mobile (06x, 07x, 08x) — deliberately permissive
 * about spacing and the leading +.
 */
export function isValidSaMobile(raw: string): boolean {
  return /^27[678]\d{8}$/.test(toInternational(raw))
}

/** Build a wa.me deep link that opens a chat with the message prefilled. */
export function buildWhatsAppLink(intl: string, message: string): string {
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`
}
