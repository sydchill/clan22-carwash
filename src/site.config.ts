/**
 * Site configuration, read from .env at build time.
 *
 * A caution about `VITE_*` variables: Vite inlines them into the bundle, so
 * they are readable by anyone who opens devtools. .env keeps them out of the
 * repository and lets each deploy differ — it does not make them secret.
 * Nothing that must stay hidden belongs here; both values below are ones the
 * site publishes anyway.
 */

/**
 * Fail at startup rather than shipping dead WhatsApp buttons.
 *
 * The caller must read `import.meta.env.VITE_X` directly and pass the value in.
 * Vite substitutes those by matching the literal text, so a dynamic lookup like
 * `import.meta.env[name]` is left alone and comes back undefined in a build.
 */
function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in — see the README.`)
  }
  return trimmed
}

export const siteConfig = {
  /** Local SA number. Converted to international form for the wa.me link. */
  whatsappNumber: required('VITE_WHATSAPP_NUMBER', import.meta.env.VITE_WHATSAPP_NUMBER),
  /** Prefilled message for the plain "chat to me" buttons. */
  bookingMessage: "Hi Clan22 Carwash! I'd like to book a wash. My address: ",
  /**
   * Web3Forms access key. Public by design — it only ever routes mail to the
   * address it was issued for. Optional: with no key the form falls back to the
   * customer sending the booking from their own WhatsApp.
   */
  web3formsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? '',
  /** Show the add-on chips under the services grid. */
  showAddOns: true,
  /** Show the sticky "Book a wash" pill in the bottom-right corner. */
  showFloatingButton: true,
  /** localStorage key holding an unfinished booking, so a reload doesn't lose it. */
  draftStorageKey: 'clan22.booking.draft.v1',
} as const

/** Whether bookings can be emailed, or must fall back to the WhatsApp handoff. */
export const emailDeliveryEnabled = siteConfig.web3formsAccessKey.length > 0
