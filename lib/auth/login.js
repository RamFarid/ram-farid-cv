'use server'
import admin from '@/lib/firebase/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { compare } from 'bcrypt'
export default async function login(username, password) {
  try {
    if (!username || !password) return 'Missing username or password'
    const data = await admin
      .firestore()
      .collection('metadata')
      .doc('credentials')
      .get()
    const credentials = data.exists ? data.data() : {}
    const passwordComparesion = await compare(password, credentials.password)
    if (credentials.username !== username || !passwordComparesion)
      return "Username or password isn't correct"

    const token = jwt.sign(
      {
        username,
        password,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '7h',
      }
    )
    cookies().set('tooken', token, { httpOnly: true, maxAge: 25200 })
    return true
  } catch (error) {
    throw error
  }
}
