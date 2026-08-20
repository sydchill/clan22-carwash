<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import BookingStepper from './BookingStepper.vue'
import QuoteSummary from './QuoteSummary.vue'
import StepService from './StepService.vue'
import StepVehicle from './StepVehicle.vue'
import StepSchedule from './StepSchedule.vue'
import StepDetails from './StepDetails.vue'
import BookingSuccess from './BookingSuccess.vue'
import WhatsAppIcon from '../WhatsAppIcon.vue'
import { bookingSteps, useBookingForm } from '../../composables/useBookingForm'
import { formatDuration, formatRand } from '../../lib/format'

const {
  quote,
  stepIndex,
  currentStep,
  isLastStep,
  submitted,
  sending,
  restoredDraft,
  submitError,
  honeypot,
  emailDeliveryEnabled,
  errors,
  nextStep,
  previousStep,
  submit,
  sendViaCustomerWhatsApp,
  initBookingForm,
} = useBookingForm()

const stepPanel = ref<HTMLElement | null>(null)
/** Set when Next or Send is blocked, so the summary line only shows on demand. */
const blocked = ref(false)

const stepComponents = [StepService, StepVehicle, StepSchedule, StepDetails]
const currentComponent = computed(() => stepComponents[stepIndex.value] ?? StepService)

const outstanding = computed(() => Object.values(errors.value))

const submitLabel = computed(() => {
  if (sending.value) return 'Sending…'
  return emailDeliveryEnabled ? 'Send booking request' : 'Send booking on WhatsApp'
})

const reassurance = computed(() =>
  emailDeliveryEnabled
    ? 'Your booking comes straight to me. I reply on WhatsApp to confirm the slot — usually within the hour during trading times.'
    : 'Sending opens WhatsApp with the booking written out. You still press send, and I reply to confirm the slot.',
)

onMounted(initBookingForm)

/** Move focus to the new step so keyboard and screen-reader users follow along. */
watch(stepIndex, async () => {
  blocked.value = false
  await nextTick()
  stepPanel.value?.focus()
})

function handleNext(): void {
  blocked.value = !nextStep()
}

async function handleSubmit(): Promise<void> {
  blocked.value = !(await submit())
}
</script>

