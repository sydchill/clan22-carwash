<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadHCaptcha, type HCaptchaApi } from '../../lib/hcaptcha'
import { siteConfig } from '../../site.config'

/**
 * The hCaptcha checkbox on the last step.
 *
 * The widget only mounts when this component does — i.e. when the customer
 * actually reaches the step — so the third-party script is never fetched for
 * the many visitors who only read the page.
 */
const props = defineProps<{
  error?: string
  /** Bumping this asks for a fresh challenge; tokens are single use. */
  resetSignal: number
}>()

const emit = defineEmits<{
  token: [value: string]
  unavailable: [reason: string]
}>()

const host = ref<HTMLElement | null>(null)
const status = ref<'loading' | 'ready' | 'unavailable'>('loading')

let api: HCaptchaApi | null = null
let widgetId: string | null = null

onMounted(async () => {
  try {
    api = await loadHCaptcha()
    if (!host.value) return
    widgetId = api.render(host.value, {
      sitekey: siteConfig.hcaptchaSitekey,
      theme: 'light',
      callback: (token: string) => emit('token', token),
      // A passed challenge goes stale after a couple of minutes, and a stale
      // token is rejected server-side — so drop it and make them redo it.
      'expired-callback': () => emit('token', ''),
      'chalexpired-callback': () => emit('token', ''),
      'error-callback': () => emit('token', ''),
    })
    status.value = 'ready'
  } catch (error) {
    status.value = 'unavailable'
    emit('unavailable', error instanceof Error ? error.message : 'unknown error')
  }
})

watch(
  () => props.resetSignal,
  () => {
    if (api && widgetId !== null) {
      api.reset(widgetId)
      emit('token', '')
    }
  },
)

onBeforeUnmount(() => {
  // Leaving the widget behind leaks an iframe every time the step is revisited.
  if (api && widgetId !== null) api.remove(widgetId)
})
</script>

<template>
  <div class="captcha">
    <p class="captcha-label">Quick spam check</p>

    <div v-show="status !== 'unavailable'" ref="host" class="captcha-host"></div>

    <p v-if="status === 'loading'" class="captcha-note">Loading the check…</p>

    <p v-else-if="status === 'unavailable'" class="captcha-note captcha-note--warn" role="alert">
      The spam check could not load — an ad blocker or a dropped connection will
      do it. Refresh the page, or send the booking straight to my WhatsApp with
      the button below.
    </p>

    <p v-else-if="error" class="captcha-error" role="alert">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5" stroke-linecap="round" />
        <path d="M12 16.2h.01" stroke-linecap="round" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.captcha {
  display: grid;
  gap: 8px;
}

.captcha-label {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--c22-ink);
}

/* The widget is a fixed-size iframe; reserve its height so ticking it does not
   shove the buttons underneath it. */
.captcha-host {
  min-height: 78px;
}

/* hCaptcha renders at a fixed 303x78 and cannot be told to shrink, so on narrow
   phones it escapes the card's padding and runs to the screen edge. Scale it
   down to fit and shrink the reserved height to match. */
@media (max-width: 480px) {
  .captcha-host {
    transform: scale(0.88);
    transform-origin: left top;
    min-height: 69px;
  }
}

@media (max-width: 360px) {
  .captcha-host {
    transform: scale(0.78);
    min-height: 61px;
  }
}

.captcha-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--c22-muted);
  text-wrap: pretty;
}

.captcha-note--warn {
  color: var(--c22-danger);
  font-weight: 500;
}

.captcha-error {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--c22-danger);
}

.captcha-error svg {
  flex: none;
  margin-top: 1px;
}
</style>
