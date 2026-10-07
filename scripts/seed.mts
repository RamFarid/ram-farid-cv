// Inserts the live client projects, the home page's editable content and the CV setup, and fills in whatever of them is
// still missing or a `TODO:` placeholder. It never overwrites real content. See docs/database.md#seeding
import { readFile } from 'node:fs/promises'
import mongoose from 'mongoose'
import { HomeContent } from '@/lib/db/models/HomeContent'
import { Profile } from '@/lib/db/models/Profile'
import { Project } from '@/lib/db/models/Project'
import { storyHtml } from '@/lib/projects/markdown'
import { putImageOnce, type ImageType } from '@/lib/storage'
import { readProjectDocs, type ImageResolver } from './seed-projects.mjs'

const uri = process.env.MONGO_URI
if (!uri) throw new Error('MONGO_URI is not set; add it to .env (see .env.example)')


const l = (en: string, ar: string) => ({ en, ar })

// The seed's images live in scripts/seed-assets and go to R2 under fixed keys, uploaded only while the key is empty.
// Without R2 configured they're skipped and the fields that show them stay unset.
let imagesSkipped = false
async function seedImage(file: string, key: string, contentType: ImageType, width: number, height: number) {
  const stored = await putImageOnce(key, await readFile(new URL(`./seed-assets/${file}`, import.meta.url)), contentType)
  if (!stored) {
    if (!imagesSkipped) console.warn('R2 is not configured (see .env.example): images skipped')
    imagesSkipped = true
    return undefined
  }
  if (stored.uploaded) console.log(`${key}: uploaded`)
  return { url: stored.url, width, height }
}

/** A 16:9 cover: the client's logo on its brand ground, made from the live site's logo on 2026-10-06. */
async function cover(slug: string, alt: { en: string; ar: string }) {
  const image = await seedImage(`covers/${slug}.webp`, `projects/covers/${slug}.webp`, 'image/webp', 1920, 1080)
  return image && { ...image, alt }
}

const docImage: ImageResolver = async ({ file, key, contentType, width, height }) => {
  const stored = await putImageOnce(key, await readFile(new URL(`../docs/projects/${file}`, import.meta.url)), contentType)
  if (!stored) {
    if (!imagesSkipped) console.warn('R2 is not configured (see .env.example): images skipped')
    imagesSkipped = true
    return undefined
  }
  if (stored.uploaded) console.log(`${key}: uploaded`)
  return { url: stored.url, width, height }
}

// Case studies written in docs/projects/<slug>/ (git-ignored), screenshots included. They replace an inline entry
// with the same slug. See docs/portfolio.md#case-study-content
const docProjects = await readProjectDocs(docImage)

