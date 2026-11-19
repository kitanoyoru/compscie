export type TopicStatus = 'active' | 'planned' | 'paused' | 'done'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TopicSummary {
  readonly slug: string
  readonly title: string
  readonly status: TopicStatus
  readonly focus: string
  readonly next: string
  readonly started: string
  readonly lastNote: string | null
  readonly noteCount: number
}

export interface NoteSummary {
  readonly topicSlug: string
  readonly title: string
  readonly filename: string
  readonly path: string
  readonly date: string
}

export interface SolvedProblem {
  readonly id: number
  readonly title: string
  readonly difficulty: Difficulty
  readonly languages: readonly string[]
  readonly tags: readonly string[]
  readonly path: string
}

export interface RepositorySnapshot {
  readonly generatedAt: string
  readonly topics: readonly TopicSummary[]
  readonly notes: readonly NoteSummary[]
  readonly problems: readonly SolvedProblem[]
  readonly counts: {
    readonly topics: number
    readonly notes: number
    readonly solvedProblems: number
    readonly languages: readonly string[]
  }
}
