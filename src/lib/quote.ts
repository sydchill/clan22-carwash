import type { AddOn, Service, VehicleType } from '../types'

export interface QuoteLine {
  label: string
  amount: number
}

export interface Quote {
  lines: QuoteLine[]
  total: number
  /** Total minutes on site, used to work out which time slots still fit. */
  minutes: number
}

/**
 * Build the running quote. Everything the customer sees on the summary card and
 * in the WhatsApp message comes from here, so the two can never disagree.
 */
export function buildQuote(
  service: Service | undefined,
  vehicle: VehicleType | undefined,
  addOns: AddOn[],
): Quote {
  const lines: QuoteLine[] = []
  let total = 0
  let minutes = 0

  if (service) {
    lines.push({ label: service.name, amount: service.price })
    total += service.price
    minutes += service.minutes
  }

  if (vehicle && vehicle.surcharge > 0) {
    lines.push({ label: `${vehicle.label} surcharge`, amount: vehicle.surcharge })
    total += vehicle.surcharge
  }

  for (const addOn of addOns) {
    lines.push({ label: addOn.label, amount: addOn.price })
    total += addOn.price
    minutes += addOn.minutes
  }

  return { lines, total, minutes }
}