// The case studies not yet moved to docs/projects, as Ram's CV and the live sites describe them (2026-10-06), with
// dates from Ram. Their screenshots are uploaded in the console.
const inlineProjects = [
  {
    slug: 'history-game',
    title: l('HISTORY game', 'HISTORY game'),
    client: l('HISTORY Metin2 server', 'سيرفر HISTORY للعبة Metin2'),
    kind: l('Website and wiki', 'موقع وويكي'),
    summary: l(
      'The public website and wiki of HISTORY, an old-school Metin2 private server, built for its player community in 13 languages.',
      'الموقع العام والويكي لـ HISTORY، سيرفر Metin2 خاص بالطابع الكلاسيكي، مبنيان لمجتمع لاعبيه بـ 13 لغة.',
    ),
    stack: ['nextjs', 'mongodb', 'mysql', 'coolify', 'cloudflare'],
    liveUrl: 'https://m2history.com',
    starred: true,
    cover: await cover('history-game', l('The HISTORY logo: a dragon-headed sword with the HISTORY name', 'شعار HISTORY: سيف برأس تنين مع اسم HISTORY')),
    // Ram's build ended on 2026-10-01; he keeps maintaining it.
    startedAt: new Date('2025-07-26'),
    endedAt: new Date('2026-10-01'),
    role: l('Full-stack engineer', 'مهندس Full-stack'),
    overview: l(
      'HISTORY is an old-school Metin2 private server: level 99, rebuilt quests and no pay-to-win. Its website and wiki serve the player community in 13 languages.\n\nI built both and still maintain them. On the website, players sign in, recover their accounts, follow the rankings, shop for items, chat live and read the news and changelogs. The wiki is a CMS-backed reference for items, monsters, maps, quests and skills. The platform serves 400+ registered users, about 100 of them active daily.',
      'HISTORY سيرفر خاص للعبة Metin2 بالطابع الكلاسيكي: المستوى 99، ومهام أُعيد بناؤها، ولا شيء يُشترى بالمال ليمنح تفوقًا. يخدم موقعه والويكي مجتمع اللاعبين بـ 13 لغة.\n\nبنيت الاثنين وما زلت أتولى صيانتهما. في الموقع يسجل اللاعبون الدخول، ويستعيدون حساباتهم، ويتابعون التصنيفات، ويشترون العناصر، ويتحادثون مباشرة، ويقرؤون الأخبار وسجل التحديثات. أما الويكي فمرجع مبني على نظام لإدارة المحتوى للعناصر والوحوش والخرائط والمهام والمهارات. تخدم المنصة أكثر من 400 مستخدم مسجل، منهم نحو 100 نشطون يوميًا.',
    ),
    deliverables: {
      en: [
        'Public website with sign-in and account recovery',
        'Player rankings',
        'Item shop',
        'Live chat',
        'News and changelogs',
        'CMS-backed wiki for items, monsters, maps, quests and skills',
        'Admin publishing for news, changelogs and the wiki',
        'Interfaces in 13 languages',
      ],
      ar: [
        'موقع عام مع تسجيل الدخول واستعادة الحساب',
        'تصنيفات اللاعبين',
        'متجر العناصر',
        'دردشة مباشرة',
        'الأخبار وسجل التحديثات',
        'ويكي مبني على نظام لإدارة المحتوى للعناصر والوحوش والخرائط والمهام والمهارات',
        'أدوات نشر للإدارة للأخبار وسجل التحديثات والويكي',
        'واجهات بـ 13 لغة',
      ],
    },
    storyMarkdown: l(
      `# Two databases, one platform

The platform keeps its own data in MongoDB and reads the game's data from the server's MySQL database, so what players see on the site matches the game.

# A faster wiki

I cut the wiki's load times by:

- caching database queries and rendered components;
- shrinking image payloads;
- removing repeated data fetching.

# 13 languages

The site and the wiki serve the community in 13 languages.

# Publishing

Admins publish news, changelogs and wiki pages from the CMS.

# Deployment

Hetzner servers through Coolify, behind Cloudflare. I still maintain the platform.`,
      `# قاعدتا بيانات، منصة واحدة

تحفظ المنصة بياناتها الخاصة في MongoDB، وتقرأ بيانات اللعبة من قاعدة MySQL الخاصة بالسيرفر، فيتطابق ما يراه اللاعبون في الموقع مع ما في اللعبة.

# ويكي أسرع

قلّلت زمن تحميل الويكي عن طريق:

- التخزين المؤقت لاستعلامات قاعدة البيانات والمكونات بعد عرضها؛
- تقليل أحجام الصور؛
- إزالة جلب البيانات المتكرر.

# 13 لغة

يخدم الموقع والويكي المجتمع بـ 13 لغة.

# النشر الإداري

ينشر المشرفون الأخبار وسجل التحديثات وصفحات الويكي من نظام إدارة المحتوى.

# النشر على الخوادم

خوادم Hetzner عبر Coolify، خلف Cloudflare. وما زلت أتولى صيانة المنصة.`,
    ),
    status: 'published',
    order: 2,
  },
  {
    slug: 'st-mary-maadi',
    title: l('St Mary Maadi', 'St Mary Maadi'),
    client: l('St. Mary Coptic Orthodox Church, Maadi', 'كنيسة السيدة العذراء مريم بالمعادي'),
    kind: l('Institutional platform', 'منصة مؤسسية'),
    summary: l(
      'One platform for St. Mary Church in Maadi that runs its hotel bookings, Nile trips, sports tournaments, and liturgy and event bookings.',
      'منصة واحدة لكنيسة السيدة العذراء بالمعادي تدير حجوزات الفندق، ورحلات النيل، والبطولات الرياضية، وحجوزات القداسات والفعاليات.',
    ),
    stack: ['nextjs', 'nodejs', 'express', 'mongodb', 'socketio', 'next-intl', 'vercel'],
    liveUrl: 'https://stmarymaadi.org',
    starred: true,
    cover: await cover(
      'st-mary-maadi',
      l(
        'The seal of the Church and Monastery of the Virgin Mary, Maadi: three domes with crosses above the Nile',
        'ختم كنيسة ودير السيدة العذراء مريم بالمعادي: ثلاث قباب تعلوها صلبان فوق نهر النيل',
      ),
    ),
    startedAt: new Date('2025-11-14'),
    role: l('Full-stack engineer', 'مهندس Full-stack'),
    overview: l(
      'St. Mary Coptic Orthodox Church in Maadi runs a hotel, Nile trips, sports tournaments, and liturgies and events that need booking.\n\nI built one platform that brings all four together, with availability and capacity management, admin workflows for the church’s staff, real-time updates, and an interface in Arabic and English.',
      'تدير كنيسة السيدة العذراء للأقباط الأرثوذكس بالمعادي فندقًا، ورحلات نيلية، وبطولات رياضية، وقداسات وفعاليات تحتاج إلى حجز.\n\nبنيت منصة واحدة تجمع الأنظمة الأربعة، مع إدارة التوفر والسعة، ومسارات عمل إدارية لفريق الكنيسة، وتحديثات فورية، وواجهة بالعربية والإنجليزية.',
    ),
    deliverables: {
      en: [
        'Hotel booking system',
        'Nile trip reservations',
        'Sports tournament management',
        'Liturgy and event bookings',
        'Availability and capacity management',
        'Admin workflows for the church’s staff',
        'Arabic and English interface with real-time updates',
      ],
      ar: [
        'نظام حجز الفندق',
        'حجز رحلات النيل',
        'إدارة البطولات الرياضية',
        'حجز القداسات والفعاليات',
        'إدارة التوفر والسعة',
        'مسارات عمل إدارية لفريق الكنيسة',
        'واجهة بالعربية والإنجليزية مع تحديثات فورية',
      ],
    },
    storyMarkdown: l(
      `# Four systems, one platform

Hotel bookings, Nile trip reservations, sports tournaments, and liturgy and event bookings each have their own rules, but they run on one platform, so the church's staff manage all of them from one place.

# No overbooking

Every booking checks availability and capacity before it's confirmed, so a room, a trip or a liturgy can't take more people than it holds.

# Live updates

A Node.js and Express API on MongoDB backs the platform, and Socket.IO pushes changes to open screens as they happen.

# Arabic first

The interface is in Arabic and English with next-intl, right to left in Arabic, which is the site's default language.`,
      `# أربعة أنظمة، منصة واحدة

لكل من حجوزات الفندق ورحلات النيل والبطولات الرياضية وحجوزات القداسات والفعاليات قواعده الخاصة، لكنها تعمل كلها على منصة واحدة، فيديرها فريق الكنيسة من مكان واحد.

# لا حجز يتجاوز السعة

يتحقق كل حجز من التوفر والسعة قبل تأكيده، فلا تستقبل غرفة أو رحلة أو قداس عددًا أكبر مما يتسع له.

# تحديثات فورية

تعتمد المنصة على واجهة API مبنية بـ Node.js وExpress مع MongoDB، ويرسل Socket.IO التغييرات إلى الشاشات المفتوحة لحظة حدوثها.

# العربية أولًا

الواجهة بالعربية والإنجليزية باستخدام next-intl، ومن اليمين إلى اليسار بالعربية، وهي اللغة الافتراضية للموقع.`,
    ),
    status: 'published',
    order: 3,
  },
]

