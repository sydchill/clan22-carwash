# Clan22 Carwash

Booking site for a mobile hand car wash operating around Midrand, Gauteng.
Vue 3 + TypeScript + Vite. Visual design ported from the `Clan22 Carwash.dc.html`
Claude Design canvas; the booking flow was added on top of it.

## Configuration

Settings live in `.env`, which is gitignored. `.env.example` is the committed
template — copy it and fill it in:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|---|---|---|
| `VITE_WHATSAPP_NUMBER` | yes | The number bookings and chats go to |
| `VITE_WEB3FORMS_ACCESS_KEY` | no | Emails bookings to you; empty falls back to the WhatsApp handoff |

**These are not secrets.** Vite inlines every `VITE_*` value into the JavaScript
bundle at build time, so anyone can read them in devtools — `grep` the built
`dist/assets/*.js` and the phone number is right there. `.env` keeps values out
of the repository and lets each deploy differ; it does not hide them from
visitors. Only put things here that the site publishes anyway. Nothing that
must stay hidden can live in this codebase at all, because there is no server.

When reading a variable, access it as a literal — `import.meta.env.VITE_FOO`.
Vite substitutes those by matching the exact text, so a dynamic lookup like
`import.meta.env[name]` is left untouched and comes back `undefined` in a build.

A missing required value throws at import time, and `src/main.ts` catches it and
renders a plain "This site is not configured yet" panel with the variable name,
rather than leaving a blank page.

## Commands

- `npm run dev` — dev server (port 5175)
- `npm run build` — type-check (`vue-tsc`) + production build to `dist/`
- `npm run preview` — serve the production build

## How booking works

Still no backend of our own. The four-step form POSTs to **Web3Forms**, which
emails the booking to the owner. Everything else stays a static bundle.

The notification email carries two things: the booking to act on, and the
**confirmation message to send back**, already written. It includes a `wa.me`
link addressed to the customer's number with that confirmation prefilled — one
tap opens WhatsApp ready to send — and the same text in plain form underneath
for copying by hand.

Nothing is auto-sent to the customer. WhatsApp only allows that through the paid
Cloud API, which needs a real server for the token and a Meta-approved template,
and would cost the owner the WhatsApp Business app on that number. The owner
stays the one who presses send, which is also what keeps replies free.

Because no slot is reserved anywhere, the success panel says the request is *with
me* and a confirmation is coming — never that a slot is booked. Keep that
wording honest if you edit it.

### Setting up Web3Forms

1. Go to https://web3forms.com, enter the address bookings should land in, and
   collect the access key from the email it sends.
2. Put it in `.env` as `VITE_WEB3FORMS_ACCESS_KEY`.

The key is public by design — it only ever routes mail to the address it was
issued for, so shipping it in the bundle is safe. This is exactly why a
messaging API token could not be handled the same way.

Because the key is readable, anyone who finds it could POST to Web3Forms and
send mail to that inbox. The mitigation is Web3Forms' own **domain restriction**
setting: lock the key to the live domain in their dashboard so submissions from
anywhere else are rejected.

Free tier is **250 submissions a month**.

**Leaving the key empty is a supported state**: `emailDeliveryEnabled` goes
false and the form falls back to the original handoff, where the customer sends
the booking from their own WhatsApp. The button label, the reassurance line and
the success panel all switch to match. The site is never broken by a missing key.

### What happens when sending fails

The submit button shows a spinner and is disabled while in flight. On failure the
form stays exactly as it was — **the draft is deliberately not cleared** — and an
error panel offers *Try again* and *Send on WhatsApp instead*, so a bad connection
can never swallow a booking.

### Spam protection

Two layers, and they catch different things:

**Honeypot** — `#booking-company`, hidden via `.c22-visually-hidden` with
`tabindex="-1"` and `aria-hidden`. If it is filled, the form shows the normal
success panel but sends nothing, so the bot learns nothing. Costs a real
customer nothing.

**hCaptcha** on the last step, via Web3Forms' native support. The token is sent
as `h-captcha-response`.

Set `VITE_HCAPTCHA_SITEKEY` in `.env` — Web3Forms' free tier uses their shared
key, `50b2fe65-b00b-4b9e-ad62-3ba471098be2`. Empty disables the check.

**It must also be switched on in the Web3Forms dashboard.** Without that,
Web3Forms never verifies the token and the widget is decoration — the client
side only gates the button, which a script can skip entirely.

Implementation notes:

- The hCaptcha script loads only when `CaptchaField` mounts, i.e. when someone
  actually reaches step 4. Most visitors never fetch it.
