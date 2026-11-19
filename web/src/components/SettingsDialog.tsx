import { useEffect, useId, useRef, useState, type ChangeEvent, type JSX, type KeyboardEvent } from 'react'

import type { PersonalLearningState } from '../domain/personal-types'
import { plural } from '../lib/format'
import { MAX_BACKUP_BYTES, backupFilename, createBackup, readBackup } from '../state/backup'
import { useLearningDispatch, useLearningState } from '../state/learning-state'
import { clearAllSessionDrafts } from '../state/session-draft'
import { Icon } from './Icon'
import { useToast } from './Toast'

function describeCounts(state: PersonalLearningState): string {
  return `${plural(state.tasks.length, 'task')} and ${plural(state.sessions.length, 'session')}`
}

function downloadBackup(state: PersonalLearningState): void {
  const now = new Date()
  const url = URL.createObjectURL(new Blob([createBackup(state, now)], { type: 'application/json' }))
  const link = document.createElement('a')

  link.href = url
  link.download = backupFilename(now)
  document.body.append(link)
  link.click()
  link.remove()
  // Revoking immediately can cancel the download in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return file.text()
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

function SettingsContent(): JSX.Element {
  const state = useLearningState()
  const dispatch = useLearningDispatch()
  const showToast = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<PersonalLearningState | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const readId = useRef(0)
  const mounted = useRef(true)
  const importCancel = useRef<HTMLButtonElement>(null)
  const resetCancel = useRef<HTMLButtonElement>(null)
  const resetButton = useRef<HTMLButtonElement>(null)
  const resetWasConfirming = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (pending !== null) {
      importCancel.current?.focus()
    }
  }, [pending])

  // Leaving the confirmation removes the focused button; hand focus back to the trigger.
  useEffect(() => {
    if (resetWasConfirming.current && !confirmingReset) {
      resetButton.current?.focus()
    } else if (!resetWasConfirming.current && confirmingReset) {
      resetCancel.current?.focus()
    }

    resetWasConfirming.current = confirmingReset
  }, [confirmingReset])

  function clearFile(): void {
    if (fileInput.current !== null) {
      fileInput.current.value = ''
    }
  }

  async function chooseFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]

    readId.current += 1
    const requestId = readId.current

    setPending(null)
    setImportError(null)

    if (file === undefined) {
      return
    }

    if (file.size > MAX_BACKUP_BYTES) {
      setImportError('This file is larger than 5 MB.')
      clearFile()
      return
    }

    let text: string

    try {
      text = await readFileText(file)
    } catch {
      if (mounted.current && requestId === readId.current) {
        setImportError('This file could not be read.')
        clearFile()
      }
      return
    }

    if (!mounted.current || requestId !== readId.current) {
      return
    }

    const result = readBackup(text)

    if (result.ok) {
      setPending(result.state)
    } else {
      setImportError(result.error)
      clearFile()
    }
  }

  function cancelImport(): void {
    readId.current += 1
    setPending(null)
    clearFile()
    fileInput.current?.focus()
  }

  function confirmImport(): void {
    if (pending === null) {
      return
    }

    dispatch({ type: 'stateReplaced', state: pending })
    clearAllSessionDrafts()
    showToast({ message: 'Backup restored' })
    setPending(null)
    clearFile()
    fileInput.current?.focus()
  }

  function confirmReset(): void {
    dispatch({ type: 'stateReset' })
    clearAllSessionDrafts()
    showToast({ message: 'Working state cleared' })
    setConfirmingReset(false)
  }

  return (
    <>
      <section className="settings-section" aria-labelledby="settings-data">
        <h3 id="settings-data" className="settings-heading">
          Your data
        </h3>
        <p className="settings-note">
          {plural(state.tasks.length, 'task')} · {plural(state.sessions.length, 'practice session')}
          {state.cardReviews.length > 0 && <> · {plural(state.cardReviews.length, 'question answer')}</>}
        </p>
        <div className="settings-actions">
          <button type="button" className="button" onClick={() => downloadBackup(state)}>
            <Icon name="download" size={14} />
            Export backup
          </button>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="settings-import">
            Import backup
          </label>
          <input
            ref={fileInput}
            id="settings-import"
            className="input"
            type="file"
            accept=".json,application/json"
            onChange={(event) => void chooseFile(event)}
          />
        </div>
        {importError !== null && (
          <p role="alert" className="settings-error">
            {importError}
          </p>
        )}
        {pending !== null && (
          <div className="settings-confirm">
            <p>
              Replace {describeCounts(state)} with {describeCounts(pending)}?
            </p>
            <div className="settings-actions">
              <button type="button" className="button button-primary" onClick={confirmImport}>
                <Icon name="upload" size={14} />
                Replace my data
              </button>
              <button ref={importCancel} type="button" className="button button-quiet" onClick={cancelImport}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="settings-section" aria-labelledby="settings-reset">
        <h3 id="settings-reset" className="settings-heading">
          Reset
        </h3>
        {confirmingReset ? (
          <div className="settings-confirm">
            <p>This deletes all tasks and practice sessions stored in this browser. It cannot be undone.</p>
            <div className="settings-actions">
              <button type="button" className="button button-danger" onClick={confirmReset}>
                <Icon name="trash" size={14} />
                Yes, delete everything
              </button>
              <button
                ref={resetCancel}
                type="button"
                className="button button-quiet"
                onClick={() => setConfirmingReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-actions">
            <button
              ref={resetButton}
              type="button"
              className="button button-danger-quiet"
              onClick={() => setConfirmingReset(true)}
            >
              <Icon name="trash" size={14} />
              Reset working state
            </button>
          </div>
        )}
      </section>
    </>
  )
}

interface SettingsDialogProps {
  readonly open: boolean
  readonly onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

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

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>): void {
    if (event.key === 'Escape') {
      // Claim the key so the toast's global Escape handler leaves its toast alone.
      event.preventDefault()
      onClose()
    }
  }

  return (
    <dialog
      ref={dialog}
      className="settings-dialog"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
    >
      <div className="settings-header">
        <h2 id={titleId} className="settings-title">
          Settings
        </h2>
        <button type="button" className="button button-quiet button-small" onClick={onClose}>
          Close
        </button>
      </div>
      {open && <SettingsContent />}
    </dialog>
  )
}
