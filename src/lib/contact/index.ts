import 'server-only'
import { cache } from 'react'
import type { Locale } from 'next-intl'
import { isValidObjectId } from 'mongoose'
import {
  countContactMsgsByFilter,
  deleteArchivedContactMsg,
  findContactMsgById,
  findContactMsgs,
  insertContactMsg,
  updateContactMsgStatus,
  type InboxFilter,
} from '@/lib/db/contact'
import type { ContactMsgRecord } from '@/lib/db/models/ContactMsg'
import { siteUrl } from '@/lib/seo/site'
import { escapeTelegramHtml, sendTelegramMessage, type TelegramButton, telegramMessageLimit } from '@/lib/telegram'
import { getTelegramConfig } from '@/lib/telegram/config'
import type { ContactInput } from '@/lib/validations/contact'
import type { ContactMessage, InboxMessage, InboxStatus } from './types'

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
  if (message.phone) buttons.push({ text: 'WhatsApp', url: whatsappUrl(message.phone) })
  buttons.push({ text: 'Show in console', url: `${siteUrl}/console/contact-msgs/${message.id}` })

  await sendTelegramMessage({ token: config.token, chatId: config.contactChatId, html, buttons })
}

// wa.me wants the international number as digits only: "+20 100-000 0000" and "0020 100 000 0000" both become 201000000000.
function whatsappNumber(phone: string) {
  return phone.replace(/\D/g, '').replace(/^00/, '')
}

export function whatsappUrl(phone: string) {
  return `https://wa.me/${whatsappNumber(phone)}`
}

// The console's inbox. See docs/console.md#messages

// A personal site gets a few messages a week; the list shows the newest ones per filter.
const INBOX_LIMIT = 200

type StoredMsg = ContactMsgRecord & { _id: { toString(): string } }

function toInboxMessage(record: StoredMsg): InboxMessage {
  return {
    id: record._id.toString(),
    name: record.name,
    email: record.email,
    phone: record.phone || undefined,
    message: record.message,
    locale: record.locale,
    status: record.status,
    receivedAt: record.createdAt.toISOString(),
  }
}

export async function getInbox(filter: InboxFilter) {
  const records = await findContactMsgs(filter, INBOX_LIMIT)
  return records.map(toInboxMessage)
}

export function getInboxCounts() {
  return countContactMsgsByFilter()
}

/** One message, or null when the id is malformed or unknown. Deduped per request (metadata and page). */
export const getInboxMessage = cache(async (id: string) => {
  if (!isValidObjectId(id)) return null
  const record = await findContactMsgById(id)
  return record ? toInboxMessage(record) : null
})

export function setInboxStatus(id: string, status: InboxStatus) {
  return isValidObjectId(id) ? updateContactMsgStatus(id, status) : Promise.resolve(false)
}

export function deleteInboxMessage(id: string) {
  return isValidObjectId(id) ? deleteArchivedContactMsg(id) : Promise.resolve(false)
}