- Tokens are single use and expire a couple of minutes after solving. The
  widget is reset after every submit attempt, and the token is cleared on the
  expiry and error callbacks.
- `hcaptcha.remove()` runs on unmount, otherwise revisiting the step leaks an
  iframe each time.
- If the script cannot load (ad blocker, dropped connection) the form **fails
  open**: the button unblocks and the field explains what happened, pointing at
  the WhatsApp fallback. Blocking a paying customer over a blocked third-party
  script is the worse failure. Note this only holds while the Web3Forms
  dashboard toggle is off; with it on, such a submission is rejected server-side
  and the customer lands on the retry panel.
- hCaptcha renders at a fixed 303×78 and cannot be told to shrink, so it is
  scaled to 0.88 below 480px and 0.78 below 360px. Unscaled it runs past the
  card padding to the screen edge on a small phone.

### Privacy note

The customer's name, phone number and street address travel through Web3Forms to
the owner's inbox. Nothing is stored in the browser except the customer's own
unfinished draft in `localStorage`.

The flow:

1. **Wash** — one of the currently bookable services, plus optional add-ons.
2. **Vehicle** — body type (bigger vehicles add a flat surcharge), plus an optional
   description. The surcharge is `largeVehicleSurcharge`, derived from `vehicleTypes`
   so the sentences on the prices and vehicle panels always match the real charge.
3. **When** — a day and a start time. Slots respect trading hours, need an hour's
   notice for same-day, and only appear if the wash can finish before closing.
4. **Details** — name, WhatsApp number, area, street address, notes.

A running quote is derived from the same numbers the message uses, so the price
on screen and the price in the message can never disagree. Unfinished bookings
are kept in `localStorage` so a reload doesn't lose them.

## Turning a wash on or off

Each entry in `services` (`src/content.ts`) carries an `available` flag.
`false` keeps the wash on the prices grid — so the price stays public — but drops
it from the booking form and replaces its button with "Not available yet".
`bookableServices` is the filtered list the form reads.

Right now only **Exterior hand wash** and **Full wash, in and out** are bookable;
**Interior deep clean** and **Wash and wax** are listed but off the form. Flip the
flag to put one back. Nothing else needs changing — the form, the quote, the
message and the draft loader all follow the flag.

Drafts saved before a menu change are scrubbed on load: an unbookable wash falls
back to `DEFAULT_SERVICE_ID` and unknown add-on ids are dropped, so an old
`localStorage` entry can never book something that no longer exists.

## Where things live

### Content and config

- `src/site.config.ts` — reads `.env`, validates what is required, and exposes
  the prefilled chat message, feature toggles (`showAddOns`,
  `showFloatingButton`) and the draft storage key.
- `src/content.ts` — all page copy and the booking catalogue: services (with
  their `available` flag), add-ons, vehicle types, areas, steps, pillars, nav links.
- `src/types.ts` — the shapes those lists conform to.

Prices and durations are stored as **numbers**, not strings — the quote does
arithmetic on them, and `src/lib/format.ts` derives every display string
(`R200`, `About 1 hr 30`, `Thu 21 Aug`).

### Booking logic

- `src/composables/useBookingForm.ts` — module-level form state, step machine,
  validation, and draft persistence. Shared by the wizard, the price cards and
  the area tiles, so all three drive one booking.
- `src/lib/quote.ts` — line items, total, and total minutes on site.
- `src/lib/schedule.ts` — trading hours, slot generation, first bookable day.
- `src/lib/message.ts` — composes the booking message. `markup: 'whatsapp'`
  wraps labels in asterisks for bold; `'plain'` is used for the email, where
  those asterisks would just be litter.
- `src/lib/confirmation.ts` — composes the confirmation the owner sends back to
  the customer, plus the `wa.me` link addressed to them.
- `src/lib/web3forms.ts` — the POST to Web3Forms and its result shape.
- `src/lib/whatsapp.ts` — number normalisation (`073…` ⇄ `27…`), SA mobile
  validation, `wa.me` link building.
- `src/lib/contact.ts` — the owner's number and plain chat link.

### UI

- `src/components/booking/` — the wizard: `BookingSection` (shell, step focus
  management, submit), `BookingStepper`, the four `Step*` panels, `QuoteSummary`,
  `BookingSuccess`.
- `src/components/ui/` — `FormField` (label + helper + `role="alert"` error),
  `OptionCard` (radio/checkbox as a card, real input kept for a11y), `ChoiceChip`.
- `src/components/` — the marketing sections.
- `src/style.css` — design tokens (`--c22-*`) and shared control styles.

