<script setup lang="ts">
import FormField from '../ui/FormField.vue'
import { useBookingForm } from '../../composables/useBookingForm'

const { form, suburbs, visibleError, markTouched } = useBookingForm()
</script>

<template>
  <div class="step">
    <div class="pair">
      <FormField id="booking-name" label="Your name" :error="visibleError('name')">
        <template #default="{ describedBy, invalid }">
          <input
            id="booking-name"
            v-model="form.name"
            class="c22-input"
            type="text"
            autocomplete="given-name"
            enterkeyhint="next"
            placeholder="Thabo"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
            @blur="markTouched('name')"
          />
        </template>
      </FormField>

      <FormField
        id="booking-phone"
        label="Your WhatsApp number"
        helper="So I can confirm the slot with you."
        :error="visibleError('phone')"
      >
        <template #default="{ describedBy, invalid }">
          <input
            id="booking-phone"
            v-model="form.phone"
            class="c22-input"
            type="tel"
            inputmode="tel"
            autocomplete="tel-national"
            enterkeyhint="next"
            placeholder="073 000 0000"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
            @blur="markTouched('phone')"
          />
        </template>
      </FormField>
    </div>

    <FormField
      id="booking-suburb"
      label="Area"
      helper="Travel is free inside the areas I cover."
      :error="visibleError('suburb')"
    >
      <template #default="{ describedBy, invalid }">
        <select
          id="booking-suburb"
          v-model="form.suburb"
          class="c22-select"
          autocomplete="address-level2"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
          @blur="markTouched('suburb')"
        >
          <option value="" disabled>Choose your area</option>
          <option v-for="suburb in suburbs" :key="suburb" :value="suburb">{{ suburb }}</option>
        </select>
      </template>
    </FormField>

    <FormField id="booking-street" label="Street and number" :error="visibleError('street')">
      <template #default="{ describedBy, invalid }">
        <input
          id="booking-street"
          v-model="form.street"
          class="c22-input"
          type="text"
          autocomplete="street-address"
          enterkeyhint="next"
          placeholder="14 Acacia Road, Unit 3"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
          @blur="markTouched('street')"
        />
      </template>
    </FormField>

    <FormField
      id="booking-notes"
      label="Anything I should know"
      helper="Where I can fill water — I use a tap at your place — plus gate codes, parking and pets."
      optional
    >
      <template #default="{ describedBy }">
        <textarea
          id="booking-notes"
          v-model="form.notes"
          class="c22-textarea"
          rows="3"
          :aria-describedby="describedBy"
          placeholder="Tap is at the side of the house. Gate code 1234, park in visitor bay 6."
        ></textarea>
      </template>
    </FormField>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  gap: 20px;
}

.pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
  gap: 20px;
}
</style>
