import { computed, reactive, ref, watch } from 'vue'
import {
  DEFAULT_SERVICE_ID,
  DEFAULT_VEHICLE_ID,
  addOns as allAddOns,
  areas,
  bookableServices,
  vehicleTypes,
  OTHER_AREA,
} from '../content'
import { emailDeliveryEnabled, siteConfig } from '../site.config'
import { buildQuote } from '../lib/quote'
import { composeBookingMessage } from '../lib/message'
import { buildConfirmationLink, composeConfirmationMessage } from '../lib/confirmation'
import { submitToWeb3Forms } from '../lib/web3forms'
import { formatDateKeyLong } from '../lib/format'
import { buildWhatsAppLink, isValidSaMobile, toLocalDisplay } from '../lib/whatsapp'
import { ownerInternationalNumber } from '../lib/contact'
import { EARLIEST_SLOT, firstBookableDate, slotsForDate } from '../lib/schedule'

export type StepId = 'service' | 'vehicle' | 'when' | 'details'

export interface StepMeta {
  id: StepId
  label: string
  /** Shown under the heading of that step. */
  hint: string
}

export const bookingSteps: StepMeta[] = [
  { id: 'service', label: 'Wash', hint: 'What should I do to the car?' },
  { id: 'vehicle', label: 'Vehicle', hint: 'Bigger vehicles carry a small surcharge.' },
  { id: 'when', label: 'When', hint: 'Pick a day and a start time.' },
  { id: 'details', label: 'Details', hint: 'Where I am coming, and who to ask for.' },
]

interface BookingDraft {
  serviceId: string
  vehicleId: string
  addOnIds: string[]
  vehicleDetail: string
  dateKey: string
  time: string
  name: string
  phone: string
  suburb: string
  street: string
  notes: string
}

function emptyDraft(): BookingDraft {
  return {
    serviceId: DEFAULT_SERVICE_ID,
    vehicleId: DEFAULT_VEHICLE_ID,
    addOnIds: [],
    vehicleDetail: '',
    dateKey: '',
    time: '',
    name: '',
    phone: '',
    suburb: '',
    street: '',
    notes: '',
  }
}

/**
 * Module-level state: the header CTA, the price cards and the area tiles all
 * drive the same form instance.
 */
const form = reactive<BookingDraft>(emptyDraft())
const stepIndex = ref(0)
/** Fields the customer has finished with — errors only surface after that. */
const touched = reactive<Record<string, boolean>>({})
const submitted = ref(false)
const sending = ref(false)
const restoredDraft = ref(false)
/** Set when the email could not be delivered, so the UI can offer a way out. */
const submitError = ref<string | null>(null)
/** Honeypot. Bound to a hidden field; anything but empty means a bot filled it. */
const honeypot = ref('')

// ---------------------------------------------------------------- derived ---

const selectedService = computed(() => bookableServices.find((s) => s.id === form.serviceId))
const selectedVehicle = computed(() => vehicleTypes.find((v) => v.id === form.vehicleId))
const selectedAddOns = computed(() => allAddOns.filter((a) => form.addOnIds.includes(a.id)))

const quote = computed(() =>
  buildQuote(selectedService.value, selectedVehicle.value, selectedAddOns.value),
)

/** Slots that still leave enough daylight for the chosen wash. */
const availableSlots = computed(() =>
  form.dateKey ? slotsForDate(form.dateKey, quote.value.minutes) : [],
)

const bookingMessageInput = computed(() => ({
  service: selectedService.value,
  vehicle: selectedVehicle.value,
  addOns: selectedAddOns.value,
  vehicleDetail: form.vehicleDetail,
  dateKey: form.dateKey,
  time: form.time,
  name: form.name,
  phone: form.phone,
  suburb: form.suburb,
  street: form.street,
  notes: form.notes,
  quote: quote.value,
}))

const bookingMessage = computed(() =>
  composeBookingMessage({
    service: selectedService.value,
    vehicle: selectedVehicle.value,
    addOns: selectedAddOns.value,
    vehicleDetail: form.vehicleDetail,
    dateKey: form.dateKey,
    time: form.time,
    name: form.name,
    phone: form.phone,
    suburb: form.suburb,
    street: form.street,
    notes: form.notes,
    quote: quote.value,
  }),
)

const bookingLink = computed(() => buildWhatsAppLink(ownerInternationalNumber, bookingMessage.value))

/** The confirmation the owner will send back to the customer. */
const confirmationMessage = computed(() =>
  composeConfirmationMessage({
    service: selectedService.value,
    vehicle: selectedVehicle.value,
    addOns: selectedAddOns.value,
    vehicleDetail: form.vehicleDetail,
    dateKey: form.dateKey,
    time: form.time,
    name: form.name,
    phone: form.phone,
    suburb: form.suburb,
    street: form.street,
    quote: quote.value,
  }),
)

// -------------------------------------------------------------- validation ---

