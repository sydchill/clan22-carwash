<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Sticky shortcut to the booking form. It hides itself while the form is on
 * screen — a button that scrolls you to what you are already looking at is
 * just clutter over the fields.
 */
const visible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const target = document.getElementById('book')
  if (!target) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = !entry?.isIntersecting
    },
    // Shrink the root to a band across the middle of the screen, so the pill
    // only disappears once the form is genuinely what you are looking at.
    { rootMargin: '-45% 0px -45% 0px' },
  )
  observer.observe(target)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <Transition name="float">
    <a v-if="visible" class="float" href="#book">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4.8" width="18" height="16.2" rx="2.6" />
        <path d="M3 9.6h18M8 3v3.6M16 3v3.6" />
        <path d="M8.6 14.4l2.2 2.2 4.4-4.4" />
      </svg>
      Book a wash
    </a>
  </Transition>
</template>

<style scoped>
.float {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 48px;
  background: var(--c22-teal-cta);
  color: #ffffff;
  padding: 14px 22px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 15px;
  box-shadow: var(--c22-shadow-float);
  transition: background-color 150ms ease;
}

.float:hover {
  background: var(--c22-deep);
  color: #ffffff;
}

.float-enter-active,
.float-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 560px) {
  .float {
    right: 16px;
    bottom: 16px;
    left: 16px;
    justify-content: center;
  }
}
</style>
