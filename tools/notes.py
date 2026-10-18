#!/usr/bin/env python3
"""
Housekeeping for notes/<topic>/ so READMEs and logs never need hand edits.

    python3 tools/notes.py new-topic clickhouse
    python3 tools/notes.py new-note clickhouse 02-storage/01-parts-and-granules
    python3 tools/notes.py sync          # tick roadmaps, regenerate READMEs
    python3 tools/notes.py pre-commit    # log staged notes + sync, then re-stage

Topic README conventions (see notes/_template/README.md):

- frontmatter `title` / `status` / `started` feeds the root README table
- roadmap lines "- [ ] `path/to/note.md` - what" tick and link themselves
  once that file exists
- "## Log" gets one line per note added/updated/moved/removed, per day
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
# "- [ ] `a/b.md` - what" or, once ticked, "- [x] [`a/b.md`](a/b.md) - what"
ROADMAP = re.compile(
    r"^(\s*)- \[[ x]\] (?:\[`(?P<linked>[^`]+\.md)`\]\([^)]*\)|`(?P<bare>[^`]+\.md)`)(.*)$"
)


def today() -> str:
    return dt.date.today().isoformat()


def topics() -> list[Path]:
    # `_template` and other `_`-prefixed folders are scaffolding, not topics.
    if not NOTES.is_dir():
        return []
    return sorted(
        x for x in NOTES.iterdir() if x.is_dir() and not x.name.startswith("_")
    )


def note_title(path: Path) -> str:
    if path.is_file():
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("# "):
                return line[2:].strip()
    return path.stem


# ---------------------------------------------------------------- root readme


def topic_meta(topic: Path) -> dict[str, str]:
    """Read the `key: value` frontmatter block at the top of a topic README.

    Missing README or frontmatter is fine - title falls back to the folder name
    and status/started stay blank.
    """
    meta: dict[str, str] = {}
    readme = topic / "README.md"
    if readme.is_file():
        m = re.match(
            r"---\n(.*?)\n---\n", readme.read_text(encoding="utf-8"), re.DOTALL
        )
        if m:
            for line in m.group(1).splitlines():
                key, sep, value = line.partition(":")
                if sep:
                    meta[key.strip()] = value.strip()
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
        pages = sum(1 for f in t.rglob("*.md") if f.name != "README.md")
        rows.append((rank, t.name, meta, status, pages))
    if not rows:
        return []

    out = [
        "## Notes",
        "",
        "One folder per subject under [notes/](notes/). Start a new one with "
        "`make topic NAME=<slug>`.",
        "",
        "| Topic | Status | Pages | Started |",
        "| --- | --- | ---: | --- |",
    ]
    for _, name, meta, status, pages in sorted(rows):
        out.append(
            f"| [{meta['title']}](notes/{name}/) | {status or '-'} | {pages} "
            f"| {meta.get('started') or '-'} |"
        )
    out.append("")
    return out


# ---------------------------------------------------------------- topic readme


def sync_roadmap(topic: Path) -> bool:
    """Tick and link every roadmap line whose note exists; untick the rest."""
    readme = topic / "README.md"
    if not readme.is_file():
        return False
    old = readme.read_text(encoding="utf-8")
    lines = old.splitlines()
    for i, line in enumerate(lines):
        m = ROADMAP.match(line)
        if not m:
            continue
        path = m.group("linked") or m.group("bare")
        indent, rest = m.group(1), m.group(4)
        if (topic / path).is_file():
            lines[i] = f"{indent}- [x] [`{path}`]({path}){rest}"
        else:
            lines[i] = f"{indent}- [ ] `{path}`{rest}"
    new = "\n".join(lines) + "\n"
    if new == old:
        return False
    readme.write_text(new, encoding="utf-8")
    return True


def log_entry(verb: str, rel: str, topic: Path) -> str:
    if verb == "Removed":
        return f"{verb} `{rel}`"
    return f"{verb} [{note_title(topic / rel)}]({rel})"


def add_log_entries(topic: Path, changes: list[tuple[str, str]], date: str) -> bool:
    """Append "- <date> - <verb> <note>" lines to the topic's ## Log section.

    One line per note per day: a note already logged today is skipped, so
    several commits touching the same note don't pile up "Updated" lines.
    """
    readme = topic / "README.md"
    if not readme.is_file() or not changes:
        return False
    lines = readme.read_text(encoding="utf-8").rstrip("\n").split("\n")

    try:
        start = lines.index("## Log")
    except ValueError:
        lines += ["", "## Log", ""]
        start = len(lines) - 2
    end = next(
        (i for i in range(start + 1, len(lines)) if lines[i].startswith("## ")),
        len(lines),
    )
    while end > start + 1 and not lines[end - 1].strip():
        end -= 1

    prefix = f"- {date} - "
    seen = lines[start:end]
    added = []
    for verb, rel in changes:
        if any(
            s.startswith(prefix) and (f"]({rel})" in s or f"`{rel}`" in s)
            for s in seen + added
        ):
            continue
        added.append(prefix + log_entry(verb, rel, topic))
    if not added:
        return False

    if end == start + 1:
        added.insert(0, "")
    lines[end:end] = added
    readme.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return True


# ---------------------------------------------------------------- commands


def sync() -> list[Path]:
    """Tick roadmaps and regenerate the root + LeetCode READMEs."""
    changed = [t / "README.md" for t in topics() if sync_roadmap(t)]

    import organize  # lazy: organize imports this module for the notes table

    organize.build_readmes()
    return changed


def staged_note_changes() -> dict[Path, list[tuple[str, str]]]:
    """Map each topic to (verb, path-in-topic) for staged note .md files."""
    out = subprocess.run(
        ["git", "diff", "--cached", "--name-status", "-M", "-z"],
        cwd=REPO,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.split("\0")

    verbs = {"A": "Added", "M": "Updated", "D": "Removed", "R": "Moved"}
    changes: dict[Path, list[tuple[str, str]]] = {}
    i = 0
    while i < len(out) and out[i]:
        status = out[i][0]
        # renames/copies carry two paths (old, new); log the new one
        n = 2 if status in "RC" else 1
        path = Path(out[i + n])
        i += n + 1

        parts = path.parts
        if (
            status not in verbs
            or len(parts) < 3
            or parts[0] != "notes"
            or parts[1].startswith("_")
            or path.suffix != ".md"
            or path.name == "README.md"
        ):
            continue
        topic = REPO / parts[0] / parts[1]
        changes.setdefault(topic, []).append(
            (verbs[status], Path(*parts[2:]).as_posix())
        )
    return changes


def pre_commit() -> int:
    # Generated files are rebuilt from the working tree and staged whole, so
    # any unstaged edits to a topic README go into this commit too.
    date = today()
    touched = {
        t / "README.md"
        for t, c in staged_note_changes().items()
        if add_log_entries(t, c, date)
    }
    touched.update(sync())

    paths = [str(p.relative_to(REPO)) for p in sorted(touched)]
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
    path = topic / (note if note.endswith(".md") else f"{note}.md")
    if path.exists():
        sys.exit(f"{path.relative_to(REPO)} already exists")
    # "01-parts-and-granules" -> "Parts and granules"
    title = re.sub(r"^\d+-", "", path.stem).replace("-", " ").capitalize()
    text = (TEMPLATE / "note.md").read_text(encoding="utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.replace("# Note title", f"# {title}", 1), encoding="utf-8")
    sync()
    print(f"created {path.relative_to(REPO)}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0].strip())
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("sync", help="tick roadmaps and regenerate READMEs")
    sub.add_parser("pre-commit", help="git pre-commit hook entry point")
    p = sub.add_parser("new-topic", help="create notes/<name> from the template")
    p.add_argument("name")
    p = sub.add_parser("new-note", help="create a note inside a topic")
    p.add_argument("topic")
    p.add_argument("note", help="path inside the topic, e.g. 02-storage/01-parts")
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
