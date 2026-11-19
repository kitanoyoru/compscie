import type { SolutionContent } from '../data/content'

/** Highlighted content shaped like scripts/content/solutions.mjs output, for mocking loadSolutions. */
export function sampleSolutions(problemId: number): SolutionContent {
  const pre = (lines: readonly string[]) =>
    `<pre class="shiki shiki-themes github-light-default github-dark-default"><code>${lines
      .map((line) => `<span class="line">${line}</span>`)
      .join('\n')}</code></pre>`

  return {
    problemId,
    files: [
      {
        language: 'Go',
        file: 'main.go',
        lines: 3,
        html: pre([
          '<span style="--shiki-light:#CF222E;--shiki-dark:#FF7B72">package</span><span style="--shiki-light:#1F2328;--shiki-dark:#E6EDF3"> main</span>',
          '',
          '<span style="--shiki-light:#1F2328;--shiki-dark:#E6EDF3">func main() {}</span>',
        ]),
      },
      { language: 'Python', file: 'main.py', lines: 1, html: pre(['<span>print(1)</span>']) },
      { language: 'Python', file: 'alt.py', lines: 1, html: pre(['<span>print(2)</span>']) },
    ],
  }
}
