import type { SolvedProblem } from './types'

export const REPOSITORY_URL = 'https://github.com/kitanoyoru/compscie'
const REPOSITORY_BRANCH = 'main'

function encodeRepositoryPath(repositoryPath: string): string {
  return repositoryPath.split('/').map(encodeURIComponent).join('/')
}

/** GitHub page for a directory in this repository, such as a LeetCode problem folder. */
export function repositoryTreeUrl(repositoryPath: string): string {
  return `${REPOSITORY_URL}/tree/${REPOSITORY_BRANCH}/${encodeRepositoryPath(repositoryPath)}`
}

/** GitHub page for a file in this repository, such as a Markdown note. */
export function repositoryFileUrl(repositoryPath: string): string {
  return `${REPOSITORY_URL}/blob/${REPOSITORY_BRANCH}/${encodeRepositoryPath(repositoryPath)}`
}

/**
 * Derives the LeetCode URL slug from a canonical problem title, following
 * LeetCode's convention: punctuation is dropped and words are joined by hyphens
 * (`Pow(x, n)` becomes `powx-n`, `Pascal's Triangle` becomes `pascals-triangle`).
 */
export function leetcodeSlug(title: string): string {
  return title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[‐-―]/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function leetcodeProblemUrl(problem: Pick<SolvedProblem, 'title'>): string {
  return `https://leetcode.com/problems/${leetcodeSlug(problem.title)}/`
}
