import 'server-only'
import type { Locale } from 'next-intl'
import { insertContactMsg } from '@/lib/db/contact'
import { siteUrl } from '@/lib/seo/site'
import { escapeTelegramHtml, sendTelegramMessage, type TelegramButton, telegramMessageLimit } from '@/lib/telegram'
import { getTelegramConfig } from '@/lib/telegram/config'
import type { ContactInput } from '@/lib/validations/contact'
import type { ContactMessage } from './types'

/** Stores a validated submission. The visitor's language is kept so the reply can be in it. */
export async function saveContactMessage(input: ContactInput, locale: Locale): Promise<ContactMessage> {
  const id = await insertContactMsg({ ...input, locale })
  return { ...input, id, locale }
}

const localeNames: Record<Locale, string> = { en: 'English', ar: 'Arabic' }

// Room left for the header lines and the truncation note under Telegram's limit.
const messagePreviewLength = telegramMessageLimit - 600

/**
 * Posts a new message to the "Contact Notifications" Telegram group. Email and phone are plain text (Telegram makes both
 * tappable); the buttons are WhatsApp (with a phone) and Show in console. See docs/contact.md#telegram-notification
 */
export async function notifyContactMessage(message: ContactMessage) {
  const config = getTelegramConfig()
  if (!config) {
    console.warn(`Telegram is not configured; no notification for contact message ${message.id}.`)
    return
  }

  const body =
    message.message.length > messagePreviewLength
      ? `${message.message.slice(0, messagePreviewLength)}…\n\n(Cut short: the full message is in the console.)`
      : message.message

  const html = [
    '<b>New message from the site</b>',
    '',
    `<b>Name:</b> ${escapeTelegramHtml(message.name)}`,
    `<b>Email:</b> ${escapeTelegramHtml(message.email)}`,
    message.phone && `<b>Phone:</b> ${escapeTelegramHtml(message.phone)}`,
    `<b>Language:</b> ${localeNames[message.locale]}`,
    '',
    `<blockquote expandable>${escapeTelegramHtml(body)}</blockquote>`,
  ]
    .filter((line) => line !== undefined)
    .join('\n')

  const buttons: TelegramButton[] = []
  if (message.phone) buttons.push({ text: 'WhatsApp', url: `https://wa.me/${whatsappNumber(message.phone)}` })
  buttons.push({ text: 'Show in console', url: `${siteUrl}/console/messages/${message.id}` })

  await sendTelegramMessage({ token: config.token, chatId: config.contactChatId, html, buttons })
}

// wa.me wants the international number as digits only: "+20 100-000 0000" and "0020 100 000 0000" both become 201000000000.
function whatsappNumber(phone: string) {
  return phone.replace(/\D/g, '').replace(/^00/, '')
}
