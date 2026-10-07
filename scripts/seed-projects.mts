// Reads the case studies kept in docs/projects/<slug>/ (git-ignored): README.md holds the fields, assets/ the images.
// See docs/database.md#seeding
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import type { ImageType } from '@/lib/storage'
import { projectPublishZSchema } from '@/lib/validations/project'

const root = new URL('../docs/projects/', import.meta.url)
type Localized = { en: string; ar: string }

const imageTypes: Record<string, ImageType> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

/** A file in a project's assets/, the R2 key it uploads to, and its pixel size. */
export type AssetImage = { file: string; key: string; contentType: ImageType; width: number; height: number }

/**
 * Turns an asset into the stored image fields; the seed uploads it to R2 under its key.
 */
export type ImageResolver = (image: AssetImage) => Promise<{ url: string; width: number; height: number } | undefined>

/** Front matter: `key: value` lines, and `key:` followed by `  - item` lines for a list. */
function frontMatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) throw new Error('missing front matter')
  const data: Record<string, string | string[]> = {}
  let list: string[] | undefined
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.+)$/)
    if (item && list) list.push(item[1].trim())
    else {
      const [, key, value] = line.match(/^(\w+):\s*(.*)$/) ?? []
      if (!key) continue
      list = value ? undefined : []
      data[key] = value ? value.trim() : list!
    }
  }
  return { data, body: source.slice(match[0].length) }
}

/** `## field: <name>` sections, each read up to the next one. Text above the first is notes. */
function fieldSections(body: string) {
  const parts = body.split(/^## field: (\S+)[ \t]*\r?$/m)
  const fields = new Map<string, string>()
  for (let i = 1; i < parts.length; i += 2) fields.set(parts[i], parts[i + 1].replace(/\r/g, '').trim())
  return fields
}

function tableRows(text: string) {
  const rows = text
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()))
  const [header, , ...body] = rows
  return body.map((cells) => Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ''])))
}

export async function readProjectDocs(resolveImage: ImageResolver) {
  let slugs: string[]
  try {
    slugs = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  } catch {
    return []
  }

  const projects = []
  for (const dir of slugs) {
    const source = await readFile(new URL(`${dir}/README.md`, root), 'utf8').catch(() => null)
    if (source === null) continue
    const { data, body } = frontMatter(source)
    const fields = fieldSections(body)
    const where = `docs/projects/${dir}/README.md`
    const text = (name: string) => {
      const value = fields.get(name)
      if (value === undefined) throw new Error(`${where}: missing "## field: ${name}"`)
      return value
    }
    const localized = (name: string): Localized => ({ en: text(`${name}.en`), ar: text(`${name}.ar`) })
    const bullets = (name: string) => text(name).split('\n').filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim())
    const scalar = (key: string) => (typeof data[key] === 'string' ? (data[key] as string) : '')
    const slug = scalar('slug') || dir

    const asset = async (file: string, key: string) => {
      const type = imageTypes[path.extname(file).toLowerCase()]
      if (!type) throw new Error(`${where}: ${file} isn't a WebP, PNG or JPEG`)
      const { width, height } = await sharp(fileURLToPath(new URL(`${dir}/assets/${file}`, root))).metadata()
      return resolveImage({ file: `${dir}/assets/${file}`, key, contentType: type, width: width!, height: height! })
    }

    const coverImage = scalar('cover') ? await asset(scalar('cover'), `projects/covers/${slug}${path.extname(scalar('cover'))}`) : undefined
    const screenshots = []
    for (const row of fields.has('screenshots') ? tableRows(text('screenshots')) : []) {
      const image = await asset(row.file, `projects/screens/${slug}/${row.file}`)
      if (!image) continue
      const caption = { en: row['caption.en'] ?? '', ar: row['caption.ar'] ?? '' }
      screenshots.push({
        ...image,
        device: row.device,
        alt: { en: row['alt.en'], ar: row['alt.ar'] },
        ...(caption.en || caption.ar ? { caption } : {}),
      })
    }

    const project = {
      slug,
      title: localized('title'),
      client: localized('client'),
      kind: localized('kind'),
      summary: localized('summary'),
      stack: Array.isArray(data.stack) ? data.stack : [],
      liveUrl: scalar('liveUrl') || undefined,
      repoUrl: scalar('repoUrl') || undefined,
      starred: scalar('starred') === 'true',
      cover: coverImage && { ...coverImage, alt: localized('cover.alt') },
      startedAt: scalar('startedAt') ? new Date(scalar('startedAt')) : undefined,
      endedAt: scalar('endedAt') ? new Date(scalar('endedAt')) : undefined,
      role: localized('role'),
      overview: localized('overview'),
      deliverables: { en: bullets('deliverables.en'), ar: bullets('deliverables.ar') },
      storyMarkdown: localized('story'),
      screenshots,
      status: scalar('status') === 'published' ? ('published' as const) : ('draft' as const),
      order: Number(scalar('order') || 0),
    }

    // The console's publish rules, so the project saves from the console as-is.
    const day = (date?: Date) => date?.toISOString().slice(0, 10) ?? ''
    const check = projectPublishZSchema.safeParse({
      ...project,
      liveUrl: project.liveUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      startedAt: day(project.startedAt),
      endedAt: day(project.endedAt),
      cover: project.cover ?? null,
      screenshots: project.screenshots.map((shot) => ({ caption: { en: '', ar: '' }, ...shot })),
      deliverables: project.deliverables.en.map((en, i) => ({ id: `d${i}`, text: { en, ar: project.deliverables.ar[i] ?? '' } })),
      story: project.storyMarkdown,
    })
    if (!check.success)
      throw new Error(`${where} doesn't pass the console's publish rules:\n${check.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`).join('\n')}`)

    projects.push(project)
  }
  return projects
}
