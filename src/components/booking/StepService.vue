<script setup lang="ts">
import OptionCard from '../ui/OptionCard.vue'
import { formatDuration, formatRand, formatRandDelta } from '../../lib/format'
import { useBookingForm } from '../../composables/useBookingForm'

const { form, services, addOns, toggleAddOn, visibleError } = useBookingForm()
</script>

<template>
  <div class="step">
    <fieldset class="group">
      <legend class="group-legend">Choose a wash</legend>
      <p v-if="visibleError('serviceId')" class="group-error" role="alert">
        {{ visibleError('serviceId') }}
      </p>
      <div class="stack">
        <OptionCard
          v-for="service in services"
          :key="service.id"
          type="radio"
          name="booking-service"
          :value="service.id"
          :checked="form.serviceId === service.id"
          :title="service.name"
          :detail="service.detail"
          :meta="formatRand(service.price)"
          :meta-note="formatDuration(service.minutes).replace('About ', '')"
          @change="form.serviceId = $event"
        />
      </div>
    </fieldset>

    <fieldset class="group">
      <legend class="group-legend">
        Add anything extra?
        <span class="group-legend-note">Optional</span>
      </legend>
      <div class="stack stack--tight">
        <OptionCard
          v-for="addOn in addOns"
          :key="addOn.id"
          type="checkbox"
          name="booking-addons"
          :value="addOn.id"
          :checked="form.addOnIds.includes(addOn.id)"
          :title="addOn.label"
          :meta="formatRandDelta(addOn.price)"
          @change="toggleAddOn($event)"
        />
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  gap: 28px;
}

.group {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.group-legend {
  display: flex;
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

.stack {
  display: grid;
  gap: 10px;
}

.stack--tight {
  grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
}
</style>
