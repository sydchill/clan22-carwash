<script setup lang="ts">
import { computed } from 'vue'
import { formatDateKeyLong, formatDuration, formatRand } from '../../lib/format'
import { EARLIEST_SLOT } from '../../lib/schedule'
import { useBookingForm } from '../../composables/useBookingForm'

const { form, quote, selectedVehicle } = useBookingForm()

const whenLabel = computed(() => {
  if (!form.dateKey) return 'Not picked yet'
  const day = formatDateKeyLong(form.dateKey)
  return form.time === EARLIEST_SLOT ? `${day}, earliest you can` : `${day} at ${form.time}`
})

const whereLabel = computed(() => {
  const parts = [form.street.trim(), form.suburb].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Not filled in yet'
})

const vehicleLabel = computed(() => {
  if (!selectedVehicle.value) return 'Not picked yet'
  const detail = form.vehicleDetail.trim()
  return detail ? `${selectedVehicle.value.label} — ${detail}` : selectedVehicle.value.label
})
</script>

<template>
  <aside class="summary" aria-labelledby="quote-heading">
    <h3 id="quote-heading" class="summary-title">Your booking</h3>

    <dl class="lines">
      <div v-for="line in quote.lines" :key="line.label" class="line">
        <dt>{{ line.label }}</dt>
        <dd>{{ formatRand(line.amount) }}</dd>
      </div>
    </dl>

    <div class="total">
      <span class="total-label">Total</span>
      <span class="total-value" aria-live="polite">{{ formatRand(quote.total) }}</span>
    </div>
    <p class="total-note">{{ formatDuration(quote.minutes) }} on site · pay cash or e-wallet after</p>

    <dl class="facts">
      <div class="fact">
        <dt>Vehicle</dt>
        <dd>{{ vehicleLabel }}</dd>
      </div>
      <div class="fact">
        <dt>When</dt>
        <dd>{{ whenLabel }}</dd>
      </div>
      <div class="fact">
        <dt>Where</dt>
        <dd>{{ whereLabel }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.summary {
  --c22-focus: var(--c22-focus-on-dark);
  background: var(--c22-deep);
  color: #ffffff;
  border-radius: 16px;
  padding: 24px 22px;
}

.summary-title {
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c22-teal-light);
}

.lines {
  display: grid;
  gap: 9px;
  margin: 0;
}

.line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  font-size: 14px;
}

.line dt {
  color: var(--c22-on-deep);
  text-wrap: pretty;
}

.line dd {
  margin: 0;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.total-label {
  font-size: 14px;
  font-weight: 700;
}

.total-value {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.total-note {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--c22-on-deep-soft);
}

.facts {
  display: grid;
  gap: 12px;
  margin: 20px 0 0;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.fact dt {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c22-on-deep-soft);
}

.fact dd {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.45;
  text-wrap: pretty;
}
</style>
