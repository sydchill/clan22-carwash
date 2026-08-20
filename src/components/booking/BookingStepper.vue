<script setup lang="ts">
import { bookingSteps, useBookingForm } from '../../composables/useBookingForm'

const { stepIndex, goToStep, stepHasVisibleError } = useBookingForm()
</script>

<template>
  <ol class="stepper">
    <li v-for="(step, index) in bookingSteps" :key="step.id" class="stepper-item">
      <button
        type="button"
        class="stepper-button"
        :class="{
          'stepper-button--current': index === stepIndex,
          'stepper-button--done': index < stepIndex && !stepHasVisibleError(step.id),
          'stepper-button--error': stepHasVisibleError(step.id),
        }"
        :aria-current="index === stepIndex ? 'step' : undefined"
        @click="goToStep(index)"
      >
        <span class="stepper-index" aria-hidden="true">
          <svg
            v-if="index < stepIndex && !stepHasVisibleError(step.id)"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 8.4 6.3 11.7 13 5" />
          </svg>
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span class="stepper-label">
          <span class="c22-visually-hidden">Step {{ index + 1 }} of {{ bookingSteps.length }}: </span>
          {{ step.label }}
          <span v-if="stepHasVisibleError(step.id)" class="c22-visually-hidden">(needs attention)</span>
        </span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.stepper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.stepper-item {
  flex: 1 1 auto;
  min-width: 0;
}

.stepper-button {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1.5px solid var(--c22-border);
  border-radius: 11px;
  background: var(--c22-surface);
  color: var(--c22-muted);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}

.stepper-button:hover {
  border-color: var(--c22-teal-light);
  color: var(--c22-ink);
}

.stepper-index {
  flex: none;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--c22-tint);
  color: var(--c22-teal-dark);
  font-size: 12px;
  font-weight: 700;
}

.stepper-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stepper-button--done {
  border-color: var(--c22-tint);
  color: var(--c22-teal-dark);
}

.stepper-button--done .stepper-index {
  background: var(--c22-teal-cta);
  color: #ffffff;
}

.stepper-button--current {
  border-color: var(--c22-deep);
  background: var(--c22-deep);
  color: #ffffff;
  --c22-focus: var(--c22-focus-on-dark);
}

.stepper-button--current .stepper-index {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.stepper-button--current:hover {
  color: #ffffff;
}

.stepper-button--error {
  border-color: var(--c22-danger);
  color: var(--c22-danger);
}

.stepper-button--error .stepper-index {
  background: var(--c22-danger);
  color: #ffffff;
}

/* Labels drop off narrow screens visually, but stay in the accessibility tree
   so the step is still announced. */
@media (max-width: 520px) {
  .stepper-label {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .stepper-button {
    padding: 9px;
  }
}
</style>
