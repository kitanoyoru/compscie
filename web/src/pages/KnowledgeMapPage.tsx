import { useEffect, type JSX } from 'react'
import { Link, useSearchParams } from 'react-router'

import { BarList, SegmentedBar } from '../components/charts'
import { LanguageIcon, LanguageIconList, languageColorStyle } from '../components/LanguageIcon'
import { usePageTitle } from '../components/RouteEffects'
import { DIFFICULTY_LABELS, PageHeader, formatCount } from '../components/ui'
import { repositorySnapshot } from '../data/generated/repository'
import type { TopicStatus } from '../data/types'
import { difficultyCounts, rankCounts } from '../domain/insights'
import { formatDay, plural } from '../lib/format'
import { TopicCard } from './map/TopicCard'

const CHART_ROWS = 12
const STATUS_ORDER: readonly TopicStatus[] = ['active', 'planned', 'paused', 'done']

const { counts, notes, problems } = repositorySnapshot
const topics = [...repositorySnapshot.topics].sort(
  (left, right) =>
    STATUS_ORDER.indexOf(left.status) - STATUS_ORDER.indexOf(right.status) ||
    left.title.localeCompare(right.title),
)
const languageRanking = rankCounts(problems.flatMap((problem) => problem.languages))
const patternRanking = rankCounts(problems.flatMap((problem) => problem.tags))
const difficulty = difficultyCounts(problems)
const difficultySegments = (['easy', 'medium', 'hard'] as const).map((key) => ({
  key,
  label: DIFFICULTY_LABELS[key],
  value: difficulty[key],
}))
const activeTopics = topics.filter((topic) => topic.status === 'active').length
const latestNote = notes.map((note) => note.date).filter(Boolean).sort().at(-1)

export function KnowledgeMapPage(): JSX.Element {
  usePageTitle('Knowledge Map')
  const now = new Date()
  const [params] = useSearchParams()
  const focusTopic = params.get('topic')

  // `/map?topic=go` (from search) brings that topic's card into view; it runs after the route's
  // own focus on the page title, so it wins.
  useEffect(() => {
    if (focusTopic === null) {
      return
    }

    const heading = document.getElementById(`topic-${focusTopic}-heading`)
    heading?.scrollIntoView?.({ block: 'start' })
    heading?.focus({ preventScroll: true })
  }, [focusTopic])
  const otherLanguages = languageRanking.slice(CHART_ROWS)

  return (
    <div className="page">
      <PageHeader title="Knowledge Map" titleId="map-heading" />

      <section className="card summary-strip" aria-label="Repository summary">
        <dl className="summary-facts">
          <div className="summary-fact">
            <dt>Active topics</dt>
            <dd>
              <span className="summary-value">{activeTopics}</span>
              <span className="summary-hint">of {counts.topics}</span>
            </dd>
          </div>
          <div className="summary-fact">
            <dt>Notes</dt>
            <dd>
              <span className="summary-value">{formatCount(counts.notes)}</span>
              {latestNote !== undefined && (
                <span className="summary-hint">latest {formatDay(latestNote, now)}</span>
              )}
            </dd>
          </div>
          <div className="summary-fact summary-fact-wide">
            <dt>Solved problems</dt>
            <dd>
              <span className="summary-value">{formatCount(counts.solvedProblems)}</span>
              <SegmentedBar segments={difficultySegments} label="Solved problems by difficulty" />
            </dd>
          </div>
          <div className="summary-fact">
            <dt>Languages</dt>
            <dd>
              <span className="summary-value">{counts.languages.length}</span>
              <LanguageIconList languages={languageRanking.map((entry) => entry.label)} max={5} />
            </dd>
          </div>
        </dl>
      </section>

      <div className="topic-grid">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} now={now} />
        ))}
      </div>

      <div className="chart-grid">
        <section className="card" aria-labelledby="languages-heading">
          <div className="card-header">
            <div>
              <h2 id="languages-heading">Languages</h2>
              <p className="card-subtitle">Solved problems per language. A problem can count for several.</p>
            </div>
          </div>
          <BarList
            label="Solved problems per language"
            unit="problem"
            items={languageRanking.slice(0, CHART_ROWS).map((entry) => ({
              label: entry.label,
              value: entry.count,
              to: `/leetcode?language=${encodeURIComponent(entry.label)}`,
              icon: <LanguageIcon language={entry.label} size={16} decorative />,
              colorStyle: languageColorStyle(entry.label),
            }))}
          />
          {otherLanguages.length > 0 && (
            <div className="card-footnote also-languages">
              <span id="also-languages-label">Also</span>
              <ul aria-labelledby="also-languages-label">
                {otherLanguages.map((entry) => (
                  <li key={entry.label}>
                    <Link
                      to={`/leetcode?language=${encodeURIComponent(entry.label)}`}
                      aria-label={`${entry.label}, ${plural(entry.count, 'problem')}`}
                      title={`${entry.label}: ${plural(entry.count, 'problem')}`}
                    >
                      <LanguageIcon language={entry.label} size={14} decorative />
                      <span aria-hidden="true">{entry.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="card" aria-labelledby="patterns-heading">
          <div className="card-header">
            <div>
              <h2 id="patterns-heading">Most practiced patterns</h2>
              <p className="card-subtitle">
                Top {CHART_ROWS} of {patternRanking.length} LeetCode tags across your solutions.
              </p>
            </div>
          </div>
          <BarList
            label="Solved problems per pattern"
            unit="problem"
            items={patternRanking.slice(0, CHART_ROWS).map((entry) => ({
              label: entry.label,
              value: entry.count,
              to: `/leetcode?tag=${encodeURIComponent(entry.label)}`,
            }))}
          />
        </section>
      </div>
    </div>
  )
}
