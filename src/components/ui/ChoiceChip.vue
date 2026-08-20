<script setup lang="ts">
/** A compact single-select chip, used for dates and time slots. */
defineProps<{
  label: string
  sublabel?: string
  selected: boolean
}>()
</script>

<template>
  <button type="button" class="chip" :class="{ 'chip--selected': selected }" :aria-pressed="selected">
    <span class="chip-label">{{ label }}</span>
    <span v-if="sublabel" class="chip-sub">{{ sublabel }}</span>
  </button>
</template>

<style scoped>
.chip {
  display: grid;
  gap: 1px;
  justify-items: center;
  min-height: 46px;
  padding: 9px 14px;
  border: 1.5px solid var(--c22-border);
  border-radius: 11px;
  background: var(--c22-surface);
  color: var(--c22-ink);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}

.chip:hover {
  border-color: var(--c22-teal-light);
}

.chip:focus-visible {
  outline: 3px solid var(--c22-focus);
  outline-offset: 2px;
}

.chip--selected {
  border-color: var(--c22-teal-cta);
  background: var(--c22-teal-cta);
  color: #ffffff;
}

.chip-sub {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.75;
}
</style>
