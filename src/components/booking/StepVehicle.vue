<script setup lang="ts">
import FormField from '../ui/FormField.vue'
import OptionCard from '../ui/OptionCard.vue'
import { formatRand, formatRandDelta } from '../../lib/format'
import { largeVehicleSurcharge } from '../../content'
import { useBookingForm } from '../../composables/useBookingForm'

const { form, vehicleTypes, visibleError, markTouched } = useBookingForm()
</script>

<template>
  <div class="step">
    <fieldset class="group">
      <legend class="group-legend">What are you driving?</legend>
      <p class="group-hint">
        Quoted prices are for hatchbacks and sedans. Anything bigger adds
        {{ formatRand(largeVehicleSurcharge) }}, and the total updates as you pick.
      </p>
      <p v-if="visibleError('vehicleId')" class="group-error" role="alert">
        {{ visibleError('vehicleId') }}
      </p>
      <div class="grid">
        <OptionCard
          v-for="vehicle in vehicleTypes"
          :key="vehicle.id"
          type="radio"
          name="booking-vehicle"
          :value="vehicle.id"
          :checked="form.vehicleId === vehicle.id"
          :title="vehicle.label"
          :meta="vehicle.surcharge > 0 ? formatRandDelta(vehicle.surcharge) : 'No extra'"
          meta-placement="below"
          @change="form.vehicleId = $event"
        />
      </div>
    </fieldset>

    <FormField
      id="booking-vehicle-detail"
      label="Make, model or colour"
      helper="Helps me spot the car in a full driveway or a complex."
      optional
    >
      <input
        id="booking-vehicle-detail"
        v-model="form.vehicleDetail"
        class="c22-input"
        type="text"
        autocomplete="off"
        placeholder="Silver Polo Vivo"
        @blur="markTouched('vehicleDetail')"
      />
    </FormField>
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
  padding: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--c22-ink);
}

.group-hint {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--c22-muted);
}

.group-error {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c22-danger);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 10px;
}
</style>
