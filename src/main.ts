import { createApp } from 'vue'
import './style.css'

/**
 * Config is validated at import time, so a missing .env value throws before the
 * app exists. Import the root lazily and catch that, otherwise the only symptom
 * is a blank page and whoever deployed the site has to open devtools to find
 * out why.
 */
async function start(): Promise<void> {
  try {
    const { default: App } = await import('./App.vue')
    createApp(App).mount('#app')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(error)
    const root = document.getElementById('app')
    if (root) {
      const panel = document.createElement('div')
      panel.setAttribute('role', 'alert')
      panel.style.cssText =
        'max-width:34em;margin:12vh auto;padding:28px;border-radius:16px;' +
        'background:#fff;box-shadow:0 1px 3px rgba(11,58,69,.14);' +
        "font-family:'DM Sans',system-ui,sans-serif;color:#0e2a32;line-height:1.6"
      const heading = document.createElement('h1')
      heading.textContent = 'This site is not configured yet'
      heading.style.cssText = 'margin:0 0 10px;font-size:22px;letter-spacing:-.02em'
      const detail = document.createElement('p')
      detail.textContent = message
      detail.style.cssText = 'margin:0;font-size:15px;color:#56757b'
      panel.append(heading, detail)
      root.replaceChildren(panel)
    }
  }
}

void start()
