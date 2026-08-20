import type { AddOn, Service, VehicleType } from '../types'
import type { Quote } from './quote'
import { OTHER_AREA } from '../content'
import { formatDateKeyLong, formatDuration, formatRand } from './format'
import { EARLIEST_SLOT } from './schedule'
import { toLocalDisplay } from './whatsapp'

export interface BookingMessageOptions {
  /**
   * 'whatsapp' wraps labels in asterisks, which WhatsApp renders as bold.
   * 'plain' leaves them alone — in an email those asterisks are just litter.
   */
  markup?: 'whatsapp' | 'plain'
  /** First line. Defaults to the customer's own greeting. */
  heading?: string
}

export interface BookingMessageInput {
  service: Service | undefined
  vehicle: VehicleType | undefined
  addOns: AddOn[]
  vehicleDetail: string
  dateKey: string
  time: string
  name: string
  phone: string
  suburb: string
  street: string
  notes: string
  quote: Quote
}

/**
 * Compose the WhatsApp message. It is the only thing that leaves the browser,
 * so it has to be complete enough for the owner to act on without a follow-up:
 * what, which car, when, where, who, and what it comes to.
 *
 * `*asterisks*` render as bold inside WhatsApp.
 */
export function composeBookingMessage(
  input: BookingMessageInput,
  options: BookingMessageOptions = {},
): string {
  const { markup = 'whatsapp', heading = 'Hi Clan22 Carwash! I would like to book a wash.' } =
    options
  const label = (text: string) => (markup === 'whatsapp' ? `*${text}:*` : `${text}:`)

  const lines: string[] = [heading, '']

  if (input.service) {
    lines.push(`${label('Wash')} ${input.service.name} — ${formatRand(input.service.price)}`)
  }

  if (input.addOns.length > 0) {
    const extras = input.addOns
      .map((addOn) => `${addOn.label} (${formatRand(addOn.price)})`)
      .join(', ')
    lines.push(`${label('Extras')} ${extras}`)
  }

  if (input.vehicle) {
    const surcharge = input.vehicle.surcharge > 0 ? ` (+${formatRand(input.vehicle.surcharge)})` : ''
    const detail = input.vehicleDetail.trim() ? ` — ${input.vehicleDetail.trim()}` : ''
    lines.push(`${label('Vehicle')} ${input.vehicle.label}${detail}${surcharge}`)
  }

  const when =
    input.time === EARLIEST_SLOT
      ? `${formatDateKeyLong(input.dateKey)}, earliest you can`
      : `${formatDateKeyLong(input.dateKey)} at ${input.time}`
  lines.push(`${label('When')} ${when}`)

  // "Somewhere else nearby" is a sentinel, not a place — say so plainly rather
  // than pasting it after the street name as if it were a suburb.
  const address =
    input.suburb === OTHER_AREA
      ? `${input.street.trim()} (not on your list of areas — please confirm you can reach me)`
      : [input.street.trim(), input.suburb].filter(Boolean).join(', ')
  lines.push(`${label('Where')} ${address}`)
  lines.push(`${label('Name')} ${input.name.trim()}`)
  lines.push(`${label('Number')} ${toLocalDisplay(input.phone)}`)

  if (input.notes.trim()) {
    lines.push(`${label('Notes')} ${input.notes.trim()}`)
  }

  lines.push('')
  lines.push(
    markup === 'whatsapp'
      ? `*Total: ${formatRand(input.quote.total)}*`
      : `Total: ${formatRand(input.quote.total)}`,
  )
  lines.push(`Time needed: ${formatDuration(input.quote.minutes).replace('About ', 'about ')}`)

  return lines.join('\n')
}
