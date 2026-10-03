// Inserts the live client projects until the console can create them. See docs/database.md#seeding
import mongoose from 'mongoose'
import { Project } from '@/lib/db/models/Project'

const uri = process.env.MONGO_URI
if (!uri) throw new Error('MONGO_URI is not set; add it to .env (see .env.example)')

// Placeholder copy: replace the TODO fields with Ram's real content.
const todo = (en: string, ar: string) => ({ en: `TODO: ${en}`, ar: `TODO: ${ar}` })

const projects = [
  {
    slug: 'history-game',
    title: { en: 'HISTORY game', ar: 'HISTORY game' },
    client: todo('client name', 'اسم العميل'),
    kind: todo('kind, e.g. Web app', 'النوع، مثل تطبيق ويب'),
    summary: todo('one sentence on what it is and who it is for', 'جملة واحدة عن المشروع ولمن صُمّم'),
    status: 'published',
    featured: true,
    order: 1,
  },
  {
    slug: 'ramlyon',
    title: { en: 'Ramlyon', ar: 'Ramlyon' },
    client: todo('client name', 'اسم العميل'),
    kind: todo('kind, e.g. Web app', 'النوع، مثل تطبيق ويب'),
    summary: todo('one sentence on what it is and who it is for', 'جملة واحدة عن المشروع ولمن صُمّم'),
    status: 'published',
    featured: true,
    order: 2,
  },
]

await mongoose.connect(uri)

// $setOnInsert: re-running the seed never overwrites a project that was edited since.
for (const project of projects) {
  const { upsertedCount } = await Project.updateOne(
    { slug: project.slug },
    { $setOnInsert: project },
    { upsert: true },
  )
  console.log(`${project.slug}: ${upsertedCount ? 'inserted' : 'already exists, left unchanged'}`)
}

await mongoose.disconnect()