const docSlugs = new Set(docProjects.map((project) => project.slug))
const projects = [...docProjects, ...inlineProjects.filter((project) => !docSlugs.has(project.slug))].sort((a, b) => a.order - b.order)

// A field, or one locale of a localized field, counts as unfilled while it's missing, blank or an earlier seed's
// `TODO:` placeholder. Only those are written on a project that already exists, so console edits always win.
const isUnfilled = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && !value.length) || JSON.stringify(value).includes('TODO:')
const isLocalized = (value: unknown): value is Record<'en' | 'ar', unknown> =>
  typeof value === 'object' && value !== null && 'en' in value && 'ar' in value

function unfilledFields(current: Record<string, unknown>, seed: Record<string, unknown>) {
  const set: Record<string, unknown> = {}
  for (const [field, value] of Object.entries(seed)) {
    const existing = current[field]
    if (isLocalized(value) && isLocalized(existing)) {
      for (const locale of ['en', 'ar'] as const) {
        if (isUnfilled(existing[locale])) set[`${field}.${locale}`] = value[locale]
      }
    } else if (isUnfilled(existing)) {
      set[field] = value
    }
  }
  return set
}

await mongoose.connect(uri)

// The console saves the HTML made from the Markdown; the seed makes it with the same pipeline.
async function withStory<T extends { storyMarkdown: { en: string; ar: string } }>(project: T) {
  return Object.fromEntries(
    Object.entries({
      ...project,
      story: l(await storyHtml(project.storyMarkdown.en, 'en'), await storyHtml(project.storyMarkdown.ar, 'ar')),
    }).filter(([, value]) => value !== undefined),
  ) as T & { story: { en: string; ar: string } }
}

