import { useId, useRef, useState, type JSX, type KeyboardEvent } from 'react'

import { CodeBlock } from '../../components/CodeBlock'
import { Icon } from '../../components/Icon'
import { LanguageIcon, LanguageIconList } from '../../components/LanguageIcon'
import { useToast } from '../../components/Toast'
import { ExternalLink } from '../../components/ui'
import { loadSolutions, type SolutionContent, type SolutionFileContent } from '../../data/content'
import { repositoryFileUrl, repositoryTreeUrl } from '../../data/links'
import type { SolvedProblem } from '../../data/types'
import { plural } from '../../lib/format'

type LoadState =
  | { readonly status: 'idle' | 'loading' | 'missing' | 'error' }
  | { readonly status: 'ready'; readonly content: SolutionContent }

/** "Go", or "Python (2)" for a second file in the same language. */
function tabNames(files: readonly SolutionFileContent[]): string[] {
  const seen = new Map<string, number>()

  return files.map((file) => {
    const count = (seen.get(file.language) ?? 0) + 1
    seen.set(file.language, count)
    return count === 1 ? file.language : `${file.language} (${count})`
  })
}

/**
 * The user's own solutions, collapsed by default so a review starts from memory. Opening it loads
 * the problem's highlighted files (one lazy chunk) and shows one tab per file.
 */
export function SolutionViewer({ problem }: { readonly problem: SolvedProblem }): JSX.Element {
  const showToast = useToast()
  const baseId = useId()
  const labelId = `${baseId}-label`
  const panelId = `${baseId}-panel`
  const [open, setOpen] = useState(false)
  const [load, setLoad] = useState<LoadState>({ status: 'idle' })
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const code = useRef<HTMLDivElement>(null)
  const files = load.status === 'ready' ? load.content.files : []
  const names = tabNames(files)
  const file = files[selected]
  const folderUrl = repositoryTreeUrl(problem.path)

  function toggle(): void {
    const next = !open

    setOpen(next)

    if (next && load.status === 'idle') {
      setLoad({ status: 'loading' })
      loadSolutions(problem.id).then(
        (content) => setLoad(content === undefined ? { status: 'missing' } : { status: 'ready', content }),
        () => setLoad({ status: 'error' }),
      )
    }
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const last = files.length - 1
    const next =
      event.key === 'ArrowRight'
        ? selected === last
          ? 0
          : selected + 1
        : event.key === 'ArrowLeft'
          ? selected === 0
            ? last
            : selected - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : undefined

    if (next === undefined) {
      return
    }

    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }

  async function copy(current: SolutionFileContent): Promise<void> {
    const text = code.current?.querySelector('pre')?.textContent ?? ''

    try {
      await navigator.clipboard.writeText(text)
      showToast({ message: `Copied ${current.file}` })
    } catch {
      showToast({ message: 'Could not copy: the clipboard is not available here' })
    }
  }

  return (
    <div className="solution-viewer">
      <div className="session-solutions">
        <span className="session-solutions-label" id={labelId}>
          Solutions
        </span>
        {load.status === 'ready' && open ? (
          <div className="solution-tabs" role="tablist" aria-labelledby={labelId}>
            {files.map((item, index) => (
              <button
                key={item.file}
                ref={(element) => {
                  tabs.current[index] = element
                }}
                id={`${panelId}-tab-${index}`}
                type="button"
                role="tab"
                className="solution-tab"
                aria-selected={index === selected}
                aria-controls={`${panelId}-code`}
                tabIndex={index === selected ? 0 : -1}
                title={item.file}
                onClick={() => setSelected(index)}
                onKeyDown={onTabKeyDown}
              >
                <LanguageIcon language={item.language} size={18} decorative />
                <span className="sr-only">{names[index]}</span>
              </button>
            ))}
          </div>
        ) : (
          <LanguageIconList languages={problem.languages} max={6} size={18} />
        )}
        <button
          type="button"
          className="button button-quiet button-small solution-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <Icon name="code" size={14} />
          {open ? 'Hide code' : 'Show my solution'}
        </button>
      </div>

      <div id={panelId} className="solution-panel" hidden={!open}>
        {load.status === 'loading' && (
          <div className="code-skeleton" aria-busy="true">
            Loading solution…
          </div>
        )}
        {(load.status === 'missing' || load.status === 'error') && (
          <p className="empty-line">
            {load.status === 'missing' ? (
              <>
                Solution not built yet. Run <code>yarn --cwd web run generate:data</code>.
              </>
            ) : (
              'Could not load this solution.'
            )}{' '}
            <ExternalLink className="text-link" href={folderUrl}>
              View on GitHub
            </ExternalLink>
          </p>
        )}
        {file !== undefined && (
          <div
            className="solution-tabpanel"
            role="tabpanel"
            id={`${panelId}-code`}
            aria-labelledby={`${panelId}-tab-${selected}`}
          >
            <div className="solution-toolbar">
              <span className="solution-file">{file.file}</span>
              <span className="muted">{plural(file.lines, 'line')}</span>
              <span className="solution-actions">
                <button type="button" className="text-button" onClick={() => void copy(file)}>
                  <Icon name="copy" size={14} />
                  Copy
                </button>
                <ExternalLink className="text-link" href={repositoryFileUrl(`${problem.path}/${file.file}`)}>
                  GitHub
                </ExternalLink>
              </span>
            </div>
            <CodeBlock ref={code} html={file.html} label={`${names[selected]} solution, ${file.file}`} />
          </div>
        )}
      </div>
    </div>
  )
}
