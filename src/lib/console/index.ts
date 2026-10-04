import 'server-only'
import { countNewContactMsgs } from '@/lib/db/contact'
import { countProjectsByStatus } from '@/lib/db/projects'

/** Ram works from Cairo; console times are shown there, so server and browser render the same text. */
export const CONSOLE_TIME_ZONE = 'Africa/Cairo'

/** The figures the console's rail shows on every page. */
export async function getConsoleCounts() {
  const [newMessages, projects] = await Promise.all([countNewContactMsgs(), countProjectsByStatus()])
  return { newMessages, projects }
}
