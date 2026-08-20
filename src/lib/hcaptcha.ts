/**
 * hCaptcha explicit-render loader.
 *
 * The script is fetched on demand rather than in `index.html`: it is a
 * third-party request, and most visitors never reach the step that needs it.
 *
 * Explicit mode requires waiting for the SDK's own onload callback before
 * calling render — calling it earlier races the SDK's setup.
 */
export interface HCaptchaRenderOptions {
  sitekey: string
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  /** Fired with the token once the challenge is passed. */
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  'chalexpired-callback'?: () => void
}

export interface HCaptchaApi {
  render(container: HTMLElement, options: HCaptchaRenderOptions): string
  reset(widgetId?: string): void
  remove(widgetId?: string): void
  getResponse(widgetId?: string): string
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi
    __clan22HcaptchaReady?: () => void
  }
}

const CALLBACK_NAME = '__clan22HcaptchaReady'
const SCRIPT_SRC = `https://js.hcaptcha.com/1/api.js?render=explicit&onload=${CALLBACK_NAME}`

let pending: Promise<HCaptchaApi> | null = null

export function loadHCaptcha(): Promise<HCaptchaApi> {
  if (pending) return pending

  pending = new Promise<HCaptchaApi>((resolve, reject) => {
    if (window.hcaptcha) {
      resolve(window.hcaptcha)
      return
    }

    window[CALLBACK_NAME] = () => {
      if (window.hcaptcha) resolve(window.hcaptcha)
      else reject(new Error('hCaptcha loaded without an API'))
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onerror = () => {
      // Let a later attempt retry: an ad blocker or a dropped connection
      // should not poison the loader for the rest of the session.
      pending = null
      reject(new Error('hCaptcha script failed to load'))
    }
    document.head.appendChild(script)
  })

  return pending
}
