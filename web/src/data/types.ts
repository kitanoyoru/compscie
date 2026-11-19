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
  /** Concepts in display order, from the topic README's `concepts:` frontmatter. */
  readonly concepts: readonly string[]
}

export interface NoteSummary {
  readonly topicSlug: string
  /** File name without `.md`; the note reader lives at `/notes/<topicSlug>/<slug>`. */
  readonly slug: string
  readonly title: string
  readonly filename: string
  readonly path: string
  readonly date: string
  /** Concepts this note covers, from its `concepts:` frontmatter; each one is in its topic's list. */
  readonly concepts: readonly string[]
  /** Plain-text bullets under `## Questions this answers`; each one is a self-quiz card. */
  readonly questions: readonly string[]
}

export interface SolutionFile {
  readonly language: string
  /** Path inside the problem folder, usually just the file name, such as `main.go`. */
  readonly file: string
}

export interface SolvedProblem {
  readonly id: number
  readonly title: string
  readonly difficulty: Difficulty
  readonly languages: readonly string[]
  readonly solutions: readonly SolutionFile[]
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
