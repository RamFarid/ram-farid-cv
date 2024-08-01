'use server'
import admin from '@/lib/firebase/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export default async function checkToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY)
    const data = await admin
      .firestore()
      .collection('metadata')
      .doc('credentials')
      .get()
    const credentials = data.exists ? data.data() : {}
    const comparedPassword = await bcrypt.compare(
      credentials.password,
      payload.password
    )
    if (credentials.username !== payload.username && comparedPassword)
      throw 'Invalid token'
    return payload
  } catch (error) {
    throw error.message
  }
}
