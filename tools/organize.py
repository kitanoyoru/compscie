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
    README.md              (regenerated summary)
    leetcode/README.md     (regenerated problem index)

Run it any time. It is idempotent: solve a new problem, drop the folder
anywhere in the repo, run this, and it lands in the right place with a
canonical name and both READMEs pick it up.

    make organize   # dry run, shows the plan
    make apply      # actually move things, refresh both READMEs
    make migrate    # one-time: apply + delete codeforces/ and codewars/
    make readme     # regenerate both READMEs only

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
from collections import Counter, defaultdict
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

# Roughly GitHub's linguist colors, so the chart reads like a language you know.
LANG_COLORS = {
    "Go": "#00ADD8", "Rust": "#DEA584", "Python": "#3572A5", "Java": "#B07219",
    "TypeScript": "#3178C6", "JavaScript": "#F1E05A", "C++": "#F34B7D",
    "C": "#555555", "C#": "#178600", "Swift": "#F05138", "Kotlin": "#A97BFF",
    "Ruby": "#701516", "Elixir": "#6E4A7E", "Dart": "#00B4AB", "Zig": "#EC915C",
    "SQL": "#E38C00", "Scala": "#C22D40", "Haskell": "#5E5086", "PHP": "#4F5D95",
    "Lua": "#000080", "Shell": "#89E051", "Perl": "#0298C3", "Erlang": "#B83998",
    "Clojure": "#DB5855",
}
LANG_COLOR_FALLBACK = "#8b949e"


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
    # README.md is generated index metadata, not a solution file - ignore it so a
    # container dir (e.g. leetcode/ itself, once it holds a generated README.md)
    # isn't mistaken for a leaf problem folder.
    return any(f.is_file() and f.name.lower() != "readme.md" for f in p.iterdir())


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


# ---------------------------------------------------------------- language chart


def language_chart_svg(top: list[tuple[str, int]]) -> str:
    """Horizontal bar chart of the top languages, theme-aware (light/dark)."""
    width = 640
    row_h = 34
    pad_top = 44
    pad_bottom = 16
    label_w = 118
    bar_max_w = width - label_w - 70
    height = pad_top + row_h * len(top) + pad_bottom
    max_count = top[0][1] if top else 1

    rows = []
    for i, (lang, count) in enumerate(top):
        y = pad_top + i * row_h
        bar_w = max(6, round(bar_max_w * count / max_count))
        color = LANG_COLORS.get(lang, LANG_COLOR_FALLBACK)
        rows.append(f"""
    <g transform="translate(0,{y})">
      <text x="{label_w - 12}" y="{row_h / 2 + 5}" text-anchor="end" class="label">{lang}</text>
      <rect x="{label_w}" y="{(row_h - 16) / 2}" width="{bar_max_w}" height="16" rx="8" class="track"/>
      <rect x="{label_w}" y="{(row_h - 16) / 2}" width="{bar_w}" height="16" rx="8" fill="{color}"/>
      <text x="{label_w + bar_w + 10}" y="{row_h / 2 + 5}" class="count">{count}</text>
    </g>""")

    alt = ", ".join(f"{lang} {count}" for lang, count in top)
    return f"""<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" \
xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top languages by solved problems: {alt}">
  <style>
    text {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }}
    .title {{ font-size: 15px; font-weight: 600; fill: #1f2328; }}
    .label {{ font-size: 13px; fill: #1f2328; }}
    .count {{ font-size: 13px; fill: #57606a; }}
    .track {{ fill: #eaeef2; }}
    @media (prefers-color-scheme: dark) {{
      .title {{ fill: #e6edf3; }}
      .label {{ fill: #e6edf3; }}
      .count {{ fill: #8b949e; }}
      .track {{ fill: #30363d; }}
    }}
  </style>
  <text x="0" y="24" class="title">Top {len(top)} Languages</text>{"".join(rows)}
</svg>
"""


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


def build_root_readme(counts: dict[str, int], total: int, top_langs: list[tuple[str, int]]) -> str:
    out = [
        "# compscie",
        "",
        "LeetCode solutions and computer-science research notes.",
        "",
        "## LeetCode",
        "",
        f"**{total} problems solved**, filed by difficulty - one folder each, "
        "with one file per language I solved it in. Full index: "
        f"[{PROBLEMS}/README.md]({PROBLEMS}/README.md).",
        "",
        "| | Count |",
        "| --- | ---: |",
    ]
    for d in DIFF_DIRS:
        out.append(f"| [{d.capitalize()}]({PROBLEMS}/README.md#{d}) | {counts.get(d, 0)} |")
    if counts.get(MISC):
        out.append(f"| [Misc]({PROBLEMS}/README.md#misc) | {counts[MISC]} |")
    out += [f"| **Total** | **{total}** |", ""]

    if top_langs:
        out += [
            "### Languages",
            "",
            "![Top languages by solved problems]"
            "(docs/leetcode-languages.svg)",
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

    return "\n".join(out).rstrip() + "\n"


def build_leetcode_readme(buckets: dict[str, list[tuple[int, str, Path]]], total: int) -> str:
    out = [
        "# LeetCode",
        "",
        f"**{total} problems solved**, filed by difficulty - one folder each, "
        "with one file per language I solved it in.",
        "",
        "## Layout",
        "",
        "```",
        "easy|medium|hard/   one folder per problem: `0001. Two Sum`",
        "misc/               unidentified or non-LeetCode scratch work",
        "```",
        "",
        "Solve something new, drop the folder anywhere, then run:",
        "",
        "```sh",
        "make organize   # preview where things would land",
        "make apply      # file them and refresh both READMEs",
        "```",
        "",
    ]

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
            link = urllib.parse.quote(f"{d}/{name}")
            langs = ", ".join(languages(path)) or "-"
            out.append(f"| {num} | [{label}]({link}) | {langs} |")
        out.append("")

    return "\n".join(out).rstrip() + "\n"


def build_readmes() -> None:
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

    lang_counts: Counter[str] = Counter()
    for items in buckets.values():
        for _, _, path in items:
            lang_counts.update(languages(path))
    top_langs = lang_counts.most_common(5)

    chart_path = REPO / "docs" / "leetcode-languages.svg"
    if top_langs:
        chart_path.parent.mkdir(parents=True, exist_ok=True)
        chart_path.write_text(language_chart_svg(top_langs), encoding="utf-8")
    elif chart_path.exists():
        chart_path.unlink()

    (REPO / "README.md").write_text(
        build_root_readme(counts, total, top_langs), encoding="utf-8"
    )
    (REPO / PROBLEMS / "README.md").write_text(
        build_leetcode_readme(buckets, total), encoding="utf-8"
    )


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
        build_readmes()
        print("README.md and leetcode/README.md regenerated.")

    if not args.no_move:
        print("\nreview with `git status` / `git add -A && git status` "
              "(git detects the renames), then commit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
