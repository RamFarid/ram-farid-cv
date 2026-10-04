import 'server-only'
import { countNewContactMsgs } from '@/lib/db/contact'
import { countProjectsByStatus } from '@/lib/db/projects'

// Client components import it from ./constants; this file is server-only.
export { CONSOLE_TIME_ZONE } from './constants'

/** The figures the console's rail shows on every page. */
export async function getConsoleCounts() {
  const [newMessages, projects] = await Promise.all([countNewContactMsgs(), countProjectsByStatus()])
  return { newMessages, projects }
}
