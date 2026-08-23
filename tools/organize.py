#!/usr/bin/env python3
"""
Organize LeetCode solution folders by difficulty.

Layout produced:

    leetcode/easy/0001. Two Sum/main.go
    leetcode/medium/0002. Add Two Numbers/main.ts
    leetcode/hard/0004. Median of Two Sorted Arrays/main.rs
    leetcode/misc/<anything that could not be identified>
    notes/                 research notes (untouched)
    structures/            shared helpers (untouched)
    README.md              (regenerated index)

Run it any time. It is idempotent: solve a new problem, drop the folder
anywhere in the repo, run this, and it lands in the right place with a
canonical name and the README index picks it up.

    make organize   # dry run, shows the plan
    make apply      # actually move things, refresh README.md
    make migrate    # one-time: apply + delete codeforces/ and codewars/
    make readme     # regenerate README.md only

(or call this script directly: python3 tools/organize.py --apply)

Problem metadata comes from tools/leetcode-index.tsv (id, difficulty, title, tags).
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
import urllib.parse
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
INDEX = Path(__file__).resolve().parent / "leetcode-index.tsv"

PROBLEMS = "leetcode"          # all problem folders live under this root
DIFF_DIRS = ["easy", "medium", "hard"]
MISC = "misc"
# Directories at the repo root that are never treated as problem folders.
PROTECTED = {
    ".git", ".github", "node_modules", "tools", "structures",
    "notes", "docs", "research",
    ".vscode", ".idea", ".ccls-cache",
}
LEGACY = ["codeforces", "codewars"]

LANG_NAMES = {
    ".go": "Go", ".ts": "TypeScript", ".js": "JavaScript", ".py": "Python",
    ".rs": "Rust", ".java": "Java", ".cpp": "C++", ".c": "C", ".cs": "C#",
    ".swift": "Swift", ".kt": "Kotlin", ".rb": "Ruby", ".ex": "Elixir",
    ".exs": "Elixir", ".dart": "Dart", ".zig": "Zig", ".sql": "SQL",
    ".scala": "Scala", ".hs": "Haskell", ".php": "PHP", ".lua": "Lua",
    ".sh": "Shell", ".pl": "Perl", ".erl": "Erlang", ".clj": "Clojure",
}


# ---------------------------------------------------------------- metadata


def load_index() -> dict[int, dict]:
    if not INDEX.exists():
        sys.exit(f"missing index file: {INDEX}")
    meta: dict[int, dict] = {}
    with INDEX.open(encoding="utf-8") as fh:
        next(fh)  # header
        for line in fh:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            pid, difficulty, title = parts[0], parts[1], parts[2]
            tags = parts[3] if len(parts) > 3 else ""
            meta[int(pid)] = {
                "difficulty": difficulty.lower(),
                "title": title,
                "tags": [t for t in tags.split(",") if t],
            }
    return meta


# ---------------------------------------------------------------- naming

# "1. Two Sum", "1020 Number of Enclaves", "0704. Binary Search", "2?.Add Two Numbers"
ID_RE = re.compile(r"^\s*(\d{1,4})\b")


def parse_id(name: str) -> int | None:
    m = ID_RE.match(name)
    return int(m.group(1)) if m else None


def safe(title: str) -> str:
    """Make a LeetCode title safe to use as a directory name."""
    out = title.replace("/", "-").replace(":", " -").replace('"', "'")
    out = out.replace("\\", "-").replace("|", "-").replace("*", "")
    out = re.sub(r"\s+", " ", out).strip().rstrip(".")
    return out


def canonical(pid: int, title: str) -> str:
    return f"{pid:04d}. {safe(title)}"


# ---------------------------------------------------------------- scanning


def is_problem_dir(p: Path) -> bool:
    """A leaf-ish folder holding solution files (no nested problem folders)."""
    if not p.is_dir():
        return False
    return any(f.is_file() for f in p.iterdir())


def collect_sources(meta: dict[int, dict]) -> list[Path]:
    """Every directory in the repo that looks like one problem's folder."""
    found: list[Path] = []

    def walk(base: Path, depth: int = 0):
        if depth > 3:
            return
        for child in sorted(base.iterdir()):
            if not child.is_dir() or child.name.startswith("."):
                continue
            if child.parent == REPO and child.name in PROTECTED:
                continue
            if child.name in LEGACY and child.parent == REPO:
                continue
            has_subdirs = any(g.is_dir() for g in child.iterdir())
            if has_subdirs and not is_problem_dir(child):
                walk(child, depth + 1)
            elif is_problem_dir(child):
                found.append(child)
            elif has_subdirs:
                # container that also holds stray files - descend anyway
                walk(child, depth + 1)

    walk(REPO)
    return found


