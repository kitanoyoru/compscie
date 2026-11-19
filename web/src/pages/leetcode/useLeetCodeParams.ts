import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import type { Difficulty } from '../../data/types'
import { FILTER_ALL } from '../../domain/recommendations'

export type DifficultyFilter = Difficulty | typeof FILTER_ALL

export type LeetCodeParamKey = 'difficulty' | 'language' | 'tag' | 'problem' | 'q'

export interface LeetCodeParams {
  readonly difficulty: DifficultyFilter
  readonly language: string
  readonly tag: string
  readonly query: string
  readonly problemId: number | undefined
  readonly update: (patch: Partial<Record<LeetCodeParamKey, string | null>>) => void
}

function parseDifficulty(value: string | null): DifficultyFilter {
  return value === 'easy' || value === 'medium' || value === 'hard' ? value : FILTER_ALL
}

/**
 * Filters and the selected problem live in the hash URL (`#/leetcode?tag=Array&problem=42`)
 * so other pages can link straight into a filtered view or a specific problem.
 */
export function useLeetCodeParams(): LeetCodeParams {
  const [params, setParams] = useSearchParams()
  const rawProblem = Number(params.get('problem'))

  const update = useCallback(
    (patch: Partial<Record<LeetCodeParamKey, string | null>>) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)

          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === undefined || value === '' || value === FILTER_ALL) {
              next.delete(key)
            } else {
              next.set(key, value)
            }
          }

          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  return {
    difficulty: parseDifficulty(params.get('difficulty')),
    language: params.get('language') ?? FILTER_ALL,
    tag: params.get('tag') ?? FILTER_ALL,
    query: params.get('q') ?? '',
    problemId: Number.isInteger(rawProblem) && rawProblem > 0 ? rawProblem : undefined,
    update,
  }
}
