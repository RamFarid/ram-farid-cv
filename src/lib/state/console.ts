import { atom } from 'jotai'

/**
 * Console drafts with unsaved edits, by key (a home-page section, or `project`): the rail marks them and leaving the
 * page warns. See docs/console.md#saving
 */
export const dirtySectionsAtom = atom<ReadonlySet<string>>(new Set<string>())
