import type { JSX } from 'react'
import { repositorySnapshot } from '../data/generated/repository'
import { mapRelationships } from '../data/map-relationships'

export function KnowledgeMapPage(): JSX.Element {
  const topics = repositorySnapshot.topics.filter((topic) => topic.status === 'active')
  return <section className="map-page" aria-labelledby="map-heading">
    <div className="page-intro"><p className="section-kicker">Knowledge map</p><h2 id="map-heading">Your learning landscape</h2><p>Repository evidence, organized around the concepts you are actively strengthening.</p></div>
    <div className="map-stats" aria-label="Repository statistics"><strong>{repositorySnapshot.counts.notes}<small>notes</small></strong><strong>{repositorySnapshot.counts.solvedProblems}<small>solved problems</small></strong><strong>{repositorySnapshot.counts.languages.length}<small>languages</small></strong></div>
    <div className="topic-grid">{topics.map((topic) => <article className="topic-card" key={topic.slug}><h3>{topic.title}</h3><p>{topic.focus}</p><p><strong>Next:</strong> {topic.next}</p><ul>{repositorySnapshot.notes.filter((note) => note.topicSlug === topic.slug).map((note) => <li key={note.path}><a href={`/${note.path}`}>{note.title}</a></li>)}</ul><p className="concepts"><strong>Connected concepts</strong><br />{mapRelationships.filter((link) => link.topic === topic.slug).map((link) => link.concept).join(' · ')}</p></article>)}</div>
  </section>
}
