import admin from '@/lib/firebase/server'

export default async function getMessages() {
  // { message, id, time, email, number, name }
  const messages = []
  const res = await admin
    .firestore()
    .collection('messages')
    .orderBy('time', 'desc')
    .get()
  if (!res.size) return messages
  res.docs.forEach((doc) => {
    if (doc.exists) {
      messages.push({
        ...doc.data(),
        id: doc.id,
      })
    }
  })
  return messages
}
