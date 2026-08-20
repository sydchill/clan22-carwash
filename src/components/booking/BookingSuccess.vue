<script setup lang="ts">
import { formatRand } from '../../lib/format'
import { displayPhone } from '../../lib/contact'
import { useBookingForm } from '../../composables/useBookingForm'

const { quote, form, bookingLink, emailDeliveryEnabled, reset } = useBookingForm()
</script>

<template>
  <div class="done" role="status">
    <span class="done-icon" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12.5 9.5 18 20 7" />
      </svg>
    </span>

    <template v-if="emailDeliveryEnabled">
      <h3 class="done-title">Booking sent. I will confirm shortly.</h3>
      <p class="done-body">
        Your request is with me now. I reply on WhatsApp to
        <strong>{{ form.phone }}</strong> to lock the slot — usually within the hour during trading
        times. Nothing is charged until the wash is done.
      </p>
    </template>

    <template v-else>
      <h3 class="done-title">Your booking is waiting in WhatsApp</h3>
      <p class="done-body">
        The message is written out with your wash, your car, the time and the address. Press send in
        WhatsApp and I will reply to confirm the slot.
      </p>
    </template>

    <p class="done-total">Estimated total {{ formatRand(quote.total) }}, paid to me on the day.</p>

    <div class="done-actions">
      <button type="button" class="c22-button c22-button--primary" @click="reset">
        Book another car
      </button>
      <a
        v-if="!emailDeliveryEnabled"
        class="c22-button c22-button--quiet"
        :href="bookingLink"
        target="_blank"
        rel="noopener"
      >
        Open WhatsApp again
      </a>
    </div>

    <p class="done-fallback">
      Not heard from me? Message me directly on <strong>{{ displayPhone }}</strong>
    </p>
  </div>
</template>

<style scoped>
.done {
  margin-top: 34px;
  background: var(--c22-surface);
  border-radius: var(--c22-radius-panel);
  padding: clamp(28px, 4vw, 48px);
  box-shadow: var(--c22-shadow-flat);
  max-width: 40em;
}

.done-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--c22-tint);
  color: var(--c22-success);
}

.done-title {
  margin: 20px 0 0;
  font-size: clamp(22px, 2.6vw, 28px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.done-body {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--c22-muted);
  text-wrap: pretty;
}

.done-body strong {
  color: var(--c22-ink);
  white-space: nowrap;
}

.done-total {
  margin: 16px 0 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--c22-teal-dark);
}

.done-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.done-fallback {
  margin: 20px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--c22-muted);
}

.done-fallback strong {
  color: var(--c22-ink);
  white-space: nowrap;
}
</style>
