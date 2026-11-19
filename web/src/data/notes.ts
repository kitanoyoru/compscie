import { repositorySnapshot } from './generated/repository'
import type { NoteSummary } from './types'

export const allNotes: readonly NoteSummary[] = repositorySnapshot.notes

export function findNote(topicSlug: string, slug: string): NoteSummary | undefined {
  return allNotes.find((note) => note.topicSlug === topicSlug && note.slug === slug)
}

/** Route of the in-app note reader. */
export function notePath(note: Pick<NoteSummary, 'topicSlug' | 'slug'>): string {
  return `/notes/${note.topicSlug}/${note.slug}`
}