def languages(p: Path) -> list[str]:
    langs = set()
    for f in p.rglob("*"):
        if f.is_file():
            langs.add(LANG_NAMES.get(f.suffix.lower(), f.suffix.lstrip(".").upper()))
    return sorted(x for x in langs if x)


# ---------------------------------------------------------------- planning


def plan(meta: dict[int, dict]) -> tuple[list[tuple[Path, Path, str]], list[str]]:
    moves: list[tuple[Path, Path, str]] = []
    notes: list[str] = []
    claimed: dict[Path, Path] = {}

    root = REPO / PROBLEMS
    misc_dir = root / MISC

    for src in collect_sources(meta):
        pid = parse_id(src.name)
        info = meta.get(pid) if pid is not None else None
        parked = src.parent == misc_dir

        if parked and not info:
            # already in the review pile and still unidentifiable - leave it alone
            continue

        if info:
            dest = root / info["difficulty"] / canonical(pid, info["title"])
            reason = f"#{pid} {info['difficulty']}"
        else:
            dest = misc_dir / safe(src.name)
            reason = "unrecognised - no matching problem id"
            notes.append(f"  ? {src.relative_to(REPO)}  ->  {MISC}/")

        if dest == src:
            continue

        if dest in claimed or dest.exists():
            other = claimed.get(dest, dest)
            if parked:
                # already parked and still conflicting - nothing more to do
                continue
            notes.append(
                f"  ! {src.relative_to(REPO)} conflicts with "
                f"{other.relative_to(REPO)} -> parked in {MISC}/"
            )
            dest, reason = misc_dir / f"{safe(src.name)} (duplicate)", "duplicate"
            if dest in claimed or dest.exists():
                n = 2
                while (alt := misc_dir / f"{safe(src.name)} (duplicate {n})") in claimed or alt.exists():
                    n += 1
                dest = alt

        claimed[dest] = src
        moves.append((src, dest, reason))

    return moves, notes


def prune_empty(root: Path) -> list[Path]:
    removed = []
    for base, dirs, files in os.walk(root, topdown=False):
        p = Path(base)
        if p == root or ".git" in p.parts or "node_modules" in p.parts:
            continue
        if p.parent == REPO and (p.name in PROTECTED or p.name == PROBLEMS):
            continue
        try:
            if not any(p.iterdir()):
                p.rmdir()
                removed.append(p)
        except OSError:
            pass
    return removed


# ---------------------------------------------------------------- readme


