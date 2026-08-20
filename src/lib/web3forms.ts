/**
 * Web3Forms turns a form POST into an email. The access key is public by
 * design — it only ever routes mail to the address it was issued for, so it is
 * safe in frontend code, unlike a messaging API token.
 *
 * Free tier: 250 submissions a month.
 */
const ENDPOINT = 'https://api.web3forms.com/submit'

export interface Web3FormsPayload {
  access_key: string
  subject: string
  from_name: string
  /** Rendered as the body of the notification email. */
  message: string
  /** Honeypot: real people leave it empty, bots fill it in. */
  botcheck?: string
  [field: string]: string | undefined
}

export interface Web3FormsResult {
  ok: boolean
  /** Message from the API, shown only in the console — never to the customer. */
  detail?: string
}

export async function submitToWeb3Forms(payload: Web3FormsPayload): Promise<Web3FormsResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null

    if (response.ok && body?.success) return { ok: true }
    return { ok: false, detail: body?.message ?? `HTTP ${response.status}` }
  } catch (error) {
    // Offline, DNS failure, blocked by an extension — all land here.
    return { ok: false, detail: error instanceof Error ? error.message : 'Network error' }
  }
}