const insertedSlugs = new Set<string>()
for (const project of projects) {
  const seed = await withStory(project)

  const { upsertedCount } = await Project.updateOne({ slug: seed.slug }, { $setOnInsert: seed }, { upsert: true })
  if (upsertedCount) {
    insertedSlugs.add(seed.slug)
    console.log(`${seed.slug}: inserted`)
    continue
  }

  const current = await Project.findOne({ slug: seed.slug }).lean()
  const set = current ? unfilledFields(current, seed) : {}
  if (Object.keys(set).length) await Project.updateOne({ slug: seed.slug }, { $set: set })
  console.log(
    `${seed.slug}: ${Object.keys(set).length ? `already exists; filled ${Object.keys(set).join(', ')}` : 'already exists, left unchanged'}`,
  )
}

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

// Ram's six Sololearn course certificates, as the old ramfarid.com showed them (copied 2026-10-06), newest first. The
// name and the month are as printed on each certificate.
const certificate = async (
  id: string,
  name: string,
  issuedOn: string,
  description: { en: string; ar: string },
  skills: string[],
  [width, height]: [number, number],
) => {
  const image = await seedImage(`certificates/${id}.jpg`, `home/certificates/${id}.jpg`, 'image/jpeg', width, height)
  return { id, name, issuer: 'Sololearn', issuedOn, description, skills, ...(image && { image }) }
}

const certifications = [
  await certificate(
    'sololearn-react-redux',
    'React + Redux',
    '2023-03',
    l(
      'Building interfaces with React components, props, state and hooks, and managing app state with Redux.',
      'بناء الواجهات بمكونات React والخصائص والحالة والـ Hooks، وإدارة حالة التطبيق بـ Redux.',
    ),
    ['React', 'Redux'],
    [1280, 903],
  ),
  await certificate(
    'sololearn-responsive-web-design',
    'Responsive Web Design',
    '2022-11',
    l(
      'Layouts that adapt to every screen: flexible grids, Flexbox, media queries and mobile-first CSS.',
      'تخطيطات تتكيف مع كل شاشة: الشبكات المرنة وFlexbox واستعلامات الوسائط وCSS بنهج الموبايل أولًا.',
    ),
    ['CSS', 'Flexbox', 'Media queries'],
    [1280, 903],
  ),
  await certificate(
    'sololearn-web-fundamentals',
    'Web Development Fundamentals',
    '2022-09',
    l('How the web works, and building pages with HTML, CSS and JavaScript.', 'كيف يعمل الويب، وبناء الصفحات بـ HTML وCSS وJavaScript.'),
    ['HTML', 'CSS', 'JavaScript'],
    [1280, 903],
  ),
  await certificate(
    'sololearn-javascript',
    'JavaScript',
    '2022-09',
    l(
      'Core JavaScript in theory and practice: variables, control flow, functions, objects and arrays.',
      'أساسيات JavaScript نظريًا وعمليًا: المتغيرات، والتحكم في التدفق، والدوال، والكائنات، والمصفوفات.',
    ),
    ['JavaScript'],
    [1280, 903],
  ),
  await certificate(
    'sololearn-css',
    'CSS',
    '2022-09',
    l(
      'Styling web pages: selectors, the box model, layout, colours, typography and transitions.',
      'تنسيق صفحات الويب: المحددات، ونموذج الصندوق، والتخطيط، والألوان، والخطوط، والانتقالات.',
    ),
    ['CSS'],
    [1754, 1238],
  ),
  await certificate(
    'sololearn-html',
    'HTML',
    '2022-09',
    l(
      'The structure of web pages: elements, attributes, links, forms, media and semantic HTML.',
      'بنية صفحات الويب: العناصر، والسمات، والروابط، والنماذج، والوسائط، وHTML الدلالي.',
    ),
    ['HTML'],
    [1280, 903],
  ),
]

// Ram uploaded it from the console on 2026-10-05; the seed keeps a copy so a new bucket or database gets it too.
const portrait = await seedImage(
  'portrait/24fe9bb8-31b4-4e7f-a224-4390d274c98f.png',
  'home/portrait/24fe9bb8-31b4-4e7f-a224-4390d274c98f.png',
  'image/png',
  1097,
  1434,
)

