import { siteConfig } from '../site.config'
import { buildWhatsAppLink, toInternational, toLocalDisplay } from './whatsapp'

/** The owner's number in bare international digits, e.g. "27732423298". */
export const ownerInternationalNumber = toInternational(siteConfig.whatsappNumber)

/** Plain wa.me link, for buttons that open a chat with no booking attached. */
export const waLink = buildWhatsAppLink(ownerInternationalNumber, siteConfig.bookingMessage)

/** The same number formatted for reading, e.g. "073 242 3298". */
export const displayPhone = toLocalDisplay(siteConfig.whatsappNumber, ownerInternationalNumber)
