<script setup lang="ts">
/**
 * A radio or checkbox rendered as a full-width tappable card. The native input
 * stays in the DOM (visually hidden, not display:none) so keyboard navigation,
 * arrow keys within a radio group, and screen readers all behave normally.
 */
defineProps<{
  type: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  title: string
  detail?: string
  /** Price or duration shown alongside the title. */
  meta?: string
  metaNote?: string
  /**
   * Where the meta sits. 'end' pushes it to the right edge, which suits wide
   * cards. 'below' tucks it under the title — use it on compact cards, where a
   * right-aligned price either collides with the label or strands it across a
   * gap of empty space.
   */
  metaPlacement?: 'end' | 'below'
}>()

defineEmits<{ change: [value: string] }>()
</script>

<template>
  <label class="option" :class="{ 'option--checked': checked }">
    <input
      class="option-input"
      :type="type"
      :name="name"
      :value="value"
      :checked="checked"
      @change="$emit('change', value)"
    />
    <span class="option-indicator" :class="`option-indicator--${type}`" aria-hidden="true">
      <svg v-if="type === 'checkbox'" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 8.4 6.3 11.7 13 5" />
      </svg>
    </span>
    <span class="option-text">
      <span class="option-title">{{ title }}</span>
      <span v-if="detail" class="option-detail">{{ detail }}</span>
      <span v-if="meta && metaPlacement === 'below'" class="option-meta option-meta--below">
        <span class="option-meta-value">{{ meta }}</span>
        <span v-if="metaNote" class="option-meta-note">{{ metaNote }}</span>
      </span>
    </span>
    <span v-if="meta && metaPlacement !== 'below'" class="option-meta">
      <span class="option-meta-value">{{ meta }}</span>
      <span v-if="metaNote" class="option-meta-note">{{ metaNote }}</span>
    </span>
  </label>
</template>

<style scoped>
.option {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  min-height: 56px;
  padding: 15px 16px;
  border: 1.5px solid var(--c22-border);
  border-radius: 13px;
  background: var(--c22-surface);
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.option:hover {
  border-color: var(--c22-teal-light);
}

.option--checked {
  border-color: var(--c22-teal);
  background: var(--c22-tint);
  box-shadow: inset 0 0 0 1px var(--c22-teal);
}

/* Visually hidden, but still focusable and readable by assistive tech. */
.option-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.option:focus-within {
  outline: 3px solid var(--c22-focus);
  outline-offset: 2px;
}

.option-indicator {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--c22-border-strong);
  background: var(--c22-surface);
  color: transparent;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}

.option-indicator--radio {
  border-radius: 50%;
}

.option-indicator--checkbox {
  border-radius: 6px;
}

.option--checked .option-indicator {
  border-color: var(--c22-teal);
  background: var(--c22-teal);
  color: #ffffff;
}

.option-indicator--radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  transform: scale(0);
  transition: transform 150ms ease;
}

.option--checked .option-indicator--radio::after {
  transform: scale(1);
}

.option-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.option-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--c22-ink);
  /* Last-resort guard for a long unbroken word. */
  overflow-wrap: anywhere;
}

.option-detail {
  font-size: 13px;
  line-height: 1.5;
  color: var(--c22-muted);
  text-wrap: pretty;
}

.option-meta {
  flex: 0 0 auto;
  margin-left: auto;
  padding-left: 8px;
  display: grid;
  gap: 2px;
  justify-items: end;
  text-align: right;
}

.option-meta--below {
  margin-left: 0;
  padding-left: 0;
  justify-items: start;
  text-align: left;
  margin-top: 2px;
}

.option-meta--below .option-meta-value {
  font-size: 15px;
}

.option-meta-value {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--c22-teal-dark);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.option-meta-note {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c22-faint);
  white-space: nowrap;
}
</style>
