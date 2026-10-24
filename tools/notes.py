#!/usr/bin/env python3
"""
Housekeeping for notes/<topic>/ so READMEs never need hand edits.

    python3 tools/notes.py new-topic clickhouse
    python3 tools/notes.py new-note clickhouse data-part
    python3 tools/notes.py sync          # date new notes, regenerate READMEs
    python3 tools/notes.py pre-commit    # sync, then stage the results

Layout (see notes/_template/):

- one folder per topic, notes sit flat inside it: notes/<topic>/<note>.md
- each note opens with a `date: YYYY-MM-DD` frontmatter block; a note
  without one gets today's date on the next sync
- topic README frontmatter `title` / `status` / `started` feeds the root
  README table; its note list between the NOTES_START / NOTES_END markers
  is regenerated, newest first
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
NOTES = REPO / "notes"
TEMPLATE = NOTES / "_template"
# Written by organize.build_readmes(); staged by the pre-commit hook.
GENERATED = ["README.md", "leetcode/README.md", "docs/leetcode-languages.svg"]

STATUS_ORDER = ["active", "paused", "planned", "done"]
SLUG = re.compile(r"[a-z0-9][a-z0-9-]*")
FRONTMATTER = re.compile(r"---\n(.*?)\n---\n", re.DOTALL)
NOTES_START = "<!-- notes:start - generated, newest first -->"
NOTES_END = "<!-- notes:end -->"


def today() -> str:
    return dt.date.today().isoformat()


def topics() -> list[Path]:
    # `_template` and other `_`-prefixed folders are scaffolding, not topics.
    if not NOTES.is_dir():
        return []
    return sorted(
        x for x in NOTES.iterdir() if x.is_dir() and not x.name.startswith("_")
    )


def topic_notes(topic: Path) -> list[Path]:
    return sorted(f for f in topic.glob("*.md") if f.name != "README.md")


def frontmatter(text: str) -> dict[str, str]:
    """Read the `key: value` block at the top of a markdown file."""
    meta: dict[str, str] = {}
    m = FRONTMATTER.match(text)
    if m:
        for line in m.group(1).splitlines():
            key, sep, value = line.partition(":")
            if sep:
                meta[key.strip()] = value.strip()
    return meta


def note_meta(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    meta = frontmatter(text)
    title = next(
        (line[2:].strip() for line in text.splitlines() if line.startswith("# ")),
        path.stem,
    )
    meta.setdefault("title", title)
    meta.setdefault("date", "")
    return meta


# ---------------------------------------------------------------- root readme


def topic_meta(topic: Path) -> dict[str, str]:
    """Frontmatter of a topic README.

    Missing README or frontmatter is fine - title falls back to the folder name
    and status/started stay blank.
    """
    readme = topic / "README.md"
    meta = frontmatter(readme.read_text(encoding="utf-8")) if readme.is_file() else {}
    meta.setdefault("title", topic.name)
    return meta


def build_notes_section() -> list[str]:
    rows = []
    for t in topics():
        meta = topic_meta(t)
        status = meta.get("status", "").lower()
        rank = (
            STATUS_ORDER.index(status) if status in STATUS_ORDER else len(STATUS_ORDER)
        )
        dates = [d for d in (note_meta(f)["date"] for f in topic_notes(t)) if d]
        rows.append(
            (rank, t.name, meta, status, len(topic_notes(t)), max(dates, default=""))
        )
    if not rows:
        return []

    out = [
        "## Notes",
        "",
        "One folder per subject under [notes/](notes/), notes flat inside it. "
        "Start a topic with `make topic NAME=<slug>`, a note with "
        "`make note TOPIC=<topic> NOTE=<slug>`.",
        "",
        "| Topic | Status | Notes | Started | Last note |",
        "| --- | --- | ---: | --- | --- |",
    ]
    for _, name, meta, status, count, last in sorted(rows):
        out.append(
            f"| [{meta['title']}](notes/{name}/) | {status or '-'} | {count} "
            f"| {meta.get('started') or '-'} | {last or '-'} |"
        )
    out.append("")
    return out


# ---------------------------------------------------------------- topic readme


def stamp_date(note: Path, date: str) -> bool:
    """Give a note without a `date:` frontmatter key today's date."""
    text = note.read_text(encoding="utf-8")
    if frontmatter(text).get("date"):
        return False
    m = FRONTMATTER.match(text)
    if m:
        text = f"---\n{m.group(1)}\ndate: {date}\n---\n" + text[m.end() :]
    else:
        text = f"---\ndate: {date}\n---\n\n" + text
    note.write_text(text, encoding="utf-8")
    return True