## Colour tokens and contrast

The palette is split by **what a colour is allowed to carry**, because the
canvas's brand teal is only 3.8:1 on white:

| Token | Use |
|---|---|
| `--c22-teal` | Brand accent: large display text (24px+) and decorative fills |
| `--c22-teal-cta` | Behind white button text (5.0:1) |
| `--c22-teal-dark` | Small text on light surfaces (6.8:1) |

Dark panels set `--c22-focus: var(--c22-focus-on-dark)` locally so the keyboard
ring stays visible against navy. All body and label text clears WCAG AA 4.5:1.

## Changing the phone number

Edit `VITE_WHATSAPP_NUMBER` in `.env` and restart the dev server. Local
(`0732423298`), spaced (`073 242 3298`) and international (`+27732423298`) forms
all work — the booking link, the plain chat link and the on-page display are all
derived from it.

## Changing prices, add-ons or areas

Edit the arrays in `src/content.ts`. The prices grid, the booking form, the quote
and the WhatsApp message all read from the same source, so nothing needs updating
twice. `DEFAULT_SERVICE_ID` picks the wash the form opens on — keep it pointing at
a wash whose `available` is `true`.

## Kit assumptions baked into the copy

Two facts about how the wash runs are stated on the page, and both are one-line
edits if they change:

- **Water comes from the customer's tap.** Said as "Water from your tap" in
  `heroAssurances`, and again in the booking form's notes helper
  (`src/components/booking/StepDetails.vue`).
- **No vacuum.** "Full wash, in and out" describes wiping the interior, not
  vacuuming it, and there is no boot-vacuum add-on. If a vacuum arrives, restore
  the add-on in `addOns`, put the vacuum back in the full wash `detail`, and
  consider re-enabling the interior deep clean.

## Changing trading hours

`HOURS` in `src/lib/schedule.ts`, keyed by JS weekday (0 = Sunday). The contact
panel's published hours are separate copy in `src/content.ts` — update both.

## Brand assets

The logo is supplied artwork, not drawn in code. Source files came from the
`Clan22 carwash website/brand` export; what ships lives in `public/`:

| File | What it is |
|---|---|
| `logo-wordmark.png` | "Clan22 CARWASH" lockup for light surfaces, 1153×187 |
| `logo-wordmark-light.png` | The reversed colourway — white "Clan" and "CARWASH" — for navy panels |
| `logo-mark.png` | The square C22 icon, 512×512 |
| `og-image.png` | Social share card, 1200×630 |

Both wordmarks were exported on an 1800×440 canvas with the artwork in the
top-left. They are cropped to their alpha bounding box before use, otherwise
the padding becomes dead space in the header. `scratchpad/pngcrop.py` does that
with the standard library only (Pillow is not installed here).

`BrandWordmark.vue` takes a `height` and a `variant`. Width and `aspect-ratio`
are derived from the artwork's intrinsic 1153×187, so the lockup can never be
stretched and its box is reserved before the image loads. The `src` is bound
rather than literal — Vite resolves literal template `src` values at build
time, which would tie the build to files the owner supplies. If a file is
missing the component falls back to the name set in DM Sans, so a missing asset
degrades to a plain wordmark rather than a broken-image icon.

The lockup is 6.2:1. Below roughly 30px tall the "CARWASH" line stops being
readable, so header/footer/band heights are set at 38/32/34 with a 30px floor
on small screens.

### Favicons

| File | Used by |
|---|---|
| `favicon.ico` | Browser tabs and bookmarks; contains 16, 32 and 48px |
| `favicon-32.png` | Browsers that prefer a PNG favicon; small manifest icon |
| `apple-touch-icon.png` | iOS home screen and the manifest, 180×180 |
| `site.webmanifest` | Name, theme colour and icon set for "Add to home screen" |

`favicon.ico` and `favicon-32.png` are generated from `logo-mark.png` by
`scratchpad/mkicons.py` — area-average downscaling plus an ICO container with
PNG payloads, again standard library only. Rerun it whenever the mark changes:

```bash
python scratchpad/mkicons.py
```

They are rasters on purpose: nothing outside the page loads a webfont, so a
logo containing text has to be baked into pixels rather than left as live text
in an SVG.

## The hero photo

`src/components/ImageSlot.vue` stands in for the design canvas' `<image-slot>`.
The hero currently renders its empty state. To drop in a real photo, put the file
in `public/` and pass it through:

```vue
<ImageSlot src="/hero.jpg" alt="Washing a car by hand in a Midrand driveway" />
```
#   c l a n 2 2 - c a r w a s h 
 
 