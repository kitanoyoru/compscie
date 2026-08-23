#!/bin/bash
# Shared by .github/workflows/lint.yml. Populates the FILES array with every
# file matching the given `find` path(s)/expression, minus tools/lint-exclude.txt.
#
#   source tools/lint-collect-files.sh
#   collect_files leetcode structures -name '*.go'

collect_files() {
  local repo_root
  repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

  local exclude_args=()
  while IFS= read -r line; do
    case "$line" in
      ''|'#'*) continue ;;
    esac
    exclude_args+=(-not -path "*$line*")
  done < "$repo_root/tools/lint-exclude.txt"

  FILES=()
  while IFS= read -r -d '' f; do
    FILES+=("$f")
  done < <(find "$@" "${exclude_args[@]}" -print0)
}
