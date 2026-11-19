import { repositorySnapshot } from './generated/repository'
import type { TopicSummary } from './types'

const topicsBySlug = new Map<string, TopicSummary>(
  repositorySnapshot.topics.map((topic) => [topic.slug, topic]),
)

export function findTopic(slug: string | undefined): TopicSummary | undefined {
  return slug === undefined ? undefined : topicsBySlug.get(slug)
}

/** Display name for a task's topic id; falls back to the raw id for topics no longer in the repository. */
export function topicTitle(slug: string | undefined): string | undefined {
  return slug === undefined ? undefined : (topicsBySlug.get(slug)?.title ?? slug)
}