<template>
  <section id="book" class="booking c22-section">
    <div class="shell">
      <header class="intro">
        <div class="c22-eyebrow">Book a wash</div>
        <h2 class="c22-heading">Build your booking in under a minute</h2>
        <p class="c22-lede">
          Pick the wash, the car and a time. The price adds up as you go, then one tap sends the
          whole thing to my WhatsApp. No account, no card, nothing to pay online.
        </p>
      </header>

      <BookingSuccess v-if="submitted" />

      <div v-else class="layout">
        <div class="form-card">
          <BookingStepper />

          <p v-if="restoredDraft" class="restored" role="status">
            Picked up where you left off.
          </p>

          <!-- On narrow screens the summary card sits below the fold, so the
               running total rides along with the form instead. -->
          <p class="running-total" aria-live="polite">
            <span class="running-total-label">Running total</span>
            <span class="running-total-value">{{ formatRand(quote.total) }}</span>
            <span class="running-total-note">{{ formatDuration(quote.minutes).toLowerCase() }} on site</span>
          </p>

          <div
            ref="stepPanel"
            class="panel"
            tabindex="-1"
            role="group"
            :aria-labelledby="`step-heading-${currentStep.id}`"
          >
            <div class="panel-head">
              <p class="panel-count">Step {{ stepIndex + 1 }} of {{ bookingSteps.length }}</p>
              <h3 :id="`step-heading-${currentStep.id}`" class="panel-title">
                {{ currentStep.label }}
              </h3>
              <p class="panel-hint">{{ currentStep.hint }}</p>
            </div>

            <component :is="currentComponent" />
          </div>

          <p v-if="blocked && outstanding.length > 0" class="blocked" role="alert">
            {{
              outstanding.length === 1
                ? outstanding[0]
                : `${outstanding.length} things still need filling in — they are marked in red.`
            }}
          </p>

          <div class="actions">
            <button
              v-if="stepIndex > 0"
              type="button"
              class="c22-button c22-button--quiet"
              @click="previousStep"
            >
              Back
            </button>

            <button
              v-if="!isLastStep"
              type="button"
              class="c22-button c22-button--primary grow"
              @click="handleNext"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
              </svg>
            </button>

            <button
              v-else
              type="button"
              class="c22-button c22-button--primary grow"
              :disabled="sending"
              @click="handleSubmit"
            >
              <span v-if="sending" class="spinner" aria-hidden="true"></span>
              <WhatsAppIcon v-else-if="!emailDeliveryEnabled" />
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3.5 5.5h17v13h-17z" />
                <path d="m3.9 6.2 8.1 6.3 8.1-6.3" />
              </svg>
              {{ submitLabel }}
            </button>
          </div>

          <!-- Honeypot: off screen, skipped by the keyboard, ignored by autofill.
               Only an automated filler puts anything in it. -->
          <div class="c22-visually-hidden" aria-hidden="true">
            <label for="booking-company">Company (leave this empty)</label>
            <input
              id="booking-company"
              v-model="honeypot"
              type="text"
              name="botcheck"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <div v-if="submitError" class="failed" role="alert">
            <p class="failed-title">That did not go through.</p>
            <p class="failed-body">
              The booking could not be emailed just now — it may be your connection. Nothing you
              typed is lost. Try again, or send it straight to my WhatsApp instead.
            </p>
            <div class="failed-actions">
              <button type="button" class="c22-button c22-button--primary" @click="handleSubmit">
                Try again
              </button>
              <button
                type="button"
                class="c22-button c22-button--quiet"
                @click="sendViaCustomerWhatsApp"
              >
                <WhatsAppIcon />
                Send on WhatsApp instead
              </button>
            </div>
          </div>

          <p class="reassure">{{ reassurance }}</p>
        </div>

        <div class="summary-column">
          <QuoteSummary />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.booking {
  padding-bottom: 92px;
  scroll-margin-top: 90px;
}

.shell {
  max-width: 1120px;
  margin-inline: auto;
}

.intro {
  max-width: 34em;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 20px;
  margin-top: 34px;
  align-items: start;
}

.form-card {
  background: var(--c22-surface);
  border-radius: var(--c22-radius-panel);
  padding: clamp(20px, 3vw, 32px);
  box-shadow: var(--c22-shadow-flat);
}

.restored {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--c22-teal-dark);
}

.running-total {
  display: none;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 11px;
  background: var(--c22-tint);
}

.running-total-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c22-teal-dark);
}

.running-total-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--c22-ink);
}

.running-total-note {
  margin-left: auto;
  font-size: 12px;
  color: var(--c22-muted);
}

.panel {
  margin-top: 24px;
}

.panel:focus-visible {
  outline: 3px solid var(--c22-focus);
  outline-offset: 8px;
  border-radius: 12px;
}

.panel-head {
  margin-bottom: 20px;
}

.panel-count {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c22-teal-dark);
}

.panel-title {
  margin: 6px 0 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.panel-hint {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--c22-muted);
}

.blocked {
  margin: 20px 0 0;
  padding: 12px 14px;
  border-radius: 11px;
  background: var(--c22-danger-bg);
  color: var(--c22-danger);
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.grow {
  flex: 1 1 220px;
}

.spinner {
  width: 16px;
  height: 16px;
  flex: none;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.failed {
  margin: 20px 0 0;
  padding: 16px 18px;
  border-radius: 13px;
  background: var(--c22-danger-bg);
  border: 1.5px solid var(--c22-danger);
}

.failed-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--c22-danger);
}

.failed-body {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--c22-ink);
  text-wrap: pretty;
}

.failed-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.reassure {
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--c22-muted);
  text-wrap: pretty;
}

.summary-column {
  position: sticky;
  top: 90px;
}

@media (max-width: 940px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  /* Stacked, a half-empty summary above the form just pushes it off screen.
     The form leads, the full breakdown follows, and the total rides along. */
  .summary-column {
    position: static;
  }

  .running-total {
    display: flex;
  }
}
</style>
