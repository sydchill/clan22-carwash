/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The number bookings and chats go to. Required — see .env.example. */
  readonly VITE_WHATSAPP_NUMBER: string
  /** Web3Forms access key. Empty falls back to the WhatsApp handoff. */
  readonly VITE_WEB3FORMS_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
