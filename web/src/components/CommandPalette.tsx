import { useEffect, useId, useRef, useState, type JSX, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'

import { loadNoteHeadings } from '../data/content'
import { repositorySnapshot } from '../data/generated/repository'
import { allNotes } from '../data/notes'
import {
  PAGE_ITEMS,
  search,
  sectionItems,
  snapshotItems,
  type SearchItem,
  type SearchKind,
} from '../domain/search'
import { useTheme } from '../state/theme'
import { Icon, type IconName } from './Icon'
import { LanguageIconList } from './LanguageIcon'

const SNAPSHOT_ITEMS = snapshotItems(repositorySnapshot)

const KIND_LABELS: Record<SearchKind, string> = {
  page: 'Page',
  action: 'Action',
  topic: 'Topic',
  note: 'Note',
  section: 'Section',
  problem: 'Problem',
}

const KIND_ICONS: Record<SearchKind, IconName> = {
  page: 'arrowRight',
  action: 'sparkle',
  topic: 'map',
  note: 'book',
  section: 'book',
  problem: 'code',
}

interface CommandPaletteProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onOpenSettings: () => void
}

/** Search everything in the workspace and run a few actions. Opened from the header or with ⌘K / Ctrl+K. */
export function CommandPalette({ open, onClose, onOpenSettings }: CommandPaletteProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current

    if (element === null) {
      return
    }

    if (open && !element.open) {
      element.showModal()
    } else if (!open && element.open) {
      element.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="palette-dialog"
      aria-label="Search"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          // Claim the key so the toast's global Escape handler leaves its toast alone.
          event.preventDefault()
          onClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      {open && <PaletteContent onClose={onClose} onOpenSettings={onOpenSettings} />}
    </dialog>
  )
}

function PaletteContent({ onClose, onOpenSettings }: Omit<CommandPaletteProps, 'open'>): JSX.Element {
  const navigate = useNavigate()
  const { effective, toggle } = useTheme()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [sections, setSections] = useState<readonly SearchItem[]>([])
  const actions: SearchItem[] = [
    {
      id: 'action:theme',
      kind: 'action',
      title: `Switch to ${effective === 'dark' ? 'light' : 'dark'} theme`,
      run: toggle,
    },
    { id: 'action:settings', kind: 'action', title: 'Open settings', run: onOpenSettings },
  ]
  const results = search([...PAGE_ITEMS, ...actions, ...SNAPSHOT_ITEMS, ...sections], query)
  const activeIndex = Math.min(active, results.length - 1)
  const optionId = (index: number) => `${listId}-option-${index}`

  // Note sections come from a small generated index, fetched once per opening.
  useEffect(() => {
    let alive = true

    loadNoteHeadings().then(
      (index) => {
        if (alive && index !== undefined) {
          setSections(sectionItems(index, allNotes))
        }
      },
      () => undefined,
    )

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' })
  })

  function runItem(item: SearchItem): void {
    onClose()

    if (item.run !== undefined) {
      item.run()
    } else if (item.to !== undefined) {
      navigate(item.to)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.nativeEvent.isComposing || results.length === 0) {
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((activeIndex + step + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[activeIndex]

      if (item !== undefined) {
        runItem(item)
      }
    }
  }

  return (
    <div className="palette">
      <div className="palette-search">
        <Icon name="search" size={18} />
        <input
          className="palette-input"
          type="text"
          role="combobox"
          aria-label="Search the workspace"
          aria-expanded={results.length > 0}
          aria-controls={results.length > 0 ? listId : undefined}
          aria-activedescendant={results.length > 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          placeholder="Search pages, notes, sections, problems…"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <kbd className="palette-esc" aria-hidden="true">
          Esc
        </kbd>
      </div>

      <p className="sr-only" role="status">
        {results.length === 0 ? 'No matches' : `${results.length} results`}
      </p>

      {results.length === 0 ? (
        <p className="empty-line palette-empty">No matches for “{query.trim()}”.</p>
      ) : (
        <ul id={listId} className="palette-results" role="listbox" aria-label="Results">
          {results.map((item, index) => (
            <li
              key={item.id}
              id={optionId(index)}
              className="palette-option"
              role="option"
              aria-selected={index === activeIndex}
              aria-label={`${item.title}${item.subtitle === undefined ? '' : `, ${item.subtitle}`}, ${KIND_LABELS[item.kind]}`}
              onMouseMove={() => {
                if (index !== activeIndex) {
                  setActive(index)
                }
              }}
              onClick={() => runItem(item)}
            >
              <Icon name={KIND_ICONS[item.kind]} size={16} />
              <span className="palette-text">
                <span className="palette-title">{item.title}</span>
                {item.subtitle !== undefined && item.subtitle !== '' && (
                  <span className="palette-subtitle">{item.subtitle}</span>
                )}
              </span>
              {item.languages !== undefined && (
                <LanguageIconList languages={item.languages} max={3} size={14} decorative />
              )}
              <span className="palette-kind">{KIND_LABELS[item.kind]}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="palette-hint" aria-hidden="true">
        ↑ ↓ to move · Enter to open · Esc to close
      </p>
    </div>
  )
}
