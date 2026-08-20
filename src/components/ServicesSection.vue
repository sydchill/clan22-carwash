<script setup lang="ts">
import { computed } from 'vue'
import { addOns, largeVehicleSurcharge, services } from '../content'
import { siteConfig } from '../site.config'
import { formatDuration, formatRand, formatRandDelta } from '../lib/format'
import { useBookingForm } from '../composables/useBookingForm'
import { waLink } from '../lib/contact'

const { form, chooseService } = useBookingForm()

const hasUnavailable = computed(() => services.some((service) => !service.available))

/** Send the customer to the booking form with this wash already selected. */
function bookService(id: string): void {
  chooseService(id)
  document.getElementById('book')?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <section id="services" class="c22-section services">
    <div class="intro">
      <div class="c22-eyebrow">Prices</div>
      <h2 class="c22-heading">Prices for cars and bakkies</h2>
      <p class="c22-lede">
        Prices below are for sedans and hatchbacks. SUVs, bakkies and minibuses add
        {{ formatRand(largeVehicleSurcharge) }}, which the booking form works out for you.
        <template v-if="hasUnavailable">
          Anything marked below is not on the booking form yet — I am still getting the kit together
          for it.
        </template>
      </p>
    </div>

    <div class="grid">
      <div
        v-for="service in services"
        :key="service.id"
        class="card"
        :class="{
          'card--selected': form.serviceId === service.id,
          'card--unavailable': !service.available,
        }"
      >
        <div class="card-price">{{ formatRand(service.price) }}</div>
        <div class="card-name">{{ service.name }}</div>
        <div class="c22-body">{{ service.detail }}</div>
        <div class="card-time">{{ formatDuration(service.minutes) }}</div>

        <button
          v-if="service.available"
          type="button"
          class="card-cta"
          @click="bookService(service.id)"
        >
          {{ form.serviceId === service.id ? 'Selected — go to booking' : 'Book this wash' }}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
          </svg>
        </button>

        <p v-else class="card-soon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.4V12l3 2" />
          </svg>
          <span>
            Not available yet —
            <a :href="waLink" target="_blank" rel="noopener">ask me on WhatsApp</a>
          </span>
        </p>
      </div>
    </div>

    <div v-if="siteConfig.showAddOns" class="add-ons">
      <span class="add-ons-label">Add on when you book:</span>
      <span v-for="addOn in addOns" :key="addOn.id" class="chip">
        {{ addOn.label }} {{ formatRandDelta(addOn.price) }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.services {
  padding-bottom: 92px;
  scroll-margin-top: 90px;
}

.intro {
  text-align: center;
  max-width: 34em;
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
  margin-top: 44px;
}

.card {
  background: var(--c22-surface);
  border-radius: var(--c22-radius-card);
  padding: 30px 26px;
  box-shadow: var(--c22-shadow-flat);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1.5px solid transparent;
  transition: border-color 150ms ease;
}

.card--selected {
  border-color: var(--c22-teal);
}

/* Still listed, so the price is known, but visibly not on the menu today. */
.card--unavailable {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--c22-border);
}

.card--unavailable .card-price,
.card--unavailable .card-name {
  color: var(--c22-muted);
}

.card-soon {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-height: 46px;
  margin: 6px 0 0;
  padding: 12px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--c22-muted);
}

.card-soon svg {
  flex: none;
  margin-top: 2px;
}

.card-soon a {
  color: var(--c22-teal-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.card-soon a:hover {
  color: var(--c22-deep);
}

.card-price {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--c22-teal);
  font-variant-numeric: tabular-nums;
}

.card-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.card-time {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c22-faint);
  margin-top: auto;
  padding-top: 16px;
}

.card-cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 46px;
  margin-top: 6px;
  padding: 12px 16px;
  border: 1.5px solid var(--c22-border);
  border-radius: var(--c22-radius-control);
  background: var(--c22-surface);
  color: var(--c22-ink);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.card-cta:hover {
  border-color: var(--c22-teal-cta);
  background: var(--c22-teal-cta);
  color: #ffffff;
}

.card--selected .card-cta {
  border-color: var(--c22-teal);
  background: var(--c22-tint);
  color: var(--c22-teal-dark);
}

.add-ons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-top: 26px;
}

.add-ons-label {
  font-size: 14px;
  color: var(--c22-muted);
}

.chip {
  background: var(--c22-tint);
  color: var(--c22-teal-dark);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
}
</style>
