'use server'

import admin from '@/lib/firebase/server'

const sendMsg = async (form) => {
  // { message, id, time, email, number, name }
  const message = form.get('msg')
  const email = form.get('email')
  const name = form.get('name')
  const number = form.get('tel')
  try {
    await admin.firestore().collection('messages').add({
      message,
      email,
      number,
      name,
      time: admin.firestore.FieldValue.serverTimestamp(),
    })
    return true
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default sendMsg
