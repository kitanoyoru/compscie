import type { JSX } from 'react'
import { Link } from 'react-router'

import { BarList } from '../components/charts'
import { LanguageIcon, languageColorStyle } from '../components/LanguageIcon'
import { usePageTitle } from '../components/RouteEffects'
import { PageHeader, StatTile, formatCount } from '../components/ui'
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
const activeTopics = topics.filter((topic) => topic.status === 'active').length
const latestNote = notes.map((note) => note.date).filter(Boolean).sort().at(-1)

export function KnowledgeMapPage(): JSX.Element {
  usePageTitle('Knowledge Map')
  const now = new Date()
  const otherLanguages = languageRanking.slice(CHART_ROWS)

  return (
    <div className="page">
      <PageHeader
        eyebrow="Knowledge map"
        title="Your learning landscape"
        titleId="map-heading"
        description="Topics you are strengthening, the concepts they cover, and what the repository shows you have practiced."
      />

      <div className="stat-grid" aria-label="Repository statistics" role="group">
        <StatTile label="Active topics" value={activeTopics} hint={`${plural(counts.topics, 'topic')} in total`} />
        <StatTile
          label="Notes"
          value={formatCount(counts.notes)}
          hint={latestNote === undefined ? undefined : `Latest ${formatDay(latestNote, now)}`}
        />
        <StatTile
          label="Solved problems"
          value={formatCount(counts.solvedProblems)}
          hint={`${formatCount(difficulty.easy)} easy · ${formatCount(difficulty.medium)} medium · ${formatCount(difficulty.hard)} hard`}
        />
        <StatTile
          label="Languages"
          value={counts.languages.length}
          hint={
            languageRanking[0] === undefined ? undefined : (
              <>
                Mostly <LanguageIcon language={languageRanking[0].label} size={14} className="inline-lang" />
              </>
            )
          }
        />
      </div>

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
