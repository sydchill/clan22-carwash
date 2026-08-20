import type { AddOn, ContactFact, Pillar, Service, Step, VehicleType } from './types'
import { displayPhone } from './lib/contact'

export const pillars: Pillar[] = [
  {
    mark: '01',
    title: 'Gentle on paint',
    body: 'Clean mitts, fresh water and a soft hand dry. Nothing that swirls or scratches your finish.',
  },
  {
    mark: '02',
    title: 'I come to you',
    body: 'Your driveway, your gate, your parking bay. You carry on with your day while I work.',
  },
  {
    mark: '03',
    title: 'Booked in a minute',
    body: 'Pick a wash and a time on this page. It lands in my WhatsApp and I confirm.',
  },
]

export const services: Service[] = [
  {
    id: 'exterior',
    name: 'Exterior hand wash',
    price: 120,
    detail: 'Wheels, rims, body wash and hand dry with a clean microfibre.',
    minutes: 45,
    available: true,
  },
  {
    id: 'full',
    name: 'Full wash, in and out',
    price: 150,
    detail: 'Everything outside, plus dashboard, doors and windows wiped down inside.',
    minutes: 90,
    available: true,
  },
  {
    id: 'interior',
    name: 'Interior deep clean',
    price: 280,
    detail: 'Seats, carpets and boot scrubbed by hand, all plastics wiped down.',
    minutes: 120,
    available: false,
  },
  {
    id: 'wax',
    name: 'Wash and wax',
    price: 320,
    detail: 'Full wash finished with hand-applied wax for shine and protection.',
    minutes: 120,
    available: false,
  },
]

/** The washes the booking form offers. Flip `available` above to add one back. */
export const bookableServices: Service[] = services.filter((service) => service.available)

/** The wash preselected when the booking form opens cold. */
export const DEFAULT_SERVICE_ID = 'full'

export const addOns: AddOn[] = [
  { id: 'tyres', label: 'Tyre shine', price: 30, minutes: 10 },
  { id: 'headlights', label: 'Headlight polish', price: 60, minutes: 20 },
]

/**
 * Quoted prices are for sedans and hatchbacks; anything bigger carries a flat
 * surcharge, which the quote adds automatically.
 */
export const vehicleTypes: VehicleType[] = [
  { id: 'hatchback', label: 'Hatchback', surcharge: 0 },
  { id: 'sedan', label: 'Sedan', surcharge: 0 },
  { id: 'suv', label: 'SUV', surcharge: 25 },
  { id: 'bakkie', label: 'Bakkie', surcharge: 25 },
  { id: 'minibus', label: 'Minibus', surcharge: 25 },
]

export const DEFAULT_VEHICLE_ID = 'sedan'

/**
 * What a bigger vehicle adds. Derived rather than written into the copy, so the
 * sentences on the prices and vehicle panels cannot drift from the real charge.
 */
export const largeVehicleSurcharge = Math.max(...vehicleTypes.map((v) => v.surcharge))

export const steps: Step[] = [
  {
    n: '1',
    title: 'Build your booking',
    body: 'Pick the wash, your car, and a time that suits you. The price adds up as you go.',
  },
  {
    n: '2',
    title: 'Send it to my WhatsApp',
    body: 'One tap puts the whole booking in a message. Nothing to sign up for.',
  },
  {
    n: '3',
    title: 'I confirm and arrive',
    body: 'I reply to lock the slot, arrive with everything I need, and you pay cash or e-wallet when I finish.',
  },
]

export const areas: string[] = [
  'Carlswald',
  'Noordwyk',
  'Halfway House',
  'Vorna Valley',
  'Blue Hills',
  'Kyalami',
  'Waterfall',
  'President Park',
  'Crowthorne',
  'Erand Gardens',
]

/** Offered after the listed suburbs, for customers just outside the free-travel zone. */
export const OTHER_AREA = 'Somewhere else nearby'

export const contactFacts: ContactFact[] = [
  { label: 'WhatsApp', value: displayPhone, emphasis: true },
  { label: 'Monday to Friday', value: '07:00 – 17:00' },
  { label: 'Saturday & Sunday', value: '07:00 – 14:00' },
  { label: 'Based in', value: 'Midrand, Gauteng' },
]

export const navLinks = [
  { href: '#book', label: 'Book' },
  { href: '#services', label: 'Prices' },
  { href: '#how', label: 'How it works' },
  { href: '#areas', label: 'Areas' },
]

export const heroAssurances = ['Water from your tap', 'Cash or e-wallet', '7 days a week']
