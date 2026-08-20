<script setup lang="ts">
/**
 * Stand-in for the design canvas' <image-slot>. Renders a photo when `src` is
 * set and an empty-state caption when it isn't, so the layout holds its shape
 * before the real photography lands.
 */
defineProps<{
  src?: string
  alt?: string
  placeholder?: string
}>()
</script>

<template>
  <img v-if="src" class="slot-image" :src="src" :alt="alt ?? ''" />
  <div v-else class="slot-empty">
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M3.5 16.5 8.8 12l3.7 3.2 3-2.6 4.9 4.3" />
    </svg>
    <span v-if="placeholder">{{ placeholder }}</span>
  </div>
</template>

<style scoped>
.slot-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slot-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  color: var(--c22-faint);
  font-size: 14px;
  line-height: 1.5;
}
</style>
