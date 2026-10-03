import 'server-only'

export type TelegramButton = { text: string; url: string }

type SendMessageInput = {
  token: string
  chatId: string
  /** Telegram's HTML subset (https://core.telegram.org/bots/api#html-style); escape user text with `escapeTelegramHtml`. */
  html: string
  /** One row of URL buttons. Telegram accepts only http(s):// and tg:// URLs, and rejects localhost. */
  buttons?: TelegramButton[]
}

/** Telegram's limit for one message, counted after entities are parsed. */
export const telegramMessageLimit = 4096

export function escapeTelegramHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/** https://core.telegram.org/bots/api#sendmessage. Throws when Telegram refuses the message. */
export async function sendTelegramMessage({ token, chatId, html, buttons }: SendMessageInput) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      ...(buttons?.length && { reply_markup: { inline_keyboard: [buttons] } }),
    }),
    signal: AbortSignal.timeout(10_000),
  })

  const result = (await response.json().catch(() => null)) as { ok: boolean; description?: string } | null
  if (!result?.ok) {
    throw new Error(`Telegram sendMessage failed (${response.status}): ${result?.description ?? 'no response body'}`)
  }
}
