/** "R200". Whole rands only — nothing here is priced in cents. */
export function formatRand(amount: number): string {
  return `R${Math.round(amount)}`
}

/** "+R50", used for surcharges and add-ons. */
export function formatRandDelta(amount: number): string {
  return `+${formatRand(amount)}`
}

/** "About 45 min", "About 1 hr 30", "About 2 hrs". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `About ${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  const hourLabel = hours === 1 ? 'hr' : 'hrs'
  return rest === 0 ? `About ${hours} ${hourLabel}` : `About ${hours} hr ${rest}`
}

/** "07:00" from minutes past midnight. */
export function formatTime(minutesFromMidnight: number): string {
  const h = Math.floor(minutesFromMidnight / 60)
  const m = minutesFromMidnight % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Local calendar date as "YYYY-MM-DD" — never UTC, which can shift the day. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse a "YYYY-MM-DD" key back into a local-midnight Date. */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * "Thu 21 Aug". Assembled by hand rather than through toLocaleDateString so the
 * shape stays identical whatever locale the customer's phone is set to.
 */
export function formatCalendarDate(key: string): string {
  const date = fromDateKey(key)
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/** Whole days from today to the given date; negative for the past. */
function dayGap(key: string, today: Date): number {
  return Math.round(
    (fromDateKey(key).getTime() - fromDateKey(toDateKey(today)).getTime()) / 86_400_000,
  )
}

/** "Today", "Tomorrow", or "Thu 21 Aug" — the short form used on chips. */
export function formatDateKey(key: string, today = new Date()): string {
  const gap = dayGap(key, today)
  if (gap === 0) return 'Today'
  if (gap === 1) return 'Tomorrow'
  return formatCalendarDate(key)
}

/** "Tomorrow (Thu 21 Aug)" — the unambiguous form used in the WhatsApp message. */
export function formatDateKeyLong(key: string, today = new Date()): string {
  const gap = dayGap(key, today)
  const full = formatCalendarDate(key)
  if (gap === 0) return `Today (${full})`
  if (gap === 1) return `Tomorrow (${full})`
  return full
}
