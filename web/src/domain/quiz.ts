import type { NoteSummary, RepositorySnapshot, TopicStatus } from '../data/types'
import { dayKeyOf, localDayKey } from '../lib/calendar'
import type { CardReview } from './personal-types'
import { isDue, scheduleFrom, type ReviewSchedule } from './review-schedule'

/** New questions introduced per local day, so 120+ questions do not arrive at once. */
export const NEW_CARDS_PER_DAY = 5

const STATUS_ORDER: readonly TopicStatus[] = ['active', 'planned', 'paused', 'done']

export interface QuizCard {
  readonly id: string
  readonly question: string
  readonly note: NoteSummary
}

export interface ScheduledCard {
  readonly card: QuizCard
  readonly schedule: ReviewSchedule
}

export interface QuizQueue {
  /** Cards due today or earlier, most overdue first. */
  readonly due: readonly ScheduledCard[]
  /** Never-reviewed cards still allowed today, in study order. */
  readonly fresh: readonly QuizCard[]
  /** Never-reviewed cards in total, including ones held back for later days. */
  readonly unseen: number
}

/** Lowercase words joined by hyphens: "Why is `x` slow?" becomes "why-is-x-slow". */
export function questionSlug(question: string): string {
  return question
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Stable while the question's wording stays the same; rewording a question starts it over. */
export function cardId(note: Pick<NoteSummary, 'path'>, question: string): string {
  return `${note.path}::${questionSlug(question)}`
}

/** Every question card in study order: active topics first, newest notes first, questions in note order. */
export function quizCards(snapshot: Pick<RepositorySnapshot, 'topics' | 'notes'>): QuizCard[] {
  const rank = new Map(snapshot.topics.map((topic) => [topic.slug, STATUS_ORDER.indexOf(topic.status)]))
  const notes = [...snapshot.notes].sort(
    (left, right) =>
      (rank.get(left.topicSlug) ?? STATUS_ORDER.length) - (rank.get(right.topicSlug) ?? STATUS_ORDER.length) ||
      right.date.localeCompare(left.date) ||
      left.path.localeCompare(right.path),
  )
  const seen = new Set<string>()

  return notes.flatMap((note) =>
    note.questions.flatMap((question) => {
      const id = cardId(note, question)

      if (seen.has(id)) {
        return []
      }

      seen.add(id)
      return [{ id, question, note }]
    }),
  )
}

/** What to study today: due cards first, then up to the day's allowance of new ones. */
export function quizQueue(
  snapshot: Pick<RepositorySnapshot, 'topics' | 'notes'>,
  reviews: readonly CardReview[],
  now: Date,
): QuizQueue {
  const today = dayKeyOf(now)
  const reviewsByCard = new Map<string, CardReview[]>()

  for (const review of reviews) {
    const list = reviewsByCard.get(review.cardId) ?? []
    list.push(review)
    reviewsByCard.set(review.cardId, list)
  }

  const due: ScheduledCard[] = []
  const unseen: QuizCard[] = []
  let introducedToday = 0

  for (const card of quizCards(snapshot)) {
    const list = reviewsByCard.get(card.id)
    const schedule = list === undefined ? undefined : scheduleFrom(list.map((review) => ({ endedAt: review.reviewedAt, outcome: review.outcome })))

    if (list === undefined || schedule === undefined) {
      unseen.push(card)
      continue
    }

    const firstDay = list.map((review) => localDayKey(review.reviewedAt)).filter((day) => day !== undefined).sort()[0]

    if (firstDay === today) {
      introducedToday += 1
    }

    if (isDue(schedule, today)) {
      due.push({ card, schedule })
    }
  }

  due.sort((left, right) => left.schedule.dueDay.localeCompare(right.schedule.dueDay))

  return {
    due,
    fresh: unseen.slice(0, Math.max(0, NEW_CARDS_PER_DAY - introducedToday)),
    unseen: unseen.length,
  }
}
