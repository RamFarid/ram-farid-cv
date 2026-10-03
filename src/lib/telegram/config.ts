import 'server-only'

// Secrets live in .env (template: .env.example). See docs/contact.md#telegram-notification

/** The bot and the "Contact Notifications" group it posts to, or null when either is unset. */
export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const contactChatId = process.env.TELEGRAM_CONTACT_CHAT_ID
  if (!token || !contactChatId) return null
  return { token, contactChatId }
}
