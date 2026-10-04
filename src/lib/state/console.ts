import { atom } from 'jotai'
import type { HomeSection } from '@/lib/validations/home'

/** Home-page sections with unsaved edits: the rail marks them and leaving the page warns. See docs/console.md#saving */
export const dirtySectionsAtom = atom<ReadonlySet<HomeSection>>(new Set<HomeSection>())