/** Field name to message. A field only appears here while it is actually wrong. */
const errors = computed<Record<string, string>>(() => {
  const found: Record<string, string> = {}

  if (!selectedService.value) found.serviceId = 'Pick the wash you want.'
  if (!selectedVehicle.value) found.vehicleId = 'Pick the type of vehicle.'

  if (!form.dateKey) {
    found.dateKey = 'Pick the day you want me there.'
  } else if (availableSlots.value.length === 0) {
    found.dateKey = 'No time left that day for this wash. Try the next one.'
  }

  if (!form.time) {
    found.time = 'Pick a start time.'
  } else if (form.time !== EARLIEST_SLOT && !availableSlots.value.includes(form.time)) {
    found.time = 'That time no longer fits this wash. Pick another.'
  }

  if (form.name.trim().length < 2) found.name = 'Tell me what to call you.'

  if (!form.phone.trim()) {
    found.phone = 'I need a number to confirm on.'
  } else if (!isValidSaMobile(form.phone)) {
    found.phone = 'That does not look like a SA mobile number, e.g. 073 242 3298.'
  }

  if (!form.suburb) found.suburb = 'Choose the area you are in.'
  if (form.street.trim().length < 4) found.street = 'Street and number, so I can find the gate.'

  return found
})

const stepFields: Record<StepId, string[]> = {
  service: ['serviceId'],
  vehicle: ['vehicleId'],
  when: ['dateKey', 'time'],
  details: ['name', 'phone', 'suburb', 'street'],
}

function stepErrors(id: StepId): string[] {
  return stepFields[id].filter((field) => field in errors.value)
}

const currentStep = computed(() => bookingSteps[stepIndex.value] as StepMeta)
const isLastStep = computed(() => stepIndex.value === bookingSteps.length - 1)
const formIsValid = computed(() => Object.keys(errors.value).length === 0)

/** Show an error only once the customer has left the field or tried to move on. */
function visibleError(field: string): string | undefined {
  return touched[field] ? errors.value[field] : undefined
}

/** Which steps still have something wrong, for the stepper's warning dots. */
function stepHasVisibleError(id: StepId): boolean {
  return stepFields[id].some((field) => touched[field] && field in errors.value)
}

// ----------------------------------------------------------------- actions ---

function markTouched(field: string): void {
  touched[field] = true
}

function goToStep(index: number): void {
  stepIndex.value = Math.min(Math.max(index, 0), bookingSteps.length - 1)
}

/** Advance if the current step is clean; otherwise reveal what is missing. */
function nextStep(): boolean {
  const bad = stepErrors(currentStep.value.id)
  if (bad.length > 0) {
    bad.forEach(markTouched)
    return false
  }
  if (!isLastStep.value) stepIndex.value += 1
  return true
}

function previousStep(): void {
  if (stepIndex.value > 0) stepIndex.value -= 1
}

/** Jump straight to a wash from the prices grid. Bookable washes only. */
function chooseService(serviceId: string): void {
  if (!bookableServices.some((service) => service.id === serviceId)) return
  form.serviceId = serviceId
  markTouched('serviceId')
  stepIndex.value = 0
  submitted.value = false
}

/** Jump straight to a suburb from the areas grid. */
function chooseSuburb(suburb: string): void {
  form.suburb = suburb
  markTouched('suburb')
  submitted.value = false
}

function toggleAddOn(addOnId: string): void {
  const at = form.addOnIds.indexOf(addOnId)
  if (at === -1) form.addOnIds.push(addOnId)
  else form.addOnIds.splice(at, 1)
}

function clearDraft(): void {
  try {
    window.localStorage.removeItem(siteConfig.draftStorageKey)
  } catch {
    // Private mode or storage disabled. The form still works, it just forgets.
  }
}

function reset(): void {
  Object.assign(form, emptyDraft())
  form.dateKey = firstBookableDate(quote.value.minutes)
  form.time = EARLIEST_SLOT
  Object.keys(touched).forEach((key) => delete touched[key])
  stepIndex.value = 0
  submitted.value = false
  sending.value = false
  restoredDraft.value = false
  submitError.value = null
  honeypot.value = ''
  clearDraft()
}

/**
 * Build the notification email. The owner gets the booking he has to act on
 * *and* the confirmation he will send back, already written, plus a wa.me link
 * addressed to the customer so accepting is one tap rather than a copy and
 * paste.
 */
function buildNotificationBody(): string {
  const confirmation = confirmationMessage.value
  const replyLink = buildConfirmationLink(form.phone, confirmation)

  return [
    composeBookingMessage(bookingMessageInput.value, { markup: 'plain', heading: 'NEW BOOKING' }),
    '',
    '--- Reply to the customer ---',
    '',
    `One tap to open WhatsApp with this already written: ${replyLink}`,
    '',
    'Or copy the message below:',
    '',
    confirmation,
  ].join('\n')
}

function buildSubject(): string {
  const parts = [
    selectedService.value?.name ?? 'Booking',
    form.dateKey ? formatDateKeyLong(form.dateKey) : '',
    form.name.trim(),
  ].filter(Boolean)
  return `New booking — ${parts.join(', ')}`
}

