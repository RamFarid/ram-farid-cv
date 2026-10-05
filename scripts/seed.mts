// Inserts the live client projects until the console can create them, and the home page's editable content as it was
// before the console managed it. See docs/database.md#seeding
import mongoose from 'mongoose'
import { HomeContent } from '@/lib/db/models/HomeContent'
import { Profile } from '@/lib/db/models/Profile'
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

// The experience timeline's roles, from Ram's CV (2026-10-05). The university isn't seeded: the timeline builds it from
// lib/profile. Ramlyon links to its case study by project id.
const ramlyon = await Project.findOne({ slug: 'ramlyon' }).select('_id').lean()
const highlight = (id: string, en: string, ar: string) => ({ id, text: l(en, ar) })

const experience = [
  {
    id: 'freelance',
    role: l('Full-stack engineer', 'مهندس Full-stack'),
    organization: 'Freelance',
    startedOn: '2021-11',
    summary: l(
      'Production web apps for clients in hospitality, e-commerce, institutional services and gaming, from requirements to deployment and upkeep.',
      'تطبيقات ويب تعمل في الإنتاج لعملاء في الضيافة والتجارة الإلكترونية والخدمات المؤسسية والألعاب، من المتطلبات إلى النشر والصيانة.',
    ),
    highlights: [
      highlight(
        'systems',
        'Built booking and reservation systems, CMS platforms, real-time features, checkout flows and admin dashboards.',
        'بنيت أنظمة حجوزات، ومنصات لإدارة المحتوى، وميزات فورية، ومسارات دفع، ولوحات تحكم.',
      ),
      highlight('codebases', 'Worked on new builds and inherited codebases alike.', 'عملت على مشاريع جديدة وعلى أكواد موروثة على حد سواء.'),
      highlight(
        'clients',
        'Worked directly with clients and their existing teams to turn operational needs into maintainable features.',
        'عملت مباشرة مع العملاء وفرقهم لتحويل احتياجات التشغيل إلى ميزات سهلة الصيانة.',
      ),
    ],
  },
  {
    id: 'we-make-solution',
    role: l('Front-end developer', 'مطوّر واجهات أمامية'),
    organization: 'WE MAKE SOLUTION LIMITED',
    startedOn: '2022-01',
    endedOn: '2024-06',
    summary: l(
      'New features and careful refactors for client apps built with React and Next.js, at a software company in the UAE.',
      'ميزات جديدة وإعادة هيكلة مدروسة لتطبيقات عملاء مبنية بـ React وNext.js، في شركة برمجيات بالإمارات.',
    ),
    highlights: [
      highlight(
        'guest-checkout',
        'Enabled guest checkout on an e-commerce platform that required sign-in before ordering.',
        'أتحت الشراء دون تسجيل دخول في منصة تجارة إلكترونية كانت تشترطه قبل الطلب.',
      ),
      highlight(
        'contact-workflow',
        'Built a contact-request workflow: a public form, an internal review page and email alerts.',
        'بنيت مسارًا لطلبات التواصل: نموذج عام، وصفحة مراجعة داخلية، وتنبيهات بالبريد الإلكتروني.',
      ),
      highlight(
        'realtime',
        'Shipped multilingual interfaces and real-time features with next-intl, Node.js, Socket.IO and MongoDB.',
        'أطلقت واجهات متعددة اللغات وميزات فورية باستخدام next-intl وNode.js وSocket.IO وMongoDB.',
      ),
    ],
  },
  {
    id: 'ramlyon',
    role: l('Founder and full-stack engineer', 'مؤسس ومهندس Full-stack'),
    organization: 'Ramlyon',
    url: 'https://ramlyon.com',
    startedOn: '2026-05',
    summary: l(
      'A multi-tenant ERP and SaaS platform I built and launched in under four months, and run in production.',
      'منصة ERP وSaaS متعددة المستأجرين بنيتها وأطلقتها في أقل من أربعة أشهر، وأديرها في الإنتاج.',
    ),
    highlights: [
      highlight(
        'modules',
        'Commerce, orders, operations, CRM, subscription billing and analytics, with 45 staff permissions across 13 areas.',
        'التجارة والطلبات والعمليات وإدارة العملاء والاشتراكات والتحليلات، مع 45 صلاحية للموظفين في 13 قسمًا.',
      ),
      highlight(
        'architecture',
        'Tenant-isolated PostgreSQL with Prisma, server-validated pricing, Argon2 sign-in, live order updates over SSE and offline sync with safe replay.',
        'قاعدة PostgreSQL معزولة لكل مستأجر مع Prisma، وأسعار يتحقق منها الخادم، وتسجيل دخول بـ Argon2، وتحديثات فورية للطلبات عبر SSE، ومزامنة دون اتصال مع إعادة تشغيل آمنة.',
      ),
      highlight(
        'caching',
        'Edge caching took most public-menu visits from five database reads to zero.',
        'خفّض التخزين المؤقت على الحافة قراءات قاعدة البيانات في أغلب زيارات القائمة العامة من خمس إلى صفر.',
      ),
    ],
    ...(ramlyon && { projectId: ramlyon._id.toString() }),
  },
]

