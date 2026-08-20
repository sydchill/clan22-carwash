<script setup lang="ts">
/**
 * Label + control + helper/error, wired up for screen readers.
 * The error owns aria-describedby when present so it is read instead of the
 * helper text, and carries role="alert" so it is announced when it appears.
 */
defineProps<{
  id: string
  label: string
  helper?: string
  error?: string
  optional?: boolean
}>()
</script>

<template>
  <div class="field">
    <label class="field-label" :for="id">
      {{ label }}
      <span v-if="optional" class="field-optional">optional</span>
    </label>

    <slot :described-by="error ? `${id}-error` : helper ? `${id}-helper` : undefined" :invalid="Boolean(error)" />

    <p v-if="error" :id="`${id}-error`" class="field-error" role="alert">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5" stroke-linecap="round" />
        <path d="M12 16.2h.01" stroke-linecap="round" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="helper" :id="`${id}-helper`" class="field-helper">{{ helper }}</p>
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: 7px;
  /* Fields sit side by side in a stretched grid row. Without this, a field with
     no helper text has fewer auto tracks to fill the row height, so the spare
     space lands between its label and control — pushing that input down and
     stretching it taller than its neighbour. Pin the tracks to their content
     and every control in the row lines up. */
  align-content: start;
  align-items: start;
}

.field-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--c22-ink);
}

.field-optional {
  font-size: 12px;
  font-weight: 400;
  color: var(--c22-faint);
}

.field-helper {
  font-size: 13px;
  line-height: 1.5;
  color: var(--c22-muted);
}

.field-error {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--c22-danger);
}

.field-error svg {
  flex: none;
  margin-top: 1px;
}
</style>
