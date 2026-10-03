import 'server-only'
import mongoose from 'mongoose'
import { z } from 'zod'

const mongoUriZSchema = z
  .string({ error: 'MONGO_URI is not set' })
  .regex(
    /^mongodb(\+srv)?:\/\//,
    'MONGO_URI must start with mongodb:// or mongodb+srv://',
  )

// Kept on globalThis so hot reloads and warm serverless invocations reuse one connection pool.
const cache = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>
}

export function connectDB() {
  cache.mongooseConnection ??= mongoose
    .connect(mongoUriZSchema.parse(process.env.MONGO_URI), {
      bufferCommands: false,
    })
    .catch((error: unknown) => {
      cache.mongooseConnection = undefined
      throw error
    })

  return cache.mongooseConnection
}