const homeContent = {
  about: {
    title: l('One engineer, front to back', 'مهندس واحد، من الواجهة إلى الخادم'),
    body: l(
      'Since November 2021 I’ve built web apps for {clients} clients, and I own each one end to end: the interface, the API and the database, through to launch.\n\nI work in English and Arabic, so right-to-left layouts are part of the build from day one, not a fix after launch.',
      'منذ نوفمبر 2021 بنيت تطبيقات ويب لـ {clients} عميلًا، وأتولى كل مشروع من أوله إلى آخره: الواجهة وواجهة الـ API وقاعدة البيانات، حتى الإطلاق.\n\nأعمل بالعربية والإنجليزية، لذلك يدخل التصميم من اليمين إلى اليسار في البناء من اليوم الأول، لا كإصلاح بعد الإطلاق.',
    ),
    clientCount: 16,
  },
  experience,
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
    // Added on 2026-10-05 from Ram's CV, for the CV builder (docs/cv.md#setup).
    {
      id: 'architecture',
      name: l('Architecture', 'معمارية الأنظمة'),
      items: ['Multi-tenant SaaS', 'ERP', 'SSE', 'WebSockets', 'PWA'],
      practices: [
        { id: 'offlineSync', label: l('Offline synchronization', 'المزامنة دون اتصال') },
        { id: 'i18nRtl', label: l('Internationalization and RTL', 'تعدد اللغات ودعم RTL') },
        { id: 'technicalSeo', label: l('Technical SEO', 'تحسين محركات البحث التقني (SEO)') },
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

// The CV setup as Ram's last hand-made CV read (2026-10-05): the summary keeps "{years}" so the figure stays current.
// St Mary Maadi joins Selected Projects once it's a project in the console. See docs/cv.md#setup
const history = await Project.findOne({ slug: 'history-game' }).select('_id').lean()
const cv = {
  headline: 'Full Stack Engineer',
  tools: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
  summary:
    'Full-stack engineer with {years}+ years of experience designing, building, and operating production web platforms and business systems using Next.js, TypeScript, Node.js, PostgreSQL, and MongoDB. Experience spans end-to-end product development, multi-tenant SaaS and ERP architecture, real-time and offline-first applications, data modeling, third-party integrations, cloud deployment, and performance optimization. Built and launched Ramlyon, a multi-tenant business management platform. Also built and currently maintain the HISTORY Metin2 website and wiki, serving 400+ registered users with about 100 active daily.',
  contacts: ['location', 'phone', 'email', 'website', 'linkedin', 'github'],
  sections: ['summary', 'skills', 'experience', 'additionalExperience', 'projects', 'certifications', 'education', 'languages'].map(
    (id) => ({ id, visible: true }),
  ),
  experience: [
    { id: 'ramlyon', tier: 'main', hiddenHighlights: [] },
    { id: 'freelance', tier: 'main', hiddenHighlights: [] },
    { id: 'we-make-solution', tier: 'additional', hiddenHighlights: [] },
  ],
  projects: history
    ? [
        {
          projectId: history._id.toString(),
          title: 'HISTORY Metin2 Platform',
          links: ['https://m2history.com', 'https://wiki.m2history.com'],
          bullets: [
            {
              id: 'website-wiki',
              text: 'Built and currently maintain the public website and CMS-backed wiki for a 13-language MMORPG community, including authentication and account recovery, rankings, an item shop, live chat, news, changelogs, and administrative publishing.',
            },
            {
              id: 'integration',
              text: 'Integrated application data with MongoDB and MySQL game data and deployed the platform on Hetzner through Coolify and Cloudflare.',
            },
            {
              id: 'performance',
              text: 'Improved wiki load times by caching database queries and rendered components, reducing image payloads, and removing repeated data fetching.',
            },
          ],
        },
      ]
    : [],
  skills: ['frontend', 'state', 'backend', 'data', 'auth', 'architecture', 'devops'].map((groupId) => ({
    groupId,
    label: '',
    hiddenItems: [],
    hiddenPractices: [],
  })),
  certifications: [],
  pageSize: 'A4',
}
const { upsertedCount: profileInserted, modifiedCount: cvFilled } = await Profile.updateOne(
  { cv: { $exists: false } },
  { $set: { cv } },
  { upsert: !(await Profile.exists({})) },
)
console.log(`cv setup: ${profileInserted ? 'inserted' : cvFilled ? 'filled' : 'already exists, left unchanged'}`)

await mongoose.disconnect()
