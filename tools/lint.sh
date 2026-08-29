#!/usr/bin/env bash
# Runs the same format-checks as .github/workflows/lint.yml, locally.
#
#   tools/lint.sh          # check only (what CI does)
#   tools/lint.sh --fix    # rewrite badly formatted files in place
#
# Tools that aren't installed are skipped with a note instead of failing, so a
# machine without (say) rustfmt can still check everything else.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO_ROOT/tools/lint-collect-files.sh"

GJF_VERSION="1.24.0"
GJF_JAR="${XDG_CACHE_HOME:-$HOME/.cache}/leetcode-lint/google-java-format-$GJF_VERSION-all-deps.jar"
PRETTIER="prettier@2.7.1"

FIX=0
case "${1:-}" in
  --fix) FIX=1 ;;
  '') ;;
  *) echo "usage: $0 [--fix]" >&2; exit 2 ;;
esac

failed=()
skipped=()

have() { command -v "$1" >/dev/null 2>&1; }

# report <name> <exit-code>
report() {
  if [ "$2" -ne 0 ]; then
    failed+=("$1")
  fi
}

echo "==> gofmt"
if have gofmt; then
  collect_files "$REPO_ROOT/leetcode" "$REPO_ROOT/structures" -name '*.go'
  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "no Go files to check"
  elif [ "$FIX" -eq 1 ]; then
    gofmt -l -w "${FILES[@]}"
    report gofmt $?
  else
    bad="$(gofmt -l "${FILES[@]}")"
    if [ -n "$bad" ]; then
      echo "not gofmt-formatted:"
      echo "$bad"
      report gofmt 1
    fi
  fi
else
  skipped+=("gofmt")
fi

echo "==> rustfmt"
if have rustfmt; then
  collect_files "$REPO_ROOT/leetcode" "$REPO_ROOT/structures" -name '*.rs'
  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "no Rust files to check"
  elif [ "$FIX" -eq 1 ]; then
    rustfmt --edition 2021 "${FILES[@]}"
    report rustfmt $?
  else
    rustfmt --check --edition 2021 "${FILES[@]}"
    report rustfmt $?
  fi
else
  skipped+=("rustfmt")
fi

echo "==> ruff format"
if have ruff; then
  collect_files "$REPO_ROOT/leetcode" -name '*.py'
  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "no Python files to check"
  elif [ "$FIX" -eq 1 ]; then
    ruff format "${FILES[@]}"
    report ruff $?
  else
    ruff format --check "${FILES[@]}"
    report ruff $?
  fi
else
  skipped+=("ruff")
fi

echo "==> google-java-format"
# google-java-format reaches into javac internals, so it only runs on the JDKs
# it was built against. 1.24.0 (what CI pins) breaks on JDK 24+. Pinning the
# version matters more than running it locally: a different gjf reformats the
# whole tree, so on a too-new JDK we skip instead of bumping.
GJF_MAX_JDK=23
GJF_EXPORTS=(
  --add-exports jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED
  --add-exports jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED
  --add-exports jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED
  --add-exports jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED
  --add-exports jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED
)

java_major() {
  java -version 2>&1 | sed -n '1s/.*version "\([0-9]*\).*/\1/p'
}

if have java && [ "$(java_major)" -gt "$GJF_MAX_JDK" ] 2>/dev/null; then
  skipped+=("google-java-format (JDK $(java_major) > $GJF_MAX_JDK, needs JDK <= $GJF_MAX_JDK)")
elif have java; then
  collect_files "$REPO_ROOT/leetcode" -name '*.java'
  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "no Java files to check"
  else
    if [ ! -f "$GJF_JAR" ]; then
      mkdir -p "$(dirname "$GJF_JAR")"
      echo "downloading google-java-format $GJF_VERSION"
      curl -sL -o "$GJF_JAR" \
        "https://github.com/google/google-java-format/releases/download/v$GJF_VERSION/google-java-format-$GJF_VERSION-all-deps.jar" \
        || rm -f "$GJF_JAR"
    fi
    if [ -f "$GJF_JAR" ]; then
      if [ "$FIX" -eq 1 ]; then
        java "${GJF_EXPORTS[@]}" -jar "$GJF_JAR" --replace "${FILES[@]}"
      else
        java "${GJF_EXPORTS[@]}" -jar "$GJF_JAR" --dry-run --set-exit-if-changed "${FILES[@]}"
      fi
      report google-java-format $?
    else
      skipped+=("google-java-format (download failed)")
    fi
  fi
else
  skipped+=("google-java-format (no java)")
fi

echo "==> prettier"
if have npx; then
  collect_files "$REPO_ROOT/leetcode" \( -name '*.ts' -o -name '*.js' \)
  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "no TS/JS files to check"
  elif [ "$FIX" -eq 1 ]; then
    npx --yes "$PRETTIER" --write "${FILES[@]}"
    report prettier $?
  else
    npx --yes "$PRETTIER" --check "${FILES[@]}"
    report prettier $?
  fi
else
  skipped+=("prettier (no npx)")
fi

echo
if [ "${#skipped[@]}" -ne 0 ]; then
  echo "skipped: ${skipped[*]}"
fi

if [ "${#failed[@]}" -ne 0 ]; then
  if [ "$FIX" -eq 1 ]; then
    echo "failed to fix: ${failed[*]}"
  else
    echo "format-check failed: ${failed[*]}"
    echo "fix with: make lint-fix"
  fi
  exit 1
fi

if [ "$FIX" -eq 1 ]; then
  echo "all formatters applied"
else
  echo "all format-checks passed"
fi
