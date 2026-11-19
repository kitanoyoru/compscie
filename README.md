# compscie

My learning log: deep-dive notes on whatever I'm studying, plus LeetCode solutions.

## Notes

One folder per subject under [notes/](notes/), notes flat inside it. Start a topic with `make topic NAME=<slug>`, a note with `make note TOPIC=<topic> NOTE=<slug>`.

| Topic | Status | Notes | Focus / next | Started | Last note |
| --- | --- | ---: | --- | --- | --- |
| [ClickHouse](notes/clickhouse/) | active | 6 | MergeTree internals and date-time functions. → Run and write up the date-parts lab. | 2026-10-18 | 2026-11-19 |
| [Go](notes/go/) | active | 18 | Runtime internals and production debugging. → Add pprof and runtime/trace workflows. | 2026-08-23 | 2026-08-23 |

## LeetCode

**637 problems solved**, filed by difficulty - one folder each, with one file per language I solved it in. Full index: [leetcode/README.md](leetcode/README.md).

| | Count |
| --- | ---: |
| [Easy](leetcode/README.md#easy) | 298 |
| [Medium](leetcode/README.md#medium) | 306 |
| [Hard](leetcode/README.md#hard) | 24 |
| [Misc](leetcode/README.md#misc) | 9 |
| **Total** | **637** |

### Languages

![Top languages by solved problems](docs/leetcode-languages.svg)

## Learning platform

A local-first React workspace over this repository, in [web/](web/): Today, Review, Knowledge Map, and LeetCode. Run it with `make platform`, or open the [hosted build](https://kitanoyoru.github.io/compscie/). Tasks, sessions, and settings live only in your browser; the repository stays the source of truth.

- **Review:** a practiced problem comes back 1 day after "needs review", and 3, 7, 14, 30, then 60 days after clean solves. The Review page lists what is due and what is coming up this week; the nav badge counts what is due.
- **Notes:** every note opens inside the workspace from the Knowledge Map, with a table of contents and links between notes. The build checks every note link and heading anchor.
- **Note questions:** each "Questions this answers" bullet is a self-quiz card on the Review page, on the same schedule as problems, with up to 5 new questions a day. Rewording a question starts its card over.
- **Your solutions:** the LeetCode session panel shows your own code for the problem, one tab per language, highlighted at build time. It starts collapsed, so a review starts from memory.
- **Theme** (sun/moon button in the header): flips between light and dark. Landing on your system's theme clears the stored choice, so the app follows the system again.
- **Settings** (button in the header): JSON backup export and import, and reset. Import is validated and asks before replacing anything.
- **Shortcuts:** `/` focuses LeetCode search, `Esc` clears it, `Ctrl/Cmd+Z` triggers Undo while a toast shows, and `Ctrl/Cmd+Enter` saves a practice session.
- Days and weeks follow your local time zone.
- A running timer and reflection draft survive navigation and reload in the same tab.

```sh
make platform-test                          # unit and accessibility tests
yarn --cwd web run check                    # type check
yarn --cwd web playwright install chromium  # first time only
make platform-e2e                           # browser smoke tests
```
