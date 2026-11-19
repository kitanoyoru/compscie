import type { NoteContent } from '../data/content'

/** Rendered content shaped like scripts/content/notes.mjs output, for mocking loadNote. */
export function sampleNote(path: string): NoteContent {
  return {
    path,
    html: [
      '<blockquote class="note-lead">\n<p>A short summary.</p>\n</blockquote>',
      '<h2 id="questions-this-answers" tabindex="-1">Questions this answers</h2>',
      '<ul>\n<li>What is inside?</li>\n</ul>',
      '<h2 id="notes" tabindex="-1">Notes</h2>',
      '<h3 id="hchan-struct" tabindex="-1"><code>hchan</code> struct</h3>',
      '<p>See <a href="#/notes/go/mutex">Go sync.Mutex</a> and <a href="#/notes/go/channels?section=notes">the notes</a>.</p>',
    ].join('\n'),
    toc: [
      { id: 'questions-this-answers', text: 'Questions this answers', depth: 2 },
      { id: 'notes', text: 'Notes', depth: 2 },
      { id: 'hchan-struct', text: 'hchan struct', depth: 3 },
    ],
  }
}
