<script setup lang="ts">
import { computed } from 'vue'
import ChoiceChip from '../ui/ChoiceChip.vue'
import FormField from '../ui/FormField.vue'
import { formatDateKey, formatDuration, toDateKey } from '../../lib/format'
import { BOOKING_WINDOW_DAYS, EARLIEST_SLOT, bookingDateRange, hoursLabel, slotsForDate } from '../../lib/schedule'
import { useBookingForm } from '../../composables/useBookingForm'

const { form, quote, availableSlots, visibleError, markTouched } = useBookingForm()

const range = bookingDateRange()

/** The next few days as one-tap chips; the date input covers anything further out. */
const quickDates = computed(() => {
  const out: { key: string; label: string; sublabel: string; disabled: boolean }[] = []
  const cursor = new Date()
  for (let i = 0; i < 5 && i <= BOOKING_WINDOW_DAYS; i += 1) {
    const key = toDateKey(cursor)
    const slots = slotsForDate(key, quote.value.minutes)
    out.push({
      key,
      label: formatDateKey(key),
      sublabel: slots.length > 0 ? `${slots.length} slots` : 'Full',
      disabled: slots.length === 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
})

function pickDate(key: string): void {
  form.dateKey = key
  markTouched('dateKey')
  if (form.time !== EARLIEST_SLOT && !slotsForDate(key, quote.value.minutes).includes(form.time)) {
    form.time = EARLIEST_SLOT
  }
}

function pickTime(time: string): void {
  form.time = time
  markTouched('time')
}
</script>

<template>
  <div class="step">
    <fieldset class="group">
      <legend class="group-legend">Which day?</legend>
      <div class="chips">
        <ChoiceChip
          v-for="day in quickDates"
          :key="day.key"
          :label="day.label"
          :sublabel="day.sublabel"
          :selected="form.dateKey === day.key"
          :disabled="day.disabled"
          :class="{ 'chip-disabled': day.disabled }"
          @click="!day.disabled && pickDate(day.key)"
        />
      </div>

      <div class="date-input">
        <FormField
          id="booking-date"
          label="Or pick another date"
          :helper="form.dateKey ? hoursLabel(form.dateKey) : undefined"
          :error="visibleError('dateKey')"
        >
          <template #default="{ describedBy, invalid }">
            <input
              id="booking-date"
              class="c22-input"
              type="date"
              :value="form.dateKey"
              :min="range.min"
              :max="range.max"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
              @change="pickDate(($event.target as HTMLInputElement).value)"
              @blur="markTouched('dateKey')"
            />
          </template>
        </FormField>
      </div>
    </fieldset>

    <fieldset class="group">
      <legend class="group-legend">
        What time should I start?
        <span class="group-legend-note">{{ formatDuration(quote.minutes).toLowerCase() }} on site</span>
      </legend>

      <p v-if="visibleError('time')" class="group-error" role="alert">{{ visibleError('time') }}</p>

      <div class="chips">
        <ChoiceChip
          label="Earliest you can"
          :selected="form.time === EARLIEST_SLOT"
          @click="pickTime(EARLIEST_SLOT)"
        />
        <ChoiceChip
          v-for="slot in availableSlots"
          :key="slot"
          :label="slot"
          :selected="form.time === slot"
          @click="pickTime(slot)"
        />
      </div>

      <p v-if="availableSlots.length === 0" class="empty" role="status">
        Nothing left on that day once this wash is fitted in. Try the next day.
      </p>
    </fieldset>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  gap: 26px;
}

.group {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.group-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--c22-ink);
}

.group-legend-note {
  font-size: 12px;
  font-weight: 400;
  color: var(--c22-faint);
}

.group-error {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c22-danger);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.date-input {
  margin-top: 18px;
  max-width: 320px;
}

.empty {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--c22-muted);
}
</style>
