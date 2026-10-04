'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { deleteObjects } from '@/lib/storage'
import { toFieldErrors, type SaveResult } from '@/lib/validations/errors'
import {
  projectDraftZSchema,
  projectLimits,
  projectPublishZSchema,
  type ProjectInput,
  type ProjectStatus,
} from '@/lib/validations/project'
import {
  createProject,
  deleteProject,
  getConsoleProject,
  saveProject,
  setProjectOrder,
  setProjectStarred,
  setProjectStatus,
  type FlagOutcome,
} from './console'
import type { ProjectActionResult } from './types'

// The console's project mutation boundary: session, Zod, domain, then revalidation of every public page a project
// appears on. See docs/portfolio.md#console

/**
 * The home page's bands, /portfolio, and every case study (a project's "next project" band shows its neighbour, and a
 * slug change moves a page), in both locales, plus the console's counts and lists.
 */
function revalidateProjects() {
  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/portfolio', 'page')
  revalidatePath('/[locale]/portfolio/[project_id]', 'page')
  revalidatePath('/[locale]/console', 'layout')
}

const unauthorized = { ok: false, error: 'unauthorized' } as const

async function save(id: string, input: unknown, status?: ProjectStatus): Promise<SaveResult<ProjectInput>> {
  if (!(await getSession())) return unauthorized

  const current = await getConsoleProject(id)
  if (!current) return { ok: false, error: 'invalid' }
  // A published project stays complete: its edits are checked like a publish.
  const schema = (status ?? current.status) === 'published' ? projectPublishZSchema : projectDraftZSchema
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) }

  try {
    const outcome = await saveProject(id, parsed.data, status)
    if (!outcome.ok) return { ok: false, error: 'invalid', ...(outcome.error === 'invalid' ? { fieldErrors: outcome.fieldErrors } : {}) }
    after(() =>
      deleteObjects(outcome.unusedImages).catch((error: unknown) => console.error('Deleting replaced R2 images failed:', error)),
    )
  } catch (error) {
    console.error('Saving a project failed:', error)
    return { ok: false, error: 'unavailable' }
  }

  revalidateProjects()
  return { ok: true, value: parsed.data }
}

/** Saves the edit page's draft and keeps the project's status. */
export async function saveProjectDraft(id: string, input: ProjectInput) {
  return save(id, input)
}

/** Saves the draft and publishes it in one write; the draft must be complete. */
export async function saveAndPublishProject(id: string, input: ProjectInput) {
  return save(id, input, 'published')
}

async function flag(run: () => Promise<FlagOutcome>): Promise<ProjectActionResult> {
  if (!(await getSession())) return unauthorized
  try {
    const outcome = await run()
    if (!outcome.ok) return outcome
  } catch (error) {
    console.error('Updating a project failed:', error)
    return { ok: false, error: 'unavailable' }
  }
  revalidateProjects()
  return { ok: true }
}

/** Publishes the stored project (it must be complete) or takes it off the site. */
export async function setProjectPublished(id: string, published: boolean) {
  return flag(() => setProjectStatus(id, published ? 'published' : 'draft'))
}

export async function setProjectStar(id: string, starred: boolean) {
  return flag(() => setProjectStarred(id, starred))
}

/** The full list of project ids in their new order. */
export async function reorderProjectList(ids: string[]): Promise<ProjectActionResult> {
  if (!(await getSession())) return unauthorized
  const parsed = z.array(z.string()).max(500).safeParse(ids)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    if (!(await setProjectOrder(parsed.data))) return { ok: false, error: 'invalid' }
  } catch (error) {
    console.error('Reordering projects failed:', error)
    return { ok: false, error: 'unavailable' }
  }
  revalidateProjects()
  return { ok: true }
}

const newProjectZSchema = z.string().trim().min(1, 'required').max(projectLimits.title, 'tooLong')

export type CreateProjectResult = { ok: true; id: string } | { ok: false; error: 'unauthorized' | 'invalid' | 'unavailable' }

/** A new draft named by its English title. The edit page opens next. */
export async function createProjectDraft(title: string): Promise<CreateProjectResult> {
  if (!(await getSession())) return unauthorized
  const parsed = newProjectZSchema.safeParse(title)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const id = await createProject(parsed.data)
    revalidatePath('/[locale]/console', 'layout')
    return { ok: true, id }
  } catch (error) {
    console.error('Creating a project failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}

/** Deletes a draft and its images. Published projects are unpublished first. */
export async function deleteProjectDraft(id: string): Promise<ProjectActionResult> {
  if (!(await getSession())) return unauthorized
  try {
    if (!(await deleteProject(id))) return { ok: false, error: 'notFound' }
  } catch (error) {
    console.error('Deleting a project failed:', error)
    return { ok: false, error: 'unavailable' }
  }
  revalidatePath('/[locale]/console', 'layout')
  return { ok: true }
}
