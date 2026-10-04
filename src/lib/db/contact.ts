import 'server-only'
import { connectDB } from './connect'
import { ContactMsg, type ContactMsgRecord } from './models/ContactMsg'

export type NewContactMsg = Pick<ContactMsgRecord, 'name' | 'email' | 'phone' | 'message' | 'locale'>

/** Stores one submission and returns its id. */
export async function insertContactMsg(data: NewContactMsg) {
  await connectDB()
  const doc = await ContactMsg.create(data)
  return doc._id.toString()
}

/** Messages not opened in the console yet. */
export async function countNewContactMsgs() {
  await connectDB()
  return ContactMsg.countDocuments({ status: 'new' })
}

const inboxFilters = {
  inbox: { status: { $ne: 'archived' } },
  unread: { status: 'new' },
  archived: { status: 'archived' },
} as const

export type InboxFilter = keyof typeof inboxFilters

/** Newest first. The list is capped; a personal site gets a few messages a week. */
export async function findContactMsgs(filter: InboxFilter, limit: number) {
  await connectDB()
  return ContactMsg.find(inboxFilters[filter]).sort({ createdAt: -1 }).limit(limit).lean()
}

export async function countContactMsgsByFilter() {
  await connectDB()
  const [inbox, unread, archived] = await Promise.all(
    (['inbox', 'unread', 'archived'] as const).map((filter) => ContactMsg.countDocuments(inboxFilters[filter])),
  )
  return { inbox, unread, archived }
}

export async function findContactMsgById(id: string) {
  await connectDB()
  return ContactMsg.findById(id).lean()
}

export async function updateContactMsgStatus(id: string, status: ContactMsgRecord['status']) {
  await connectDB()
  const { matchedCount } = await ContactMsg.updateOne({ _id: id }, { $set: { status } })
  return matchedCount === 1
}

/** Only archived messages can be deleted, so a stray request can't remove one still in the inbox. */
export async function deleteArchivedContactMsg(id: string) {
  await connectDB()
  const { deletedCount } = await ContactMsg.deleteOne({ _id: id, status: 'archived' })
  return deletedCount === 1
}
