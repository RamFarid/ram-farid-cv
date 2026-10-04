// Inserts the live client projects until the console can create them. See docs/database.md#seeding
import mongoose from 'mongoose'
import { Project } from '@/lib/db/models/Project'

const uri = process.env.MONGO_URI
if (!uri) throw new Error('MONGO_URI is not set; add it to .env (see .env.example)')

// Placeholder copy: replace the TODO fields with Ram's real content.
const todo = (en: string, ar: string) => ({ en: `TODO: ${en}`, ar: `TODO: ${ar}` })

// The case-study fields every project needs (docs/portfolio.md#case-study-content). Dates, the cover and the
// screenshots are left unset until the real ones exist in R2.
const caseStudy = () => ({
  role: todo('my role, e.g. Sole full-stack engineer', 'دوري، مثل مهندس full-stack الوحيد'),
  overview: todo(
    'two or three sentences: the client, the problem and what the product does now',
    'جملتان أو ثلاث: العميل والمشكلة وما يقدمه المنتج الآن',
  ),
  deliverables: {
    en: ['TODO: a deliverable, e.g. Admin dashboard'],
    ar: ['TODO: أحد المخرجات، مثل لوحة تحكم'],
  },
  story: {
    en: '<h3>TODO: a section heading</h3><p>TODO: how it was built, as sanitized HTML.</p>',
    ar: '<h3>TODO: عنوان قسم</h3><p>TODO: كيف بُني المشروع، بصيغة HTML.</p>',
  },
})

const projects = [
  {
    slug: 'history-game',
    title: { en: 'HISTORY game', ar: 'HISTORY game' },
    client: todo('client name', 'اسم العميل'),
    kind: todo('kind, e.g. Web app', 'النوع، مثل تطبيق ويب'),
    summary: todo('one sentence on what it is and who it is for', 'جملة واحدة عن المشروع ولمن صُمّم'),
    ...caseStudy(),
    status: 'published',
    order: 1,
  },
  {
    slug: 'ramlyon',
    title: { en: 'Ramlyon', ar: 'Ramlyon' },
    client: todo('client name', 'اسم العميل'),
    kind: todo('kind, e.g. Web app', 'النوع، مثل تطبيق ويب'),
    summary: todo('one sentence on what it is and who it is for', 'جملة واحدة عن المشروع ولمن صُمّم'),
    ...caseStudy(),
    status: 'published',
    order: 2,
  },
]

await mongoose.connect(uri)

for (const project of projects) {
  // $setOnInsert: re-running the seed never overwrites a project that was edited since.
  const { upsertedCount } = await Project.updateOne(
    { slug: project.slug },
    { $setOnInsert: project },
    { upsert: true },
  )

  // Fields added to the schema after a project was first seeded are filled in, one at a time and only where missing.
  const filled: string[] = []
  if (!upsertedCount) {
    for (const [field, value] of Object.entries(project)) {
      const { modifiedCount } = await Project.updateOne(
        { slug: project.slug, [field]: { $exists: false } },
        { $set: { [field]: value } },
      )
      if (modifiedCount) filled.push(field)
    }
  }

  const outcome = upsertedCount
    ? 'inserted'
    : filled.length
      ? `already exists; filled missing ${filled.join(', ')}`
      : 'already exists, left unchanged'
  console.log(`${project.slug}: ${outcome}`)
}

await mongoose.disconnect()
