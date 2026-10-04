import 'server-only'

// Secrets live in .env (template: .env.example). See docs/contact.md#telegram-notification and docs/console.md#sign-in

/** The bot and the "Contact Notifications" group it posts to, or null when either is unset. */
export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const contactChatId = process.env.TELEGRAM_CONTACT_CHAT_ID
  if (!token || !contactChatId) return null
  return { token, contactChatId }
}

/**
 * The console's chats: "Ram OTPs" receives sign-in codes, "Ram Ownership" receives owner notices such as a new sign-in.
 * Null when the bot or the OTP chat is unset, which turns console sign-in off. The owner chat is optional.
 */
export function getConsoleTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const otpChatId = process.env.TELEGRAM_OTP_CHAT_ID
  if (!token || !otpChatId) return null
  return { token, otpChatId, ownerChatId: process.env.TELEGRAM_OWNER_CHAT_ID || null }
}
