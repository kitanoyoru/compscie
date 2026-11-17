import type { JSX } from 'react'

export function App(): JSX.Element {
  return (
    <>
      <header className="app-header" aria-label="Compscie learning workspace">
        <p className="app-kicker">Personal learning platform</p>
        <h1>Compscie</h1>
      </header>
      <main className="app-main" aria-labelledby="workspace-heading">
        <h2 id="workspace-heading">Learning workspace</h2>
        <p>
          The interactive learning experience is being prepared. This foundation
          will soon connect your notes, topics, and solved problems.
        </p>
      </main>
    </>
  )
}