def build_readme() -> str:
    buckets: dict[str, list[tuple[int, str, Path]]] = defaultdict(list)
    for d in DIFF_DIRS + [MISC]:
        base = REPO / PROBLEMS / d
        if not base.is_dir():
            continue
        for p in sorted(base.iterdir()):
            if p.is_dir():
                buckets[d].append((parse_id(p.name) or 10**6, p.name, p))

    total = sum(len(v) for v in buckets.values())
    counts = {d: len(buckets.get(d, [])) for d in DIFF_DIRS + [MISC]}

    out = [
        "# compscie",
        "",
        "LeetCode solutions and computer-science research notes.",
        "",
        f"**{total} problems solved**, filed by difficulty - one folder each, "
        "with one file per language I solved it in.",
        "",
        "| | Count |",
        "| --- | ---: |",
    ]
    for d in DIFF_DIRS:
        out.append(f"| [{d.capitalize()}](#{d}) | {counts.get(d, 0)} |")
    if counts.get(MISC):
        out.append(f"| [Misc](#misc) | {counts[MISC]} |")
    out += [
        f"| **Total** | **{total}** |",
        "",
        "## Layout",
        "",
        "```",
        "leetcode/easy|medium|hard/   one folder per problem: `0001. Two Sum`",
        "leetcode/misc/               unidentified or non-LeetCode scratch work",
        "notes/                       research notes and deep dives",
        "structures/                  shared data structures and helpers",
        "tools/                       organize.py + the problem index",
        "```",
        "",
        "Solve something new, drop the folder anywhere, then run:",
        "",
        "```sh",
        "make organize   # preview where things would land",
        "make apply      # file them and refresh this README",
        "```",
        "",
    ]

    notes_root = REPO / "notes"
    if notes_root.is_dir():
        topics = sorted(x for x in notes_root.iterdir() if x.is_dir())
        if topics:
            out += ["## Notes", "",
                    "Research notes and deep dives, exported from my Notion knowledge base.", ""]
            for t in topics:
                pages = len(list(t.rglob("*.md")))
                out.append(f"- [{t.name}](notes/{t.name}/) - {pages} page(s)")
            out.append("")

    for d in DIFF_DIRS + [MISC]:
        items = buckets.get(d)
        if not items:
            continue
        out += [
            f"## {d.capitalize() if d != MISC else 'Misc'}",
            "",
            "| # | Problem | Languages |",
            "| ---: | --- | --- |",
        ]
        for pid, name, path in sorted(items):
            label = name.split(". ", 1)[-1] if ". " in name else name
            num = f"{pid}" if pid < 10**6 else ""
            link = urllib.parse.quote(f"{PROBLEMS}/{d}/{name}")
            langs = ", ".join(languages(path)) or "-"
            out.append(f"| {num} | [{label}]({link}) | {langs} |")
        out.append("")

    return "\n".join(out).rstrip() + "\n"


# ---------------------------------------------------------------- main


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="perform the moves")
    ap.add_argument("--drop-legacy", action="store_true",
                    help="delete codeforces/ and codewars/")
    ap.add_argument("--no-readme", action="store_true", help="skip README regeneration")
    ap.add_argument("--no-move", action="store_true",
                    help="don't move anything; with --apply, just regenerate the README")
    args = ap.parse_args()

    meta = load_index()
    moves, notes = ([], []) if args.no_move else plan(meta)

    print(f"repo: {REPO}")
    print(f"index: {len(meta)} problems\n")

    if args.no_move:
        print("--no-move: leaving the tree alone.")
    elif moves:
        print(f"{len(moves)} folder(s) to move:\n")
        for src, dest, reason in moves[:40]:
            print(f"  {src.relative_to(REPO)}")
            print(f"    -> {dest.relative_to(REPO)}   ({reason})")
        if len(moves) > 40:
            print(f"  ... and {len(moves) - 40} more")
    else:
        print("everything is already in place.")

    if notes:
        print(f"\nneeds a look ({len(notes)}):")
        for n in notes:
            print(n)

    legacy_present = [] if args.no_move else [d for d in LEGACY if (REPO / d).is_dir()]
    if legacy_present:
        verb = "will delete" if (args.apply and args.drop_legacy) else "would delete (pass --drop-legacy)"
        print(f"\nlegacy: {verb} {', '.join(legacy_present)}")

    if not args.apply:
        print("\ndry run - nothing changed. re-run with --apply.")
        return 0

    for src, dest, _ in moves:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))

    if args.drop_legacy:
        for d in legacy_present:
            shutil.rmtree(REPO / d)

    removed = [] if args.no_move else prune_empty(REPO)

    if not args.no_move:
        print(f"\nmoved {len(moves)} folder(s); removed {len(removed)} empty director(ies).")

    if not args.no_readme:
        (REPO / "README.md").write_text(build_readme(), encoding="utf-8")
        print("README.md regenerated.")

    if not args.no_move:
        print("\nreview with `git status` / `git add -A && git status` "
              "(git detects the renames), then commit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
