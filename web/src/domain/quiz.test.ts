import { describe, expect, it } from 'vitest'

import type { NoteSummary, TopicSummary } from '../data/types'
import type { CardReview } from './personal-types'
import { NEW_CARDS_PER_DAY, cardId, questionSlug, quizCards, quizQueue } from './quiz'

function topic(slug: string, status: TopicSummary['status']): TopicSummary {
  return { slug, title: slug, status, focus: '', next: '', started: '2026-01-01', lastNote: null, noteCount: 1, concepts: [] }
}

function note(topicSlug: string, slug: string, date: string, questions: readonly string[]): NoteSummary {
  return {
    topicSlug,
    slug,
    title: slug,
    filename: `${slug}.md`,
    path: `notes/${topicSlug}/${slug}.md`,
    date,
    concepts: [],
    questions,
  }
}

const snapshot = {
  topics: [topic('paused', 'paused'), topic('go', 'active')],
  notes: [
    note('paused', 'old', '2026-11-18', ['Paused question?']),
    note('go', 'older', '2026-10-01', ['Older one?', 'Older two?']),
    note('go', 'newer', '2026-11-01', ['Why is `x` slow?', 'Second?', 'Why is x slow?']),
  ],
}

// Nov 19, 10:00 in Los Angeles.
const now = new Date('2026-11-19T18:00:00.000Z')

function review(id: string, reviewedAt: string, outcome: CardReview['outcome'] = 'success'): CardReview {
  return { cardId: id, reviewedAt, outcome }
}

describe('question cards', () => {
  it('slugs questions into stable ids', () => {
    expect(questionSlug('Why is `x` slow?')).toBe('why-is-x-slow')
    expect(cardId({ path: 'notes/go/a.md' }, 'What is a GCShape?')).toBe('notes/go/a.md::what-is-a-gcshape')
  })

  it('orders active topics first, newest notes first, and drops duplicate ids', () => {
    expect(quizCards(snapshot).map((card) => card.question)).toEqual([
      'Why is `x` slow?',
      'Second?',
      'Older one?',
      'Older two?',
      'Paused question?',
    ])
  })
})

describe('quiz queue', () => {
  const cards = quizCards(snapshot)

  it('offers the first new cards up to the daily allowance', () => {
    const queue = quizQueue(snapshot, [], now)

    expect(queue.due).toEqual([])
    expect(queue.fresh.map((card) => card.id)).toEqual(cards.slice(0, NEW_CARDS_PER_DAY).map((card) => card.id))
    expect(queue.unseen).toBe(cards.length)
  })

  it('counts cards first reviewed today against the allowance', () => {
    const reviews = [review(cards[0]!.id, '2026-11-19T17:00:00.000Z'), review(cards[1]!.id, '2026-11-19T17:05:00.000Z')]
    const queue = quizQueue(snapshot, reviews, now)

    expect(queue.fresh.map((card) => card.id)).toEqual(cards.slice(2, NEW_CARDS_PER_DAY).map((card) => card.id))
    expect(queue.unseen).toBe(cards.length - 2)
  })

  it('brings reviewed cards back on the review schedule, most overdue first', () => {
    const reviews = [
      review(cards[0]!.id, '2026-11-18T18:00:00.000Z', 'needs-review'), // due Nov 19
      review(cards[1]!.id, '2026-11-01T18:00:00.000Z'), // due Nov 4
      review(cards[2]!.id, '2026-11-19T17:00:00.000Z'), // due Nov 22
    ]
    const queue = quizQueue(snapshot, reviews, now)

    expect(queue.due.map((item) => [item.card.id, item.schedule.dueDay])).toEqual([
      [cards[1]!.id, '2026-11-04'],
      [cards[0]!.id, '2026-11-19'],
    ])
  })

  it('ignores reviews of questions that no longer exist', () => {
    const queue = quizQueue(snapshot, [review('notes/go/newer.md::reworded', '2026-11-01T18:00:00.000Z')], now)

    expect(queue.due).toEqual([])
    expect(queue.unseen).toBe(cards.length)
  })
})