/**
 * Email the booking to the owner. There is no server: Web3Forms takes the POST
 * and sends the mail, so the site stays a static bundle.
 *
 * With no access key configured this falls back to the original handoff, where
 * the customer sends the booking from their own WhatsApp.
 */
async function submit(): Promise<boolean> {
  Object.values(stepFields).flat().forEach(markTouched)
  if (!formIsValid.value) {
    const firstBadStep = bookingSteps.findIndex((step) => stepErrors(step.id).length > 0)
    if (firstBadStep !== -1) stepIndex.value = firstBadStep
    return false
  }

  submitError.value = null

  // A filled honeypot means a bot. Show the normal success panel rather than an
  // error, so it learns nothing, but send nothing.
  if (honeypot.value.trim().length > 0) {
    submitted.value = true
    return true
  }

  if (!emailDeliveryEnabled) {
    sendViaCustomerWhatsApp()
    return true
  }

  sending.value = true
  const result = await submitToWeb3Forms({
    access_key: siteConfig.web3formsAccessKey,
    subject: buildSubject(),
    from_name: 'Clan22 Carwash bookings',
    name: form.name.trim(),
    phone: toLocalDisplay(form.phone),
    area: form.suburb,
    message: buildNotificationBody(),
    botcheck: '',
  })
  sending.value = false

  if (!result.ok) {
    // Keep the draft: the customer must not have to retype anything.
    submitError.value = result.detail ?? 'Unknown error'
    return false
  }

  submitted.value = true
  clearDraft()
  return true
}

/** The original handoff, kept as the fallback and the manual escape hatch. */
function sendViaCustomerWhatsApp(): void {
  window.open(bookingLink.value, '_blank', 'noopener')
  submitted.value = true
  clearDraft()
}

// ------------------------------------------------------------- persistence ---

function loadDraft(): void {
  try {
    const stored = window.localStorage.getItem(siteConfig.draftStorageKey)
    if (!stored) return
    const parsed = JSON.parse(stored) as Partial<BookingDraft>
    // Only take keys we recognise; a stale schema must not poison the form.
    for (const key of Object.keys(emptyDraft()) as (keyof BookingDraft)[]) {
      const value = parsed[key]
      if (key === 'addOnIds') {
        if (Array.isArray(value)) form.addOnIds = value.filter((id) => typeof id === 'string')
      } else if (typeof value === 'string') {
        form[key] = value
      }
    }
    // A draft written before the menu changed can name a wash or an add-on that
    // no longer exists. Drop anything unrecognised rather than booking a ghost.
    if (!bookableServices.some((service) => service.id === form.serviceId)) {
      form.serviceId = DEFAULT_SERVICE_ID
    }
    form.addOnIds = form.addOnIds.filter((id) => allAddOns.some((addOn) => addOn.id === id))

    restoredDraft.value = Boolean(form.name || form.street || form.notes)
  } catch {
    clearDraft()
  }
}

function saveDraft(): void {
  try {
    window.localStorage.setItem(siteConfig.draftStorageKey, JSON.stringify(form))
  } catch {
    // Ignore. Losing the draft is not worth breaking the form over.
  }
}

let initialised = false

function initBookingForm(): void {
  if (initialised) return
  initialised = true

  loadDraft()

  // A restored or empty draft may point at a day that has since passed, or a
  // slot the current wash no longer fits into. Settle both before first paint.
  if (!form.dateKey || slotsForDate(form.dateKey, quote.value.minutes).length === 0) {
    form.dateKey = firstBookableDate(quote.value.minutes)
  }
  if (!form.time) form.time = EARLIEST_SLOT

  // Write the settled state back before watching, so a draft that was scrubbed
  // on load does not sit in storage with dead ids until the customer edits.
  saveDraft()
  watch(form, saveDraft, { deep: true })

  // Changing the wash changes how long it takes, which can invalidate the slot.
  watch(
    () => quote.value.minutes,
    () => {
      if (form.dateKey && slotsForDate(form.dateKey, quote.value.minutes).length === 0) {
        form.dateKey = firstBookableDate(quote.value.minutes)
      }
      if (form.time !== EARLIEST_SLOT && !availableSlots.value.includes(form.time)) {
        form.time = EARLIEST_SLOT
      }
    },
  )
}

export function useBookingForm() {
  return {
    form,
    stepIndex,
    currentStep,
    isLastStep,
    submitted,
    sending,
    restoredDraft,
    submitError,
    honeypot,
    emailDeliveryEnabled,

    services: bookableServices,
    addOns: allAddOns,
    vehicleTypes,
    suburbs: [...areas, OTHER_AREA],

    selectedService,
    selectedVehicle,
    selectedAddOns,
    quote,
    availableSlots,
    bookingMessage,
    bookingLink,
    confirmationMessage,
    errors,
    formIsValid,

    visibleError,
    stepHasVisibleError,
    markTouched,
    goToStep,
    nextStep,
    previousStep,
    chooseService,
    chooseSuburb,
    toggleAddOn,
    submit,
    sendViaCustomerWhatsApp,
    reset,
    initBookingForm,
  }
}
