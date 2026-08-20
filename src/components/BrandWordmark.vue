<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * The "Clan22 CARWASH" lockup. Supplied artwork living in `public/`, so the src
 * is bound rather than literal — Vite resolves literal template `src` values at
 * build time, which would tie the build to files the owner supplies.
 *
 * Two colourways ship: the default for light surfaces, and a reversed one whose
 * "Clan" and "CARWASH" are white, for the navy panels.
 *
 * Height is the control and the intrinsic aspect ratio is declared, so the
 * lockup can never be stretched and its box is reserved before the image loads.
 *
 * If the file is missing the image is swapped for the name set in DM Sans, so a
 * missing asset degrades to a plain wordmark, not a broken-image icon.
 */
const props = withDefaults(
  defineProps<{ height?: number; variant?: 'dark' | 'light' }>(),
  { height: 30, variant: 'dark' },
)

/** Intrinsic size of the trimmed artwork; both colourways share it. */
const ARTWORK_WIDTH = 1153
const ARTWORK_HEIGHT = 187

const src = computed(() =>
  props.variant === 'light' ? '/logo-wordmark-light.png' : '/logo-wordmark.png',
)
const width = computed(() => Math.round((props.height * ARTWORK_WIDTH) / ARTWORK_HEIGHT))

const failed = ref(false)
</script>

<template>
  <span
    v-if="failed"
    class="fallback"
    :class="{ 'fallback--light': variant === 'light' }"
    :style="{ fontSize: `${height * 0.66}px` }"
  >
    Clan<span class="fallback-accent">22</span> Carwash
  </span>
  <img
    v-else
    class="wordmark"
    :src="src"
    :width="width"
    :height="height"
    alt="Clan22 Carwash"
    decoding="async"
    @error="failed = true"
  />
</template>

<style scoped>
.wordmark {
  display: block;
  height: auto;
  max-width: 100%;
  /* Declared so the row keeps its height while the image is still loading. */
  aspect-ratio: 1153 / 187;
}

.fallback {
  display: block;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--c22-deep);
  white-space: nowrap;
}

.fallback-accent {
  color: var(--c22-teal);
}

.fallback--light {
  color: #ffffff;
}

.fallback--light .fallback-accent {
  color: var(--c22-teal-light);
}
</style>
