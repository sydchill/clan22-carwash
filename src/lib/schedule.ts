import type { DayHours } from '../types'
import { formatTime, fromDateKey, toDateKey } from './format'

/**
 * Trading hours, keyed by JS weekday (0 = Sunday). These mirror the hours
 * published on the contact panel.
 */
const HOURS: Record<number, DayHours> = {
  0: { open: 7 * 60, close: 14 * 60 }, // Sunday
  1: { open: 7 * 60, close: 17 * 60 },
  2: { open: 7 * 60, close: 17 * 60 },
  3: { open: 7 * 60, close: 17 * 60 },
  4: { open: 7 * 60, close: 17 * 60 },
  5: { open: 7 * 60, close: 17 * 60 },
  6: { open: 7 * 60, close: 14 * 60 }, // Saturday
}

/** How far ahead bookings can be made. */
export const BOOKING_WINDOW_DAYS = 30

/** Slot granularity. */
const SLOT_STEP_MINUTES = 30

/** Shortest notice accepted for a same-day booking. */
const LEAD_TIME_MINUTES = 60

/** The sentinel time value meaning "whenever you can fit me in". */
export const EARLIEST_SLOT = 'earliest'

export function hoursForDateKey(key: string): DayHours {
  return HOURS[fromDateKey(key).getDay()] ?? { open: 7 * 60, close: 14 * 60 }
}

/** First and last selectable dates, as "YYYY-MM-DD". */
export function bookingDateRange(now = new Date()): { min: string; max: string } {
  const max = new Date(now)
  max.setDate(max.getDate() + BOOKING_WINDOW_DAYS)
  return { min: toDateKey(now), max: toDateKey(max) }
}

/**
 * Bookable start times for a date, as "HH:MM". A slot only appears if the wash
 * can finish before closing time, and same-day slots need an hour's notice.
 */
export function slotsForDate(key: string, durationMinutes: number, now = new Date()): string[] {
  const { open, close } = hoursForDateKey(key)
  const latestStart = close - durationMinutes
  if (latestStart < open) return []

  let earliestStart = open
  if (key === toDateKey(now)) {
    const cutoff = now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINUTES
    earliestStart = Math.max(open, Math.ceil(cutoff / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES)
  }

  const slots: string[] = []
  for (let t = earliestStart; t <= latestStart; t += SLOT_STEP_MINUTES) {
    slots.push(formatTime(t))
  }
  return slots
}

/**
 * The next date that can still fit the wash, so the form never opens on a day
 * with nothing available (late afternoon, or a long wash on a short Sunday).
 */
export function firstBookableDate(durationMinutes: number, now = new Date()): string {
  const cursor = new Date(now)
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i += 1) {
    const key = toDateKey(cursor)
    if (slotsForDate(key, durationMinutes, now).length > 0) return key
    cursor.setDate(cursor.getDate() + 1)
  }
  return toDateKey(now)
}

/** Human summary of a day's hours, e.g. "Open 07:00 – 17:00". */
export function hoursLabel(key: string): string {
  const { open, close } = hoursForDateKey(key)
  return `Open ${formatTime(open)} – ${formatTime(close)}`
}
