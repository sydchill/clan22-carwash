<script setup lang="ts">
import { computed } from 'vue'

/**
 * The Clan22 lettermark: "22" on a navy tile.
 *
 * Real text, so changing it is a one-word edit. Everything is derived from
 * `size` — the old version hardcoded a 12px glyph and a 7px radius, so the
 * footer mark at 22px was out of proportion with the header's 26px.
 *
 * The favicons do NOT reuse this component. Nothing outside the page loads
 * DM Sans, so those are rasterised from the real font ahead of time — see the
 * brand section of the README.
 *
 * Decorative by default: the wordmark sits beside it in the header and footer,
 * so announcing it again would only repeat the brand name.
 */
const props = withDefaults(defineProps<{ size?: number; label?: string }>(), {
  size: 26,
  label: '',
})

/** Ratios taken from the original 26px mark, so it scales without redrawing. */
const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: `${(props.size * 0.27).toFixed(2)}px`,
  fontSize: `${(props.size * 0.46).toFixed(2)}px`,
}))
</script>

<template>
  <span
    class="mark"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    >22</span
  >
</template>

<style scoped>
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  background: var(--c22-deep);
  color: #ffffff;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  /* The tile must not inherit the page's tabular figures or tracking. */
  font-variant-numeric: normal;
}
</style>