def sync_topic_readme(topic: Path) -> bool:
    """Rewrite the note list between the markers; append it if missing."""
    readme = topic / "README.md"
    if not readme.is_file():
        return False
    old = readme.read_text(encoding="utf-8")

    # newest date first; same-day notes stay in filename order
    entries = sorted(
        ((note_meta(f), f.name) for f in topic_notes(topic)),
        key=lambda e: e[0]["date"],
        reverse=True,
    )
    block = [NOTES_START, ""]
    block += [
        f"- {m['date'] or '????-??-??'} - [{m['title']}]({n})" for m, n in entries
    ]
    if not entries:
        block.append("_No notes yet._")
    block += ["", NOTES_END]

    if NOTES_START in old and NOTES_END in old:
        head, rest = old.split(NOTES_START, 1)
        tail = rest.split(NOTES_END, 1)[1]
        new = head + "\n".join(block) + tail
    else:
        new = old.rstrip("\n") + "\n\n## Notes\n\n" + "\n".join(block) + "\n"
    if new == old:
        return False
    readme.write_text(new, encoding="utf-8")
    return True


# ---------------------------------------------------------------- commands


def sync() -> list[Path]:
    """Date undated notes, rebuild topic note lists and the root/LeetCode READMEs."""
    date = today()
    changed = [f for t in topics() for f in topic_notes(t) if stamp_date(f, date)]
    changed += [t / "README.md" for t in topics() if sync_topic_readme(t)]

    import organize  # lazy: organize imports this module for the notes table

    organize.build_readmes()
    return changed


def pre_commit() -> int:
    # Generated files are rebuilt from the working tree and staged whole, so
    # any unstaged edits to a topic README or dated note go into this commit too.
    paths = [str(p.relative_to(REPO)) for p in sorted(sync())]
    paths += [p for p in GENERATED if (REPO / p).exists()]
    subprocess.run(["git", "add", "--", *paths], cwd=REPO, check=True)
    return 0


def new_topic(name: str) -> int:
    if not SLUG.fullmatch(name):
        sys.exit(f"topic name must be a lowercase slug, got {name!r}")
    topic = NOTES / name
    if topic.exists():
        sys.exit(f"notes/{name} already exists")
    text = (TEMPLATE / "README.md").read_text(encoding="utf-8")
    topic.mkdir(parents=True)
    (topic / "README.md").write_text(
        text.replace("TITLE", name).replace("STARTED", today()), encoding="utf-8"
    )
    sync()
    print(f"created notes/{name}/README.md")
    return 0


def new_note(topic_name: str, note: str) -> int:
    topic = NOTES / topic_name
    if not (topic / "README.md").is_file():
        sys.exit(f"no topic notes/{topic_name} - run: make topic NAME={topic_name}")
    slug = note.removesuffix(".md")
    if not SLUG.fullmatch(slug):
        sys.exit(f"note name must be a lowercase slug, got {note!r}")
    path = topic / f"{slug}.md"
    if path.exists():
        sys.exit(f"{path.relative_to(REPO)} already exists")
    # "data-part" -> "Data part"
    title = slug.replace("-", " ").capitalize()
    text = (TEMPLATE / "note.md").read_text(encoding="utf-8")
    path.write_text(
        text.replace("DATE", today()).replace("# Note title", f"# {title}", 1),
        encoding="utf-8",
    )
    sync()
    print(f"created {path.relative_to(REPO)}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0].strip())
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("sync", help="date new notes and regenerate READMEs")
    sub.add_parser("pre-commit", help="git pre-commit hook entry point")
    p = sub.add_parser("new-topic", help="create notes/<name> from the template")
    p.add_argument("name")
    p = sub.add_parser("new-note", help="create notes/<topic>/<note>.md")
    p.add_argument("topic")
    p.add_argument("note", help="lowercase slug, e.g. data-part")
    args = ap.parse_args()

    if args.cmd == "sync":
        sync()
        return 0
    if args.cmd == "pre-commit":
        return pre_commit()
    if args.cmd == "new-topic":
        return new_topic(args.name)
    return new_note(args.topic, args.note)


if __name__ == "__main__":
    sys.exit(main())
