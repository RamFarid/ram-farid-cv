import 'server-only'
import { countNewContactMsgs } from '@/lib/db/contact'
import { countProjectsByStatus } from '@/lib/db/projects'

/** The figures the console's rail shows on every page. */
export async function getConsoleCounts() {
  const [newMessages, projects] = await Promise.all([countNewContactMsgs(), countProjectsByStatus()])
  return { newMessages, projects }
}
