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
