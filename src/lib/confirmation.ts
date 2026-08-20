import type { AddOn, Service, VehicleType } from '../types'
import type { Quote } from './quote'
import { formatDateKeyLong, formatRand } from './format'
import { EARLIEST_SLOT } from './schedule'
import { buildWhatsAppLink, toInternational } from './whatsapp'
import { OTHER_AREA } from '../content'

export interface ConfirmationInput {
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
  quote: Quote
}

/**
 * The message the owner sends *to the customer* once he has accepted the slot.
 * It goes out in the notification email ready to paste into WhatsApp, so it is
 * written in his voice and reads as a confirmation, not a receipt.
 */
export function composeConfirmationMessage(input: ConfirmationInput): string {
  const firstName = input.name.trim().split(/\s+/)[0] ?? input.name.trim()
  const lines: string[] = [`Hi ${firstName}, this is Clan22 Carwash.`, '']

  lines.push('Your wash is booked:')

  if (input.service) {
    lines.push(`• ${input.service.name} — ${formatRand(input.service.price)}`)
  }
  for (const addOn of input.addOns) {
    lines.push(`• ${addOn.label} — ${formatRand(addOn.price)}`)
  }
  if (input.vehicle && input.vehicle.surcharge > 0) {
    lines.push(`• ${input.vehicle.label} — ${formatRand(input.vehicle.surcharge)}`)
  }

  const when =
    input.time === EARLIEST_SLOT
      ? `${formatDateKeyLong(input.dateKey)}, as early as I can`
      : `${formatDateKeyLong(input.dateKey)} at ${input.time}`

  const where =
    input.suburb === OTHER_AREA ? input.street.trim() : [input.street.trim(), input.suburb].join(', ')

  lines.push('')
  lines.push(`When: ${when}`)
  lines.push(`Where: ${where}`)
  lines.push(`Total: ${formatRand(input.quote.total)} — cash or e-wallet when I finish.`)
  lines.push('')
  lines.push('I bring everything except water, so please leave a tap open for me.')
  lines.push('See you then!')

  return lines.join('\n')
}

/**
 * A one-tap wa.me link that opens WhatsApp addressed to the customer with the
 * confirmation already written. Saves the owner the copy and paste.
 */
export function buildConfirmationLink(customerPhone: string, message: string): string {
  return buildWhatsAppLink(toInternational(customerPhone), message)
}
