// Inserts the live client projects until the console can create them, and the home page's editable content as it was
// before the console managed it. See docs/database.md#seeding
import mongoose from 'mongoose'
import { HomeContent } from '@/lib/db/models/HomeContent'
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
  // The console edits the Markdown and saves the HTML made from it; the seed writes both to match.
  storyMarkdown: {
    en: '# TODO: a section heading\n\nTODO: how it was built, in Markdown.',
    ar: '# TODO: عنوان قسم\n\nTODO: كيف بُني المشروع، بصيغة Markdown.',
  },
  story: {
    en: '<h3>TODO: a section heading</h3>\n<p>TODO: how it was built, in Markdown.</p>',
    ar: '<h3>TODO: عنوان قسم</h3>\n<p>TODO: كيف بُني المشروع، بصيغة Markdown.</p>',
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

// The home page's copy as it stood in messages/*.json and lib/profile when the console took it over (2026-10-04).
// Certificates start empty: the old rows were placeholders, and the real ones are added in the console.
const l = (en: string, ar: string) => ({ en, ar })

const homeContent = {
  about: {
    title: l('One engineer, front to back', 'مهندس واحد، من الواجهة إلى الخادم'),
    body: l(
      'Since November 2021 I’ve built web apps for {clients} clients, and I own each one end to end: the interface, the API and the database, through to launch.\n\nI work in English and Arabic, so right-to-left layouts are part of the build from day one, not a fix after launch.',
      'منذ نوفمبر 2021 بنيت تطبيقات ويب لـ {clients} عميلًا، وأتولى كل مشروع من أوله إلى آخره: الواجهة وواجهة الـ API وقاعدة البيانات، حتى الإطلاق.\n\nأعمل بالعربية والإنجليزية، لذلك يدخل التصميم من اليمين إلى اليسار في البناء من اليوم الأول، لا كإصلاح بعد الإطلاق.',
    ),
    clientCount: 16,
  },
  services: [
    {
      id: 'apps',
      title: l('New web apps', 'تطبيقات ويب جديدة'),
      body: l(
        'A product your customers sign in to and use, built with Next.js and Node.js from the first screen to the database.',
        'منتج يسجّل فيه عملاؤك الدخول ويستخدمونه، أبنيه بـ Next.js وNode.js من الشاشة الأولى حتى قاعدة البيانات.',
      ),
    },
    {
      id: 'rebuilds',
      title: l('Rebuilds of dated sites', 'إعادة بناء المواقع القديمة'),
      body: l(
        'Your current site moved to a modern, fast stack, keeping your content and your URLs.',
        'أنقل موقعك الحالي إلى تقنيات حديثة وسريعة، مع الحفاظ على محتواك وروابطك.',
      ),
    },
    {
      id: 'localization',
      title: l('Multilingual, localized products', 'منتجات متعددة اللغات'),
      body: l(
        'Sites and apps built for every language they serve: translated content, right-to-left layouts and local date and number formats, from the first release.',
        'مواقع وتطبيقات مبنية لكل لغة تخدمها: محتوى مترجم، وتخطيط من اليمين إلى اليسار، وصيغ محلية للتواريخ والأرقام، من الإصدار الأول.',
      ),
    },
    {
      id: 'servers',
      title: l('Performant server management', 'إدارة خوادم عالية الأداء'),
      body: l(
        'Servers that stay fast and up under real traffic: deployment, monitoring, caching and tuning, handled end to end.',
        'خوادم تبقى سريعة ومتاحة تحت الضغط الحقيقي: النشر والمراقبة والتخزين المؤقت وضبط الأداء، من البداية إلى النهاية.',
      ),
    },
  ],
  skillGroups: [
    {
      id: 'frontend',
      name: l('Front end', 'الواجهات'),
      items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'MUI', 'MUI X', 'shadcn/ui', 'Sass', 'styled-components', 'Framer Motion'],
      practices: [],
    },
    {
      id: 'state',
      name: l('State and data fetching', 'إدارة الحالة وجلب البيانات'),
      items: ['Redux Toolkit', 'Zustand', 'Jotai', 'TanStack Query', 'SWR'],
      practices: [],
    },
    {
      id: 'backend',
      name: l('Back end', 'البرمجة الخلفية'),
      items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO'],
      practices: [
        { id: 'backgroundJobs', label: l('Background jobs', 'المهام في الخلفية') },
        { id: 'cronJobs', label: l('Cron jobs', 'مهام Cron المجدولة') },
        { id: 'workers', label: l('Workers', 'Workers') },
      ],
    },
    {
      id: 'data',
      name: l('Databases', 'قواعد البيانات'),
      items: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Prisma', 'Redis', 'Firebase', 'Supabase'],
      practices: [
        { id: 'databaseDesign', label: l('Database design', 'تصميم قواعد البيانات') },
        { id: 'queryOptimization', label: l('Query optimization', 'تحسين الاستعلامات') },
        { id: 'transactions', label: l('Transactions', 'المعاملات (Transactions)') },
      ],
    },
    {
      id: 'auth',
      name: l('Auth and access control', 'المصادقة والتحكم في الصلاحيات'),
      items: ['Auth.js', 'JWT', 'OAuth', 'RBAC'],
      practices: [
        { id: 'authentication', label: l('Authentication', 'المصادقة') },
        { id: 'authorization', label: l('Authorization', 'التفويض والصلاحيات') },
      ],
    },
    {
      id: 'devops',
      name: l('Servers and DevOps', 'الخوادم وDevOps'),
      items: ['Linux', 'Nginx', 'Docker', 'PM2', 'Coolify', 'GitHub Actions', 'Cloudflare', 'Vercel', 'AWS'],
      practices: [],
    },
    {
      id: 'testing',
      name: l('Testing', 'الاختبارات'),
      items: ['Jest', 'Vitest', 'React Testing Library', 'Playwright', 'Cypress'],
      practices: [],
    },
    {
      id: 'integrations',
      name: l('Integrations', 'التكاملات'),
      items: ['Stripe', 'Telegram Bot API', 'Nodemailer'],
      practices: [],
    },
    { id: 'tools', name: l('Tools', 'الأدوات'), items: ['Git', 'GitHub'], practices: [] },
  ],
  certifications: [],
}

// One document; each section is filled only while it's missing, so content edited in the console is never overwritten.
const existingHome = await HomeContent.findOne().select('_id').lean()
if (!existingHome) {
  await HomeContent.create(homeContent)
  console.log('home content: inserted')
} else {
  const filled: string[] = []
  for (const [field, value] of Object.entries(homeContent)) {
    const { modifiedCount } = await HomeContent.updateOne(
      { _id: existingHome._id, [field]: { $exists: false } },
      { $set: { [field]: value } },
    )
    if (modifiedCount) filled.push(field)
  }
  console.log(`home content: ${filled.length ? `already exists; filled missing ${filled.join(', ')}` : 'already exists, left unchanged'}`)
}

await mongoose.disconnect()