// The home page's copy as it stood in messages/*.json and lib/profile when the console took it over (2026-10-04).
const homeContent = {
  about: {
    title: l('One engineer, front to back', 'مهندس واحد، من الواجهة إلى الخادم'),
    body: l(
      'Since November 2021 I’ve built web apps for {clients} clients, and I own each one end to end: the interface, the API and the database, through to launch.\n\nI work in English and Arabic, so right-to-left layouts are part of the build from day one, not a fix after launch.',
      'منذ نوفمبر 2021 بنيت تطبيقات ويب لـ {clients} عميلًا، وأتولى كل مشروع من أوله إلى آخره: الواجهة وواجهة الـ API وقاعدة البيانات، حتى الإطلاق.\n\nأعمل بالعربية والإنجليزية، لذلك يدخل التصميم من اليمين إلى اليسار في البناء من اليوم الأول، لا كإصلاح بعد الإطلاق.',
    ),
    clientCount: 16,
    ...(portrait && { portrait }),
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
  certifications,
}

// One document; each section is filled only while it's missing or an empty list, so content edited in the console is
// never overwritten. The portrait is filled the same way inside an About that already exists.
const homeFilled: string[] = []
const existingHome = await HomeContent.findOne().select('_id').lean()
if (!existingHome) {
  await HomeContent.create(homeContent)
  homeFilled.push(...Object.keys(homeContent))
  console.log('home content: inserted')
} else {
  const unfilled = (path: string, value: unknown) =>
    Array.isArray(value) ? { $or: [{ [path]: { $exists: false } }, { [path]: { $size: 0 } }] } : { [path]: { $exists: false } }
  const sections = Object.entries(homeContent) as [string, unknown][]
  for (const [path, value] of portrait ? [...sections, ['about.portrait', portrait] as [string, unknown]] : sections) {
    const { modifiedCount } = await HomeContent.updateOne(
      { _id: existingHome._id, ...unfilled(path, value) },
      { $set: { [path]: value } },
    )
    if (modifiedCount) homeFilled.push(path)
  }
  console.log(`home content: ${homeFilled.length ? `already exists; filled ${homeFilled.join(', ')}` : 'already exists, left unchanged'}`)
}

// The CV setup as Ram's last hand-made CV read (2026-10-05): the summary keeps "{years}" so the figure stays current.
// See docs/cv.md#setup
const history = await Project.findOne({ slug: 'history-game' }).select('_id').lean()
const stMary = await Project.findOne({ slug: 'st-mary-maadi' }).select('_id').lean()
const cvProjects = [
  ...(history
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
    : []),
  ...(stMary
    ? [
        {
          projectId: stMary._id.toString(),
          title: 'St Mary Maadi Church Platform',
          links: ['https://stmarymaadi.org'],
          bullets: [
            {
              id: 'systems',
              text: 'Built one institutional platform with four integrated systems: hotel bookings, Nile trip reservations, sports tournament management, and liturgy and event bookings.',
            },
            {
              id: 'implementation',
              text: 'Implemented availability and capacity management, multilingual interfaces, administrative workflows, and real-time updates using Next.js, Node.js, Express.js, MongoDB, Socket.IO, and next-intl.',
            },
          ],
        },
      ]
    : []),
]
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
  projects: cvProjects,
  skills: ['frontend', 'state', 'backend', 'data', 'auth', 'architecture', 'devops'].map((groupId) => ({
    groupId,
    label: '',
    hiddenItems: [],
    hiddenPractices: [],
  })),
  certifications: certifications.map((certification) => certification.id),
  pageSize: 'A4',
}
const { upsertedCount: profileInserted, modifiedCount: cvFilled } = await Profile.updateOne(
  { cv: { $exists: false } },
  { $set: { cv } },
  { upsert: !(await Profile.exists({})) },
)
console.log(`cv setup: ${profileInserted ? 'inserted' : cvFilled ? 'filled' : 'already exists, left unchanged'}`)

// St Mary Maadi joined Selected Projects on 2026-10-06. A CV set up before then gets it once, in the run that first
// inserts the project, so taking it off the CV in the console sticks.
const stMaryCv = cvProjects.find((project) => project.projectId === stMary?._id.toString())
if (stMaryCv && insertedSlugs.has('st-mary-maadi')) {
  const { modifiedCount } = await Profile.updateOne(
    { cv: { $exists: true }, 'cv.projects.projectId': { $ne: stMaryCv.projectId } },
    { $push: { 'cv.projects': stMaryCv } },
  )
  if (modifiedCount) console.log('cv setup: added St Mary Maadi to Selected Projects')
}

// The certificates go on the CV in the run that first adds them to the home page, so a CV setup made before them gets
// them once and later console choices stick.
if (existingHome && homeFilled.includes('certifications')) {
  const { modifiedCount } = await Profile.updateOne(
    { cv: { $exists: true }, 'cv.certifications': { $size: 0 } },
    { $set: { 'cv.certifications': cv.certifications } },
  )
  if (modifiedCount) console.log('cv setup: added the certificates')
}

await mongoose.disconnect()
