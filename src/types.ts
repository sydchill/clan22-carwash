/** A reason-to-buy tile in the "Why hand wash" panel. */
export interface Pillar {
  /** Two-digit marker shown in the tinted square, e.g. "01". */
  mark: string
  title: string
  body: string
}

/**
 * A priced wash. Price and duration are numbers so the booking quote can do
 * arithmetic; the display strings ("R200", "About 1 hr 30") are derived.
 */
export interface Service {
  id: string
  name: string
  /** Rand, for a sedan or hatchback. */
  price: number
  detail: string
  /** Roughly how long the wash takes, in minutes. */
  minutes: number
  /**
   * Whether it can be booked right now. Unavailable washes still show on the
   * prices grid so the catalogue stays intact, but the booking form skips them.
   */
  available: boolean
}

/** An optional extra the customer can tick on top of a wash. */
export interface AddOn {
  id: string
  label: string
  /** Rand added to the total. */
  price: number
  /** Extra minutes on site. */
  minutes: number
}

/** A body type. Bigger vehicles carry a flat surcharge. */
export interface VehicleType {
  id: string
  label: string
  /** Rand added to the total; 0 for sedans and hatchbacks. */
  surcharge: number
}

/** A numbered card in the "How it works" band. */
export interface Step {
  n: string
  title: string
  body: string
}

/** A labelled contact fact on the booking panel. */
export interface ContactFact {
  label: string
  value: string
  /** Large treatment is used for the phone number only. */
  emphasis?: boolean
}

/** Trading hours for one weekday, as minutes from midnight. */
export interface DayHours {
  open: number
  close: number
}
