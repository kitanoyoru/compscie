import type { RepositorySnapshot } from '../types'

export const repositorySnapshot = {
  "generatedAt": "2026-11-19T00:00:00.000Z",
  "topics": [
    {
      "slug": "clickhouse",
      "title": "ClickHouse",
      "status": "active",
      "focus": "MergeTree internals and date-time functions.",
      "next": "Run and write up the date-parts lab.",
      "started": "2026-10-18",
      "lastNote": "2026-11-19",
      "noteCount": 6
    },
    {
      "slug": "go",
      "title": "Go",
      "status": "active",
      "focus": "Runtime internals and production debugging.",
      "next": "Add pprof and runtime/trace workflows.",
      "started": "2026-08-23",
      "lastNote": "2026-08-23",
      "noteCount": 19
    }
  ],
  "notes": [
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse Partitioning",
      "filename": "partitioning.md",
      "path": "notes/clickhouse/partitioning.md",
      "date": "2026-11-19"
    },
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse date and time functions",
      "filename": "date-time-functions.md",
      "path": "notes/clickhouse/date-time-functions.md",
      "date": "2026-11-17"
    },
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse Sparse Index",
      "filename": "sparse-index.md",
      "path": "notes/clickhouse/sparse-index.md",
      "date": "2026-10-31"
    },
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse Data Part",
      "filename": "data-part.md",
      "path": "notes/clickhouse/data-part.md",
      "date": "2026-10-24"
    },
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse Granule",
      "filename": "granule.md",
      "path": "notes/clickhouse/granule.md",
      "date": "2026-10-24"
    },
    {
      "topicSlug": "clickhouse",
      "title": "ClickHouse PRIMARY KEY vs ORDER BY",
      "filename": "primary-key-vs-order-by.md",
      "path": "notes/clickhouse/primary-key-vs-order-by.md",
      "date": "2026-10-24"
    },
    {
      "topicSlug": "go",
      "title": "📡 Go Channels — Internals, sudog, and Select",
      "filename": "channels.md",
      "path": "notes/go/channels.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go context Package — Cancellation Trees, Value Lookup, and Anti-Patterns",
      "filename": "context-package-internals.md",
      "path": "notes/go/context-package-internals.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "🧭 Go Context — Cancellation, Deadlines, and Ownership",
      "filename": "context.md",
      "path": "notes/go/context.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Deadlock Detector — checkdead()",
      "filename": "deadlock-detector.md",
      "path": "notes/go/deadlock-detector.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go defer — Semantics, Open-Coded Implementation, and Gotchas",
      "filename": "defer.md",
      "path": "notes/go/defer.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Escape Analysis & GC Tuning",
      "filename": "escape-analysis-gc-tuning.md",
      "path": "notes/go/escape-analysis-gc-tuning.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Garbage Collector — Tri-Color Marking, Write Barriers, and Phases",
      "filename": "garbage-collector.md",
      "path": "notes/go/garbage-collector.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Generics — Constraints, Inference, and GCShape",
      "filename": "generics.md",
      "path": "notes/go/generics.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Interfaces — Internal Representation & Nil-Pointer Trap",
      "filename": "interfaces.md",
      "path": "notes/go/interfaces.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Maps — Legacy Bucket Design (Before Go 1.24)",
      "filename": "maps-legacy-buckets.md",
      "path": "notes/go/maps-legacy-buckets.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Maps — Swiss Tables (Go 1.24+)",
      "filename": "maps-swiss-tables.md",
      "path": "notes/go/maps-swiss-tables.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Memory Allocator — mcache/mcentral/mheap, Size Classes, Arenas",
      "filename": "memory-allocator.md",
      "path": "notes/go/memory-allocator.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "🧠 Go Memory Model — Practical Happens-Before Guide",
      "filename": "memory-model.md",
      "path": "notes/go/memory-model.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go sync.Mutex — Internals",
      "filename": "mutex.md",
      "path": "notes/go/mutex.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go sync.RWMutex — Internals and Recursive RLock",
      "filename": "rwmutex.md",
      "path": "notes/go/rwmutex.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "⚙️ Go Scheduler (GMP) — Interview Prep Notes",
      "filename": "scheduler-gmp.md",
      "path": "notes/go/scheduler-gmp.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Slices — Internals, Aliasing, and Growth",
      "filename": "slices.md",
      "path": "notes/go/slices.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go Timers and Tickers — Current Semantics and Safe Patterns",
      "filename": "timers-tickers.md",
      "path": "notes/go/timers-tickers.md",
      "date": "2026-08-23"
    },
    {
      "topicSlug": "go",
      "title": "Go sync.WaitGroup — State, Ordering, and WaitGroup.Go",
      "filename": "waitgroup.md",
      "path": "notes/go/waitgroup.md",
      "date": "2026-08-23"
    }
  ],
  "problems": [
    {
      "id": 1,
      "title": "Two Sum",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Dart",
        "Elixir",
        "Go",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/0001. Two Sum"
    },
    {
      "id": 2,
      "title": "Add Two Numbers",
      "difficulty": "medium",
      "tags": [
        "Recursion",
        "Linked List",
        "Math"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0002. Add Two Numbers"
    },
    {
      "id": 3,
      "title": "Longest Substring Without Repeating Characters",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0003. Longest Substring Without Repeating Characters"
    },
    {
      "id": 5,
      "title": "Longest Palindromic Substring",
      "difficulty": "medium",
      "tags": [
        "Two Pointers",
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0005. Longest Palindromic Substring"
    },
    {
      "id": 7,
      "title": "Reverse Integer",
      "difficulty": "medium",
      "tags": [
        "Math"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0007. Reverse Integer"
    },
    {
      "id": 9,
      "title": "Palindrome Number",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0009. Palindrome Number"
    },
    {
      "id": 11,
      "title": "Container With Most Water",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Two Pointers"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0011. Container With Most Water"
    },
    {
      "id": 12,
      "title": "Integer to Roman",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "Math",
        "String"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0012. Integer to Roman"
    },
    {
      "id": 13,
      "title": "Roman to Integer",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "Math",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0013. Roman to Integer"
    },
    {
      "id": 14,
      "title": "Longest Common Prefix",
      "difficulty": "easy",
      "tags": [
        "Trie",
        "Array",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0014. Longest Common Prefix"
    },
    {
      "id": 15,
      "title": "3Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0015. 3Sum"
    },
    {
      "id": 17,
      "title": "Letter Combinations of a Phone Number",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0017. Letter Combinations of a Phone Number"
    },
    {
      "id": 19,
      "title": "Remove Nth Node From End of List",
      "difficulty": "medium",
      "tags": [
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0019. Remove Nth Node From End of List"
    },
    {
      "id": 20,
      "title": "Valid Parentheses",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0020. Valid Parentheses"
    },
    {
      "id": 21,
      "title": "Merge Two Sorted Lists",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Linked List"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0021. Merge Two Sorted Lists"
    },
    {
      "id": 22,
      "title": "Generate Parentheses",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming",
        "Backtracking"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0022. Generate Parentheses"
    },
    {
      "id": 24,
      "title": "Swap Nodes in Pairs",
      "difficulty": "medium",
      "tags": [
        "Recursion",
        "Linked List"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0024. Swap Nodes in Pairs"
    },
    {
      "id": 27,
      "title": "Remove Element",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0027. Remove Element"
    },
    {
      "id": 28,
      "title": "Find the Index of the First Occurrence in a String",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String",
        "String Matching"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0028. Find the Index of the First Occurrence in a String"
    },
    {
      "id": 30,
      "title": "Substring with Concatenation of All Words",
      "difficulty": "hard",
      "tags": [
        "Hash Table",
        "String",
        "Sliding Window"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/hard/0030. Substring with Concatenation of All Words"
    },
    {
      "id": 33,
      "title": "Search in Rotated Sorted Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0033. Search in Rotated Sorted Array"
    },
    {
      "id": 34,
      "title": "Find First and Last Position of Element in Sorted Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0034. Find First and Last Position of Element in Sorted Array"
    },
    {
      "id": 35,
      "title": "Search Insert Position",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0035. Search Insert Position"
    },
    {
      "id": 36,
      "title": "Valid Sudoku",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Matrix"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0036. Valid Sudoku"
    },
    {
      "id": 38,
      "title": "Count and Say",
      "difficulty": "medium",
      "tags": [
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0038. Count and Say"
    },
    {
      "id": 39,
      "title": "Combination Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Backtracking"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0039. Combination Sum"
    },
    {
      "id": 40,
      "title": "Combination Sum II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0040. Combination Sum II"
    },
    {
      "id": 43,
      "title": "Multiply Strings",
      "difficulty": "medium",
      "tags": [
        "Math",
        "String",
        "Simulation"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0043. Multiply Strings"
    },
    {
      "id": 45,
      "title": "Jump Game II",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0045. Jump Game II"
    },
    {
      "id": 46,
      "title": "Permutations",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Backtracking"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0046. Permutations"
    },
    {
      "id": 47,
      "title": "Permutations II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Backtracking",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0047. Permutations II"
    },
    {
      "id": 48,
      "title": "Rotate Image",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math",
        "Matrix"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0048. Rotate Image"
    },
    {
      "id": 49,
      "title": "Group Anagrams",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0049. Group Anagrams"
    },
    {
      "id": 50,
      "title": "Pow(x, n)",
      "difficulty": "medium",
      "tags": [
        "Recursion",
        "Math"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0050. Pow(x, n)"
    },
    {
      "id": 53,
      "title": "Maximum Subarray",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Divide and Conquer",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0053. Maximum Subarray"
    },
    {
      "id": 54,
      "title": "Spiral Matrix",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0054. Spiral Matrix"
    },
    {
      "id": 55,
      "title": "Jump Game",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "C++",
        "Go",
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0055. Jump Game"
    },
    {
      "id": 56,
      "title": "Merge Intervals",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0056. Merge Intervals"
    },
    {
      "id": 58,
      "title": "Length of Last Word",
      "difficulty": "easy",
      "tags": [
        "String"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0058. Length of Last Word"
    },
    {
      "id": 59,
      "title": "Spiral Matrix II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0059. Spiral Matrix II"
    },
    {
      "id": 62,
      "title": "Unique Paths",
      "difficulty": "medium",
      "tags": [
        "Math",
        "Dynamic Programming",
        "Combinatorics"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0062. Unique Paths"
    },
    {
      "id": 63,
      "title": "Unique Paths II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0063. Unique Paths II"
    },
    {
      "id": 64,
      "title": "Minimum Path Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0064. Minimum Path Sum"
    },
    {
      "id": 66,
      "title": "Plus One",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0066. Plus One"
    },
    {
      "id": 67,
      "title": "Add Binary",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Math",
        "String",
        "Simulation"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0067. Add Binary"
    },
    {
      "id": 69,
      "title": "Sqrt(x)",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0069. Sqrt(x)"
    },
    {
      "id": 70,
      "title": "Climbing Stairs",
      "difficulty": "easy",
      "tags": [
        "Memoization",
        "Math",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0070. Climbing Stairs"
    },
    {
      "id": 71,
      "title": "Simplify Path",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0071. Simplify Path"
    },
    {
      "id": 72,
      "title": "Edit Distance",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0072. Edit Distance"
    },
    {
      "id": 74,
      "title": "Search a 2D Matrix",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0074. Search a 2D Matrix"
    },
    {
      "id": 75,
      "title": "Sort Colors",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0075. Sort Colors"
    },
    {
      "id": 77,
      "title": "Combinations",
      "difficulty": "medium",
      "tags": [
        "Backtracking"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0077. Combinations"
    },
    {
      "id": 78,
      "title": "Subsets",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Backtracking"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0078. Subsets"
    },
    {
      "id": 79,
      "title": "Word Search",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Array",
        "String",
        "Backtracking",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0079. Word Search"
    },
    {
      "id": 81,
      "title": "Search in Rotated Sorted Array II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/0081. Search in Rotated Sorted Array II"
    },
    {
      "id": 82,
      "title": "Remove Duplicates from Sorted List II",
      "difficulty": "medium",
      "tags": [
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0082. Remove Duplicates from Sorted List II"
    },
    {
      "id": 83,
      "title": "Remove Duplicates from Sorted List",
      "difficulty": "easy",
      "tags": [
        "Linked List"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0083. Remove Duplicates from Sorted List"
    },
    {
      "id": 86,
      "title": "Partition List",
      "difficulty": "medium",
      "tags": [
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0086. Partition List"
    },
    {
      "id": 88,
      "title": "Merge Sorted Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0088. Merge Sorted Array"
    },
    {
      "id": 89,
      "title": "Gray Code",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Math",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0089. Gray Code"
    },
    {
      "id": 90,
      "title": "Subsets II",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0090. Subsets II"
    },
    {
      "id": 91,
      "title": "Decode Ways",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0091. Decode Ways"
    },
    {
      "id": 92,
      "title": "Reverse Linked List II",
      "difficulty": "medium",
      "tags": [
        "Linked List"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0092. Reverse Linked List II"
    },
    {
      "id": 93,
      "title": "Restore IP Addresses",
      "difficulty": "medium",
      "tags": [
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0093. Restore IP Addresses"
    },
    {
      "id": 94,
      "title": "Binary Tree Inorder Traversal",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0094. Binary Tree Inorder Traversal"
    },
    {
      "id": 95,
      "title": "Unique Binary Search Trees II",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Dynamic Programming",
        "Backtracking",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust"
      ],
      "path": "leetcode/medium/0095. Unique Binary Search Trees II"
    },
    {
      "id": 96,
      "title": "Unique Binary Search Trees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Math",
        "Dynamic Programming",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0096. Unique Binary Search Trees"
    },
    {
      "id": 97,
      "title": "Interleaving String",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0097. Interleaving String"
    },
    {
      "id": 98,
      "title": "Validate Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0098. Validate Binary Search Tree"
    },
    {
      "id": 99,
      "title": "Recover Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0099. Recover Binary Search Tree"
    },
    {
      "id": 100,
      "title": "Same Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0100. Same Tree"
    },
    {
      "id": 101,
      "title": "Symmetric Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0101. Symmetric Tree"
    },
    {
      "id": 102,
      "title": "Binary Tree Level Order Traversal",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0102. Binary Tree Level Order Traversal"
    },
    {
      "id": 103,
      "title": "Binary Tree Zigzag Level Order Traversal",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0103. Binary Tree Zigzag Level Order Traversal"
    },
    {
      "id": 104,
      "title": "Maximum Depth of Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0104. Maximum Depth of Binary Tree"
    },
    {
      "id": 105,
      "title": "Construct Binary Tree from Preorder and Inorder Traversal",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Array",
        "Hash Table",
        "Divide and Conquer",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0105. Construct Binary Tree from Preorder and Inorder Traversal"
    },
    {
      "id": 107,
      "title": "Binary Tree Level Order Traversal II",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java"
      ],
      "path": "leetcode/medium/0107. Binary Tree Level Order Traversal II"
    },
    {
      "id": 108,
      "title": "Convert Sorted Array to Binary Search Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Array",
        "Divide and Conquer",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0108. Convert Sorted Array to Binary Search Tree"
    },
    {
      "id": 109,
      "title": "Convert Sorted List to Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Linked List",
        "Divide and Conquer",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0109. Convert Sorted List to Binary Search Tree"
    },
    {
      "id": 110,
      "title": "Balanced Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "C++",
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0110. Balanced Binary Tree"
    },
    {
      "id": 111,
      "title": "Minimum Depth of Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0111. Minimum Depth of Binary Tree"
    },
    {
      "id": 112,
      "title": "Path Sum",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0112. Path Sum"
    },
    {
      "id": 113,
      "title": "Path Sum II",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Backtracking",
        "Binary Tree"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0113. Path Sum II"
    },
    {
      "id": 114,
      "title": "Flatten Binary Tree to Linked List",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Linked List",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java"
      ],
      "path": "leetcode/medium/0114. Flatten Binary Tree to Linked List"
    },
    {
      "id": 116,
      "title": "Populating Next Right Pointers in Each Node",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Linked List",
        "Binary Tree"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0116. Populating Next Right Pointers in Each Node"
    },
    {
      "id": 118,
      "title": "Pascal's Triangle",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0118. Pascal's Triangle"
    },
    {
      "id": 119,
      "title": "Pascal's Triangle II",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0119. Pascal's Triangle II"
    },
    {
      "id": 120,
      "title": "Triangle",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0120. Triangle"
    },
    {
      "id": 121,
      "title": "Best Time to Buy and Sell Stock",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0121. Best Time to Buy and Sell Stock"
    },
    {
      "id": 124,
      "title": "Binary Tree Maximum Path Sum",
      "difficulty": "hard",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Dynamic Programming",
        "Binary Tree"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/hard/0124. Binary Tree Maximum Path Sum"
    },
    {
      "id": 125,
      "title": "Valid Palindrome",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/easy/0125. Valid Palindrome"
    },
    {
      "id": 129,
      "title": "Sum Root to Leaf Numbers",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0129. Sum Root to Leaf Numbers"
    },
    {
      "id": 133,
      "title": "Clone Graph",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Hash Table"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0133. Clone Graph"
    },
    {
      "id": 136,
      "title": "Single Number",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array"
      ],
      "languages": [
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0136. Single Number"
    },
    {
      "id": 139,
      "title": "Word Break",
      "difficulty": "medium",
      "tags": [
        "Trie",
        "Memoization",
        "Array",
        "Hash Table",
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0139. Word Break"
    },
    {
      "id": 141,
      "title": "Linked List Cycle",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0141. Linked List Cycle"
    },
    {
      "id": 144,
      "title": "Binary Tree Preorder Traversal",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0144. Binary Tree Preorder Traversal"
    },
    {
      "id": 145,
      "title": "Binary Tree Postorder Traversal",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0145. Binary Tree Postorder Traversal"
    },
    {
      "id": 150,
      "title": "Evaluate Reverse Polish Notation",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0150. Evaluate Reverse Polish Notation"
    },
    {
      "id": 152,
      "title": "Maximum Product Subarray",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0152. Maximum Product Subarray"
    },
    {
      "id": 153,
      "title": "Find Minimum in Rotated Sorted Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0153. Find Minimum in Rotated Sorted Array"
    },
    {
      "id": 160,
      "title": "Intersection of Two Linked Lists",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0160. Intersection of Two Linked Lists"
    },
    {
      "id": 162,
      "title": "Find Peak Element",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0162. Find Peak Element"
    },
    {
      "id": 167,
      "title": "Two Sum II - Input Array Is Sorted",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0167. Two Sum II - Input Array Is Sorted"
    },
    {
      "id": 168,
      "title": "Excel Sheet Column Title",
      "difficulty": "easy",
      "tags": [
        "Math",
        "String"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0168. Excel Sheet Column Title"
    },
    {
      "id": 169,
      "title": "Majority Element",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Divide and Conquer",
        "Counting",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0169. Majority Element"
    },
    {
      "id": 173,
      "title": "Binary Search Tree Iterator",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Tree",
        "Design",
        "Binary Search Tree",
        "Binary Tree",
        "Iterator"
      ],
      "languages": [
        "C++",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0173. Binary Search Tree Iterator"
    },
    {
      "id": 175,
      "title": "Combine Two Tables",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0175. Combine Two Tables"
    },
    {
      "id": 176,
      "title": "Second Highest Salary",
      "difficulty": "medium",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/medium/0176. Second Highest Salary"
    },
    {
      "id": 177,
      "title": "Nth Highest Salary",
      "difficulty": "medium",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/medium/0177. Nth Highest Salary"
    },
    {
      "id": 181,
      "title": "Employees Earning More Than Their Managers",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0181. Employees Earning More Than Their Managers"
    },
    {
      "id": 182,
      "title": "Duplicate Emails",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0182. Duplicate Emails"
    },
    {
      "id": 183,
      "title": "Customers Who Never Order",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/easy/0183. Customers Who Never Order"
    },
    {
      "id": 184,
      "title": "Department Highest Salary",
      "difficulty": "medium",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/medium/0184. Department Highest Salary"
    },
    {
      "id": 185,
      "title": "Department Top Three Salaries",
      "difficulty": "hard",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/hard/0185. Department Top Three Salaries"
    },
    {
      "id": 187,
      "title": "Repeated DNA Sequences",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Hash Table",
        "String",
        "Sliding Window",
        "Hash Function",
        "Rolling Hash"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0187. Repeated DNA Sequences"
    },
    {
      "id": 189,
      "title": "Rotate Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math",
        "Two Pointers"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0189. Rotate Array"
    },
    {
      "id": 190,
      "title": "Reverse Bits",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Divide and Conquer"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/0190. Reverse Bits"
    },
    {
      "id": 191,
      "title": "Number of 1 Bits",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Divide and Conquer"
      ],
      "languages": [
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0191. Number of 1 Bits"
    },
    {
      "id": 195,
      "title": "Tenth Line",
      "difficulty": "easy",
      "tags": [
        "Shell"
      ],
      "languages": [
        "Shell"
      ],
      "path": "leetcode/easy/0195. Tenth Line"
    },
    {
      "id": 196,
      "title": "Delete Duplicate Emails",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/0196. Delete Duplicate Emails"
    },
    {
      "id": 197,
      "title": "Rising Temperature",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0197. Rising Temperature"
    },
    {
      "id": 198,
      "title": "House Robber",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "C++",
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0198. House Robber"
    },
    {
      "id": 199,
      "title": "Binary Tree Right Side View",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0199. Binary Tree Right Side View"
    },
    {
      "id": 200,
      "title": "Number of Islands",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0200. Number of Islands"
    },
    {
      "id": 202,
      "title": "Happy Number",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "Math",
        "Two Pointers"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0202. Happy Number"
    },
    {
      "id": 203,
      "title": "Remove Linked List Elements",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Linked List"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0203. Remove Linked List Elements"
    },
    {
      "id": 205,
      "title": "Isomorphic Strings",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0205. Isomorphic Strings"
    },
    {
      "id": 206,
      "title": "Reverse Linked List",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Linked List"
      ],
      "languages": [
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0206. Reverse Linked List"
    },
    {
      "id": 208,
      "title": "Implement Trie (Prefix Tree)",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Trie",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0208. Implement Trie (Prefix Tree)"
    },
    {
      "id": 210,
      "title": "Course Schedule II",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Topological Sort"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0210. Course Schedule II"
    },
    {
      "id": 211,
      "title": "Design Add and Search Words Data Structure",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Design",
        "Trie",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0211. Design Add and Search Words Data Structure"
    },
    {
      "id": 213,
      "title": "House Robber II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0213. House Robber II"
    },
    {
      "id": 215,
      "title": "Kth Largest Element in an Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Divide and Conquer",
        "Quickselect",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "Java",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0215. Kth Largest Element in an Array"
    },
    {
      "id": 217,
      "title": "Contains Duplicate",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/0217. Contains Duplicate"
    },
    {
      "id": 219,
      "title": "Contains Duplicate II",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0219. Contains Duplicate II"
    },
    {
      "id": 221,
      "title": "Maximal Square",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0221. Maximal Square"
    },
    {
      "id": 222,
      "title": "Count Complete Tree Nodes",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Tree",
        "Binary Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0222. Count Complete Tree Nodes"
    },
    {
      "id": 225,
      "title": "Implement Stack using Queues",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Design",
        "Queue"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0225. Implement Stack using Queues"
    },
    {
      "id": 226,
      "title": "Invert Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0226. Invert Binary Tree"
    },
    {
      "id": 230,
      "title": "Kth Smallest Element in a BST",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "C++"
      ],
      "path": "leetcode/medium/0230. Kth Smallest Element in a BST"
    },
    {
      "id": 231,
      "title": "Power of Two",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Recursion",
        "Math"
      ],
      "languages": [
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0231. Power of Two"
    },
    {
      "id": 232,
      "title": "Implement Queue using Stacks",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Design",
        "Queue"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0232. Implement Queue using Stacks"
    },
    {
      "id": 234,
      "title": "Palindrome Linked List",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Recursion",
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0234. Palindrome Linked List"
    },
    {
      "id": 235,
      "title": "Lowest Common Ancestor of a Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0235. Lowest Common Ancestor of a Binary Search Tree"
    },
    {
      "id": 236,
      "title": "Lowest Common Ancestor of a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0236. Lowest Common Ancestor of a Binary Tree"
    },
    {
      "id": 238,
      "title": "Product of Array Except Self",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0238. Product of Array Except Self"
    },
    {
      "id": 239,
      "title": "Sliding Window Maximum",
      "difficulty": "hard",
      "tags": [
        "Queue",
        "Array",
        "Sliding Window",
        "Monotonic Queue",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/0239. Sliding Window Maximum"
    },
    {
      "id": 240,
      "title": "Search a 2D Matrix II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search",
        "Divide and Conquer",
        "Matrix"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0240. Search a 2D Matrix II"
    },
    {
      "id": 242,
      "title": "Valid Anagram",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0242. Valid Anagram"
    },
    {
      "id": 257,
      "title": "Binary Tree Paths",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "String",
        "Backtracking",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0257. Binary Tree Paths"
    },
    {
      "id": 258,
      "title": "Add Digits",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Number Theory",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0258. Add Digits"
    },
    {
      "id": 263,
      "title": "Ugly Number",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0263. Ugly Number"
    },
    {
      "id": 264,
      "title": "Ugly Number II",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "Math",
        "Dynamic Programming",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "C",
        "Elixir",
        "Go",
        "JavaScript",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0264. Ugly Number II"
    },
    {
      "id": 268,
      "title": "Missing Number",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Hash Table",
        "Math",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0268. Missing Number"
    },
    {
      "id": 278,
      "title": "First Bad Version",
      "difficulty": "easy",
      "tags": [
        "Binary Search",
        "Interactive"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0278. First Bad Version"
    },
    {
      "id": 279,
      "title": "Perfect Squares",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Math",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0279. Perfect Squares"
    },
    {
      "id": 283,
      "title": "Move Zeroes",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0283. Move Zeroes"
    },
    {
      "id": 290,
      "title": "Word Pattern",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0290. Word Pattern"
    },
    {
      "id": 304,
      "title": "Range Sum Query 2D - Immutable",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Array",
        "Matrix",
        "Prefix Sum"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0304. Range Sum Query 2D - Immutable"
    },
    {
      "id": 310,
      "title": "Minimum Height Trees",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Topological Sort"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0310. Minimum Height Trees"
    },
    {
      "id": 316,
      "title": "Remove Duplicate Letters",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Greedy",
        "String",
        "Monotonic Stack"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0316. Remove Duplicate Letters"
    },
    {
      "id": 326,
      "title": "Power of Three",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Math"
      ],
      "languages": [
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0326. Power of Three"
    },
    {
      "id": 328,
      "title": "Odd Even Linked List",
      "difficulty": "medium",
      "tags": [
        "Linked List"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0328. Odd Even Linked List"
    },
    {
      "id": 330,
      "title": "Patching Array",
      "difficulty": "hard",
      "tags": [
        "Greedy",
        "Array"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/0330. Patching Array"
    },
    {
      "id": 332,
      "title": "Reconstruct Itinerary",
      "difficulty": "hard",
      "tags": [
        "Depth-First Search",
        "Graph",
        "Array",
        "String",
        "Sorting",
        "Eulerian Circuit",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/hard/0332. Reconstruct Itinerary"
    },
    {
      "id": 338,
      "title": "Counting Bits",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/0338. Counting Bits"
    },
    {
      "id": 341,
      "title": "Flatten Nested List Iterator",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Design",
        "Queue",
        "Iterator"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0341. Flatten Nested List Iterator"
    },
    {
      "id": 342,
      "title": "Power of Four",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Recursion",
        "Math"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0342. Power of Four"
    },
    {
      "id": 344,
      "title": "Reverse String",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "C",
        "Go",
        "Java",
        "Python",
        "Rust",
        "Scala",
        "TypeScript",
        "Zig"
      ],
      "path": "leetcode/easy/0344. Reverse String"
    },
    {
      "id": 345,
      "title": "Reverse Vowels of a String",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0345. Reverse Vowels of a String"
    },
    {
      "id": 347,
      "title": "Top K Frequent Elements",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Divide and Conquer",
        "Bucket Sort",
        "Counting",
        "Quickselect",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0347. Top K Frequent Elements"
    },
    {
      "id": 349,
      "title": "Intersection of Two Arrays",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "C",
        "Elixir",
        "Go",
        "Java",
        "Python",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/0349. Intersection of Two Arrays"
    },
    {
      "id": 350,
      "title": "Intersection of Two Arrays II",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0350. Intersection of Two Arrays II"
    },
    {
      "id": 367,
      "title": "Valid Perfect Square",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Binary Search"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0367. Valid Perfect Square"
    },
    {
      "id": 374,
      "title": "Guess Number Higher or Lower",
      "difficulty": "easy",
      "tags": [
        "Binary Search",
        "Interactive"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0374. Guess Number Higher or Lower"
    },
    {
      "id": 380,
      "title": "Insert Delete GetRandom O(1)",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Array",
        "Hash Table",
        "Math",
        "Randomized"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0380. Insert Delete GetRandom O(1)"
    },
    {
      "id": 383,
      "title": "Ransom Note",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0383. Ransom Note"
    },
    {
      "id": 386,
      "title": "Lexicographical Numbers",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Trie"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0386. Lexicographical Numbers"
    },
    {
      "id": 387,
      "title": "First Unique Character in a String",
      "difficulty": "easy",
      "tags": [
        "Queue",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0387. First Unique Character in a String"
    },
    {
      "id": 389,
      "title": "Find the Difference",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0389. Find the Difference"
    },
    {
      "id": 392,
      "title": "Is Subsequence",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0392. Is Subsequence"
    },
    {
      "id": 401,
      "title": "Binary Watch",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0401. Binary Watch"
    },
    {
      "id": 404,
      "title": "Sum of Left Leaves",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0404. Sum of Left Leaves"
    },
    {
      "id": 409,
      "title": "Longest Palindrome",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Hash Table",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0409. Longest Palindrome"
    },
    {
      "id": 413,
      "title": "Arithmetic Slices",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0413. Arithmetic Slices"
    },
    {
      "id": 414,
      "title": "Third Maximum Number",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0414. Third Maximum Number"
    },
    {
      "id": 415,
      "title": "Add Strings",
      "difficulty": "easy",
      "tags": [
        "Math",
        "String",
        "Simulation"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0415. Add Strings"
    },
    {
      "id": 417,
      "title": "Pacific Atlantic Water Flow",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0417. Pacific Atlantic Water Flow"
    },
    {
      "id": 419,
      "title": "Battleships in a Board",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0419. Battleships in a Board"
    },
    {
      "id": 421,
      "title": "Maximum XOR of Two Numbers in an Array",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Trie",
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0421. Maximum XOR of Two Numbers in an Array"
    },
    {
      "id": 424,
      "title": "Longest Repeating Character Replacement",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Sliding Window"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0424. Longest Repeating Character Replacement"
    },
    {
      "id": 429,
      "title": "N-ary Tree Level Order Traversal",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0429. N-ary Tree Level Order Traversal"
    },
    {
      "id": 432,
      "title": "All O`one Data Structure",
      "difficulty": "hard",
      "tags": [
        "Design",
        "Hash Table",
        "Linked List",
        "Doubly-Linked List"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/0432. All O`one Data Structure"
    },
    {
      "id": 435,
      "title": "Non-overlapping Intervals",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Dynamic Programming",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust"
      ],
      "path": "leetcode/medium/0435. Non-overlapping Intervals"
    },
    {
      "id": 438,
      "title": "Find All Anagrams in a String",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0438. Find All Anagrams in a String"
    },
    {
      "id": 441,
      "title": "Arranging Coins",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0441. Arranging Coins"
    },
    {
      "id": 442,
      "title": "Find All Duplicates in an Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0442. Find All Duplicates in an Array"
    },
    {
      "id": 445,
      "title": "Add Two Numbers II",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Linked List",
        "Math"
      ],
      "languages": [
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0445. Add Two Numbers II"
    },
    {
      "id": 448,
      "title": "Find All Numbers Disappeared in an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0448. Find All Numbers Disappeared in an Array"
    },
    {
      "id": 450,
      "title": "Delete Node in a BST",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0450. Delete Node in a BST"
    },
    {
      "id": 451,
      "title": "Sort Characters By Frequency",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Bucket Sort",
        "Counting",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0451. Sort Characters By Frequency"
    },
    {
      "id": 452,
      "title": "Minimum Number of Arrows to Burst Balloons",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0452. Minimum Number of Arrows to Burst Balloons"
    },
    {
      "id": 455,
      "title": "Assign Cookies",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "Dart",
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0455. Assign Cookies"
    },
    {
      "id": 456,
      "title": "132 Pattern",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Binary Search",
        "Ordered Set",
        "Monotonic Stack"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0456. 132 Pattern"
    },
    {
      "id": 459,
      "title": "Repeated Substring Pattern",
      "difficulty": "easy",
      "tags": [
        "String",
        "String Matching"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0459. Repeated Substring Pattern"
    },
    {
      "id": 463,
      "title": "Island Perimeter",
      "difficulty": "easy",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Java",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/0463. Island Perimeter"
    },
    {
      "id": 476,
      "title": "Number Complement",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0476. Number Complement"
    },
    {
      "id": 485,
      "title": "Max Consecutive Ones",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0485. Max Consecutive Ones"
    },
    {
      "id": 494,
      "title": "Target Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0494. Target Sum"
    },
    {
      "id": 496,
      "title": "Next Greater Element I",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Array",
        "Hash Table",
        "Monotonic Stack"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/0496. Next Greater Element I"
    },
    {
      "id": 500,
      "title": "Keyboard Row",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0500. Keyboard Row"
    },
    {
      "id": 501,
      "title": "Find Mode in Binary Search Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/0501. Find Mode in Binary Search Tree"
    },
    {
      "id": 503,
      "title": "Next Greater Element II",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Monotonic Stack"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0503. Next Greater Element II"
    },
    {
      "id": 504,
      "title": "Base 7",
      "difficulty": "easy",
      "tags": [
        "Math",
        "String"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0504. Base 7"
    },
    {
      "id": 507,
      "title": "Perfect Number",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0507. Perfect Number"
    },
    {
      "id": 509,
      "title": "Fibonacci Number",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Memoization",
        "Math",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0509. Fibonacci Number"
    },
    {
      "id": 511,
      "title": "Game Play Analysis I",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0511. Game Play Analysis I"
    },
    {
      "id": 513,
      "title": "Find Bottom Left Tree Value",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0513. Find Bottom Left Tree Value"
    },
    {
      "id": 518,
      "title": "Coin Change II",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0518. Coin Change II"
    },
    {
      "id": 520,
      "title": "Detect Capital",
      "difficulty": "easy",
      "tags": [
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0520. Detect Capital"
    },
    {
      "id": 523,
      "title": "Continuous Subarray Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Math",
        "Prefix Sum"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/medium/0523. Continuous Subarray Sum"
    },
    {
      "id": 530,
      "title": "Minimum Absolute Difference in BST",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0530. Minimum Absolute Difference in BST"
    },
    {
      "id": 535,
      "title": "Encode and Decode TinyURL",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Hash Table",
        "String",
        "Hash Function"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0535. Encode and Decode TinyURL"
    },
    {
      "id": 539,
      "title": "Minimum Time Difference",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math",
        "String",
        "Sorting"
      ],
      "languages": [
        "Elixir",
        "Go"
      ],
      "path": "leetcode/medium/0539. Minimum Time Difference"
    },
    {
      "id": 541,
      "title": "Reverse String II",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0541. Reverse String II"
    },
    {
      "id": 542,
      "title": "01 Matrix",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0542. 01 Matrix"
    },
    {
      "id": 543,
      "title": "Diameter of Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0543. Diameter of Binary Tree"
    },
    {
      "id": 547,
      "title": "Number of Provinces",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0547. Number of Provinces"
    },
    {
      "id": 551,
      "title": "Student Attendance Record I",
      "difficulty": "easy",
      "tags": [
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0551. Student Attendance Record I"
    },
    {
      "id": 556,
      "title": "Next Greater Element III",
      "difficulty": "medium",
      "tags": [
        "Math",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0556. Next Greater Element III"
    },
    {
      "id": 557,
      "title": "Reverse Words in a String III",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0557. Reverse Words in a String III"
    },
    {
      "id": 559,
      "title": "Maximum Depth of N-ary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0559. Maximum Depth of N-ary Tree"
    },
    {
      "id": 560,
      "title": "Subarray Sum Equals K",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Prefix Sum"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0560. Subarray Sum Equals K"
    },
    {
      "id": 561,
      "title": "Array Partition",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array",
        "Counting Sort",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0561. Array Partition"
    },
    {
      "id": 563,
      "title": "Binary Tree Tilt",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/easy/0563. Binary Tree Tilt"
    },
    {
      "id": 566,
      "title": "Reshape the Matrix",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0566. Reshape the Matrix"
    },
    {
      "id": 567,
      "title": "Permutation in String",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "Two Pointers",
        "String",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Java",
        "Rust"
      ],
      "path": "leetcode/medium/0567. Permutation in String"
    },
    {
      "id": 572,
      "title": "Subtree of Another Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree",
        "String Matching",
        "Hash Function"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0572. Subtree of Another Tree"
    },
    {
      "id": 575,
      "title": "Distribute Candies",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/0575. Distribute Candies"
    },
    {
      "id": 576,
      "title": "Out of Boundary Paths",
      "difficulty": "medium",
      "tags": [
        "Dynamic Programming"
      ],
      "languages": [
        "Dart",
        "Go"
      ],
      "path": "leetcode/medium/0576. Out of Boundary Paths"
    },
    {
      "id": 577,
      "title": "Employee Bonus",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0577. Employee Bonus"
    },
    {
      "id": 586,
      "title": "Customer Placing the Largest Number of Orders",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0586. Customer Placing the Largest Number of Orders"
    },
    {
      "id": 589,
      "title": "N-ary Tree Preorder Traversal",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0589. N-ary Tree Preorder Traversal"
    },
    {
      "id": 590,
      "title": "N-ary Tree Postorder Traversal",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0590. N-ary Tree Postorder Traversal"
    },
    {
      "id": 594,
      "title": "Longest Harmonious Subsequence",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Counting",
        "Sorting",
        "Sliding Window"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0594. Longest Harmonious Subsequence"
    },
    {
      "id": 595,
      "title": "Big Countries",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/0595. Big Countries"
    },
    {
      "id": 596,
      "title": "Classes With at Least 5 Students",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0596. Classes With at Least 5 Students"
    },
    {
      "id": 599,
      "title": "Minimum Index Sum of Two Lists",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0599. Minimum Index Sum of Two Lists"
    },
    {
      "id": 605,
      "title": "Can Place Flowers",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0605. Can Place Flowers"
    },
    {
      "id": 606,
      "title": "Construct String from Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "String",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0606. Construct String from Binary Tree"
    },
    {
      "id": 607,
      "title": "Sales Person",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0607. Sales Person"
    },
    {
      "id": 608,
      "title": "Tree Node",
      "difficulty": "medium",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/medium/0608. Tree Node"
    },
    {
      "id": 610,
      "title": "Triangle Judgement",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0610. Triangle Judgement"
    },
    {
      "id": 617,
      "title": "Merge Two Binary Trees",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0617. Merge Two Binary Trees"
    },
    {
      "id": 619,
      "title": "Biggest Single Number",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0619. Biggest Single Number"
    },
    {
      "id": 620,
      "title": "Not Boring Movies",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0620. Not Boring Movies"
    },
    {
      "id": 621,
      "title": "Task Scheduler",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Hash Table",
        "Counting",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "C",
        "Go",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/medium/0621. Task Scheduler"
    },
    {
      "id": 622,
      "title": "Design Circular Queue",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Queue",
        "Array",
        "Linked List"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0622. Design Circular Queue"
    },
    {
      "id": 626,
      "title": "Exchange Seats",
      "difficulty": "medium",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/medium/0626. Exchange Seats"
    },
    {
      "id": 627,
      "title": "Swap Sex of Employees",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/0627. Swap Sex of Employees"
    },
    {
      "id": 628,
      "title": "Maximum Product of Three Numbers",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math",
        "Sorting"
      ],
      "languages": [
        "C",
        "C++",
        "Go",
        "Python",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/0628. Maximum Product of Three Numbers"
    },
    {
      "id": 629,
      "title": "K Inverse Pairs Array",
      "difficulty": "hard",
      "tags": [
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/0629. K Inverse Pairs Array"
    },
    {
      "id": 633,
      "title": "Sum of Square Numbers",
      "difficulty": "medium",
      "tags": [
        "Math",
        "Two Pointers",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0633. Sum of Square Numbers"
    },
    {
      "id": 637,
      "title": "Average of Levels in Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0637. Average of Levels in Binary Tree"
    },
    {
      "id": 641,
      "title": "Design Circular Deque",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Queue",
        "Array",
        "Linked List"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0641. Design Circular Deque"
    },
    {
      "id": 643,
      "title": "Maximum Average Subarray I",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0643. Maximum Average Subarray I"
    },
    {
      "id": 652,
      "title": "Find Duplicate Subtrees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0652. Find Duplicate Subtrees"
    },
    {
      "id": 653,
      "title": "Two Sum IV - Input is a BST",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Search Tree",
        "Hash Table",
        "Two Pointers",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0653. Two Sum IV - Input is a BST"
    },
    {
      "id": 658,
      "title": "Find K Closest Elements",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search",
        "Sorting",
        "Sliding Window",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0658. Find K Closest Elements"
    },
    {
      "id": 664,
      "title": "Strange Printer",
      "difficulty": "hard",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/0664. Strange Printer"
    },
    {
      "id": 669,
      "title": "Trim a Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0669. Trim a Binary Search Tree"
    },
    {
      "id": 671,
      "title": "Second Minimum Node In a Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0671. Second Minimum Node In a Binary Tree"
    },
    {
      "id": 673,
      "title": "Number of Longest Increasing Subsequence",
      "difficulty": "medium",
      "tags": [
        "Binary Indexed Tree",
        "Segment Tree",
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/0673. Number of Longest Increasing Subsequence"
    },
    {
      "id": 680,
      "title": "Valid Palindrome II",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0680. Valid Palindrome II"
    },
    {
      "id": 684,
      "title": "Redundant Connection",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0684. Redundant Connection"
    },
    {
      "id": 692,
      "title": "Top K Frequent Words",
      "difficulty": "medium",
      "tags": [
        "Trie",
        "Array",
        "Hash Table",
        "String",
        "Bucket Sort",
        "Counting",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0692. Top K Frequent Words"
    },
    {
      "id": 695,
      "title": "Max Area of Island",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0695. Max Area of Island"
    },
    {
      "id": 697,
      "title": "Degree of an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/0697. Degree of an Array"
    },
    {
      "id": 700,
      "title": "Search in a Binary Search Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0700. Search in a Binary Search Tree"
    },
    {
      "id": 701,
      "title": "Insert into a Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0701. Insert into a Binary Search Tree"
    },
    {
      "id": 703,
      "title": "Kth Largest Element in a Stream",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Design",
        "Binary Search Tree",
        "Binary Tree",
        "Data Stream",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/0703. Kth Largest Element in a Stream"
    },
    {
      "id": 704,
      "title": "Binary Search",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Elixir",
        "Go",
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0704. Binary Search"
    },
    {
      "id": 705,
      "title": "Design HashSet",
      "difficulty": "easy",
      "tags": [
        "Design",
        "Array",
        "Hash Table",
        "Linked List",
        "Hash Function"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0705. Design HashSet"
    },
    {
      "id": 706,
      "title": "Design HashMap",
      "difficulty": "easy",
      "tags": [
        "Design",
        "Array",
        "Hash Table",
        "Linked List",
        "Hash Function"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0706. Design HashMap"
    },
    {
      "id": 709,
      "title": "To Lower Case",
      "difficulty": "easy",
      "tags": [
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0709. To Lower Case"
    },
    {
      "id": 712,
      "title": "Minimum ASCII Delete Sum for Two Strings",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0712. Minimum ASCII Delete Sum for Two Strings"
    },
    {
      "id": 717,
      "title": "1-bit and 2-bit Characters",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0717. 1-bit and 2-bit Characters"
    },
    {
      "id": 724,
      "title": "Find Pivot Index",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0724. Find Pivot Index"
    },
    {
      "id": 726,
      "title": "Number of Atoms",
      "difficulty": "hard",
      "tags": [
        "Stack",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/0726. Number of Atoms"
    },
    {
      "id": 728,
      "title": "Self Dividing Numbers",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0728. Self Dividing Numbers"
    },
    {
      "id": 729,
      "title": "My Calendar I",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Segment Tree",
        "Array",
        "Binary Search",
        "Ordered Set"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/0729. My Calendar I"
    },
    {
      "id": 733,
      "title": "Flood Fill",
      "difficulty": "easy",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/0733. Flood Fill"
    },
    {
      "id": 739,
      "title": "Daily Temperatures",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Monotonic Stack"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0739. Daily Temperatures"
    },
    {
      "id": 744,
      "title": "Find Smallest Letter Greater Than Target",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0744. Find Smallest Letter Greater Than Target"
    },
    {
      "id": 746,
      "title": "Min Cost Climbing Stairs",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0746. Min Cost Climbing Stairs"
    },
    {
      "id": 747,
      "title": "Largest Number At Least Twice of Others",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0747. Largest Number At Least Twice of Others"
    },
    {
      "id": 763,
      "title": "Partition Labels",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Hash Table",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0763. Partition Labels"
    },
    {
      "id": 767,
      "title": "Reorganize String",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Hash Table",
        "String",
        "Counting",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0767. Reorganize String"
    },
    {
      "id": 771,
      "title": "Jewels and Stones",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/easy/0771. Jewels and Stones"
    },
    {
      "id": 783,
      "title": "Minimum Distance Between BST Nodes",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/0783. Minimum Distance Between BST Nodes"
    },
    {
      "id": 784,
      "title": "Letter Case Permutation",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "String",
        "Backtracking"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0784. Letter Case Permutation"
    },
    {
      "id": 785,
      "title": "Is Graph Bipartite",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0785. Is Graph Bipartite"
    },
    {
      "id": 786,
      "title": "K-th Smallest Prime Fraction",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0786. K-th Smallest Prime Fraction"
    },
    {
      "id": 796,
      "title": "Rotate String",
      "difficulty": "easy",
      "tags": [
        "String",
        "String Matching"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0796. Rotate String"
    },
    {
      "id": 797,
      "title": "All Paths From Source to Target",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Backtracking"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0797. All Paths From Source to Target"
    },
    {
      "id": 804,
      "title": "Unique Morse Code Words",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0804. Unique Morse Code Words"
    },
    {
      "id": 811,
      "title": "Subdomain Visit Count",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0811. Subdomain Visit Count"
    },
    {
      "id": 812,
      "title": "Largest Triangle Area",
      "difficulty": "easy",
      "tags": [
        "Geometry",
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0812. Largest Triangle Area"
    },
    {
      "id": 814,
      "title": "Binary Tree Pruning",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0814. Binary Tree Pruning"
    },
    {
      "id": 821,
      "title": "Shortest Distance to a Character",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0821. Shortest Distance to a Character"
    },
    {
      "id": 832,
      "title": "Flipping an Image",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Two Pointers",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0832. Flipping an Image"
    },
    {
      "id": 834,
      "title": "Sum of Distances in Tree",
      "difficulty": "hard",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Graph",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/0834. Sum of Distances in Tree"
    },
    {
      "id": 835,
      "title": "Image Overlap",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0835. Image Overlap"
    },
    {
      "id": 838,
      "title": "Push Dominoes",
      "difficulty": "medium",
      "tags": [
        "Two Pointers",
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0838. Push Dominoes"
    },
    {
      "id": 841,
      "title": "Keys and Rooms",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph"
      ],
      "languages": [
        "Go",
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/0841. Keys and Rooms"
    },
    {
      "id": 844,
      "title": "Backspace String Compare",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Two Pointers",
        "String",
        "Simulation"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0844. Backspace String Compare"
    },
    {
      "id": 852,
      "title": "Peak Index in a Mountain Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0852. Peak Index in a Mountain Array"
    },
    {
      "id": 856,
      "title": "Score of Parentheses",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0856. Score of Parentheses"
    },
    {
      "id": 859,
      "title": "Buddy Strings",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0859. Buddy Strings"
    },
    {
      "id": 861,
      "title": "Score After Flipping Matrix",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Bit Manipulation",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/0861. Score After Flipping Matrix"
    },
    {
      "id": 863,
      "title": "All Nodes Distance K in Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/0863. All Nodes Distance K in Binary Tree"
    },
    {
      "id": 865,
      "title": "Smallest Subtree with all the Deepest Nodes",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0865. Smallest Subtree with all the Deepest Nodes"
    },
    {
      "id": 867,
      "title": "Transpose Matrix",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0867. Transpose Matrix"
    },
    {
      "id": 869,
      "title": "Reordered Power of 2",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "Math",
        "Counting",
        "Enumeration",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0869. Reordered Power of 2"
    },
    {
      "id": 872,
      "title": "Leaf-Similar Trees",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0872. Leaf-Similar Trees"
    },
    {
      "id": 875,
      "title": "Koko Eating Bananas",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0875. Koko Eating Bananas"
    },
    {
      "id": 876,
      "title": "Middle of the Linked List",
      "difficulty": "easy",
      "tags": [
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/0876. Middle of the Linked List"
    },
    {
      "id": 880,
      "title": "Decoded String at Index",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0880. Decoded String at Index"
    },
    {
      "id": 884,
      "title": "Uncommon Words from Two Sentences",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0884. Uncommon Words from Two Sentences"
    },
    {
      "id": 885,
      "title": "Spiral Matrix III",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0885. Spiral Matrix III"
    },
    {
      "id": 889,
      "title": "Construct Binary Tree from Preorder and Postorder Traversal",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Array",
        "Hash Table",
        "Divide and Conquer",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0889. Construct Binary Tree from Preorder and Postorder Traversal"
    },
    {
      "id": 890,
      "title": "Find and Replace Pattern",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0890. Find and Replace Pattern"
    },
    {
      "id": 894,
      "title": "All Possible Full Binary Trees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Recursion",
        "Memoization",
        "Dynamic Programming",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0894. All Possible Full Binary Trees"
    },
    {
      "id": 896,
      "title": "Monotonic Array",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/0896. Monotonic Array"
    },
    {
      "id": 897,
      "title": "Increasing Order Search Tree",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0897. Increasing Order Search Tree"
    },
    {
      "id": 905,
      "title": "Sort Array By Parity",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/0905. Sort Array By Parity"
    },
    {
      "id": 907,
      "title": "Sum of Subarray Minimums",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Dynamic Programming",
        "Monotonic Stack"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0907. Sum of Subarray Minimums"
    },
    {
      "id": 912,
      "title": "Sort an Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Divide and Conquer",
        "Bucket Sort",
        "Counting Sort",
        "Radix Sort",
        "Sorting",
        "Heap (Priority Queue)",
        "Merge Sort"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0912. Sort an Array"
    },
    {
      "id": 917,
      "title": "Reverse Only Letters",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0917. Reverse Only Letters"
    },
    {
      "id": 920,
      "title": "Number of Music Playlists",
      "difficulty": "hard",
      "tags": [
        "Math",
        "Dynamic Programming",
        "Combinatorics"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/0920. Number of Music Playlists"
    },
    {
      "id": 925,
      "title": "Long Pressed Name",
      "difficulty": "easy",
      "tags": [
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0925. Long Pressed Name"
    },
    {
      "id": 931,
      "title": "Minimum Falling Path Sum",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0931. Minimum Falling Path Sum"
    },
    {
      "id": 938,
      "title": "Range Sum of BST",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/0938. Range Sum of BST"
    },
    {
      "id": 942,
      "title": "DI String Match",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0942. DI String Match"
    },
    {
      "id": 948,
      "title": "Bag of Tokens",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0948. Bag of Tokens"
    },
    {
      "id": 951,
      "title": "Flip Equivalent Binary Trees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/0951. Flip Equivalent Binary Trees"
    },
    {
      "id": 953,
      "title": "Verifying an Alien Dictionary",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/0953. Verifying an Alien Dictionary"
    },
    {
      "id": 956,
      "title": "Tallest Billboard",
      "difficulty": "hard",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/0956. Tallest Billboard"
    },
    {
      "id": 958,
      "title": "Check Completeness of a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/0958. Check Completeness of a Binary Tree"
    },
    {
      "id": 959,
      "title": "Regions Cut By Slashes",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Hash Table",
        "Matrix"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/medium/0959. Regions Cut By Slashes"
    },
    {
      "id": 961,
      "title": "N-Repeated Element in Size 2N Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0961. N-Repeated Element in Size 2N Array"
    },
    {
      "id": 962,
      "title": "Maximum Width Ramp",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Two Pointers",
        "Monotonic Stack"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0962. Maximum Width Ramp"
    },
    {
      "id": 965,
      "title": "Univalued Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0965. Univalued Binary Tree"
    },
    {
      "id": 967,
      "title": "Numbers With Same Consecutive Differences",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Backtracking"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0967. Numbers With Same Consecutive Differences"
    },
    {
      "id": 973,
      "title": "K Closest Points to Origin",
      "difficulty": "medium",
      "tags": [
        "Geometry",
        "Array",
        "Math",
        "Divide and Conquer",
        "Quickselect",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/0973. K Closest Points to Origin"
    },
    {
      "id": 974,
      "title": "Subarray Sums Divisible by K",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/0974. Subarray Sums Divisible by K"
    },
    {
      "id": 977,
      "title": "Squares of a Sorted Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers",
        "Sorting"
      ],
      "languages": [
        "Java",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/0977. Squares of a Sorted Array"
    },
    {
      "id": 979,
      "title": "Distribute Coins in Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/medium/0979. Distribute Coins in Binary Tree"
    },
    {
      "id": 981,
      "title": "Time Based Key-Value Store",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Hash Table",
        "String",
        "Binary Search"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/0981. Time Based Key-Value Store"
    },
    {
      "id": 983,
      "title": "Minimum Cost For Tickets",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/0983. Minimum Cost For Tickets"
    },
    {
      "id": 986,
      "title": "Interval List Intersections",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Sweep Line"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0986. Interval List Intersections"
    },
    {
      "id": 989,
      "title": "Add to Array-Form of Integer",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/0989. Add to Array-Form of Integer"
    },
    {
      "id": 990,
      "title": "Satisfiability of Equality Equations",
      "difficulty": "medium",
      "tags": [
        "Union Find",
        "Graph",
        "Array",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0990. Satisfiability of Equality Equations"
    },
    {
      "id": 993,
      "title": "Cousins in Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/0993. Cousins in Binary Tree"
    },
    {
      "id": 994,
      "title": "Rotting Oranges",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/0994. Rotting Oranges"
    },
    {
      "id": 1002,
      "title": "Find Common Characters",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1002. Find Common Characters"
    },
    {
      "id": 1009,
      "title": "Complement of Base 10 Integer",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1009. Complement of Base 10 Integer"
    },
    {
      "id": 1018,
      "title": "Binary Prefix Divisible By 5",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1018. Binary Prefix Divisible By 5"
    },
    {
      "id": 1020,
      "title": "Number of Enclaves",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1020. Number of Enclaves"
    },
    {
      "id": 1022,
      "title": "Sum of Root To Leaf Binary Numbers",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1022. Sum of Root To Leaf Binary Numbers"
    },
    {
      "id": 1026,
      "title": "Maximum Difference Between Node and Ancestor",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1026. Maximum Difference Between Node and Ancestor"
    },
    {
      "id": 1037,
      "title": "Valid Boomerang",
      "difficulty": "easy",
      "tags": [
        "Geometry",
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/1037. Valid Boomerang"
    },
    {
      "id": 1038,
      "title": "Binary Search Tree to Greater Sum Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1038. Binary Search Tree to Greater Sum Tree"
    },
    {
      "id": 1039,
      "title": "Minimum Score Triangulation of Polygon",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1039. Minimum Score Triangulation of Polygon"
    },
    {
      "id": 1046,
      "title": "Last Stone Weight",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1046. Last Stone Weight"
    },
    {
      "id": 1048,
      "title": "Longest String Chain",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "String",
        "Dynamic Programming",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1048. Longest String Chain"
    },
    {
      "id": 1050,
      "title": "Actors and Directors Who Cooperated At Least Three Times",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1050. Actors and Directors Who Cooperated At Least Three Times"
    },
    {
      "id": 1051,
      "title": "Height Checker",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Counting Sort",
        "Sorting"
      ],
      "languages": [
        "Elixir",
        "Go",
        "Python",
        "Rust",
        "TypeScript",
        "Zig"
      ],
      "path": "leetcode/easy/1051. Height Checker"
    },
    {
      "id": 1068,
      "title": "Product Sales Analysis I",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1068. Product Sales Analysis I"
    },
    {
      "id": 1081,
      "title": "Smallest Subsequence of Distinct Characters",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Greedy",
        "String",
        "Monotonic Stack"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1081. Smallest Subsequence of Distinct Characters"
    },
    {
      "id": 1089,
      "title": "Duplicate Zeros",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1089. Duplicate Zeros"
    },
    {
      "id": 1091,
      "title": "Shortest Path in Binary Matrix",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Array",
        "Matrix"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1091. Shortest Path in Binary Matrix"
    },
    {
      "id": 1108,
      "title": "Defanging an IP Address",
      "difficulty": "easy",
      "tags": [
        "String"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/1108. Defanging an IP Address"
    },
    {
      "id": 1110,
      "title": "Delete Nodes And Return Forest",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Array",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1110. Delete Nodes And Return Forest"
    },
    {
      "id": 1114,
      "title": "Print in Order",
      "difficulty": "easy",
      "tags": [
        "多线程"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1114. Print in Order"
    },
    {
      "id": 1122,
      "title": "Relative Sort Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Counting Sort",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1122. Relative Sort Array"
    },
    {
      "id": 1137,
      "title": "N-th Tribonacci Number",
      "difficulty": "easy",
      "tags": [
        "Memoization",
        "Math",
        "Dynamic Programming"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1137. N-th Tribonacci Number"
    },
    {
      "id": 1141,
      "title": "User Activity for the Past 30 Days I",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1141. User Activity for the Past 30 Days I"
    },
    {
      "id": 1143,
      "title": "Longest Common Subsequence",
      "difficulty": "medium",
      "tags": [
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/1143. Longest Common Subsequence"
    },
    {
      "id": 1148,
      "title": "Article Views I",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1148. Article Views I"
    },
    {
      "id": 1154,
      "title": "Day of the Year",
      "difficulty": "easy",
      "tags": [
        "Math",
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1154. Day of the Year"
    },
    {
      "id": 1161,
      "title": "Maximum Level Sum of a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1161. Maximum Level Sum of a Binary Tree"
    },
    {
      "id": 1162,
      "title": "As Far from Land as Possible",
      "difficulty": "medium",
      "tags": [
        "Breadth-First Search",
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/1162. As Far from Land as Possible"
    },
    {
      "id": 1185,
      "title": "Day of the Week",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1185. Day of the Week"
    },
    {
      "id": 1190,
      "title": "Reverse Substrings Between Each Pair of Parentheses",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/1190. Reverse Substrings Between Each Pair of Parentheses"
    },
    {
      "id": 1200,
      "title": "Minimum Absolute Difference",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1200. Minimum Absolute Difference"
    },
    {
      "id": 1203,
      "title": "Sort Items by Groups Respecting Dependencies",
      "difficulty": "hard",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Topological Sort"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/hard/1203. Sort Items by Groups Respecting Dependencies"
    },
    {
      "id": 1207,
      "title": "Unique Number of Occurrences",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1207. Unique Number of Occurrences"
    },
    {
      "id": 1221,
      "title": "Split a String in Balanced Strings",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "String",
        "Counting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1221. Split a String in Balanced Strings"
    },
    {
      "id": 1239,
      "title": "Maximum Length of a Concatenated String with Unique Characters",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array",
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1239. Maximum Length of a Concatenated String with Unique Characters"
    },
    {
      "id": 1249,
      "title": "Minimum Remove to Make Valid Parentheses",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1249. Minimum Remove to Make Valid Parentheses"
    },
    {
      "id": 1251,
      "title": "Average Selling Price",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1251. Average Selling Price"
    },
    {
      "id": 1254,
      "title": "Number of Closed Islands",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/1254. Number of Closed Islands"
    },
    {
      "id": 1261,
      "title": "Find Elements in a Contaminated Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Design",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1261. Find Elements in a Contaminated Binary Tree"
    },
    {
      "id": 1266,
      "title": "Minimum Time Visiting All Points",
      "difficulty": "easy",
      "tags": [
        "Geometry",
        "Array",
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1266. Minimum Time Visiting All Points"
    },
    {
      "id": 1281,
      "title": "Subtract the Product and Sum of Digits of an Integer",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1281. Subtract the Product and Sum of Digits of an Integer"
    },
    {
      "id": 1287,
      "title": "Element Appearing More Than 25% In Sorted Array",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1287. Element Appearing More Than 25% In Sorted Array"
    },
    {
      "id": 1302,
      "title": "Deepest Leaves Sum",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1302. Deepest Leaves Sum"
    },
    {
      "id": 1305,
      "title": "All Elements in Two Binary Search Trees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Binary Tree",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1305. All Elements in Two Binary Search Trees"
    },
    {
      "id": 1306,
      "title": "Jump Game III",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Array"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1306. Jump Game III"
    },
    {
      "id": 1315,
      "title": "Sum of Nodes with Even-Valued Grandparent",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1315. Sum of Nodes with Even-Valued Grandparent"
    },
    {
      "id": 1318,
      "title": "Minimum Flips to Make a OR b Equal to c",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1318. Minimum Flips to Make a OR b Equal to c"
    },
    {
      "id": 1323,
      "title": "Maximum 69 Number",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Math"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1323. Maximum 69 Number"
    },
    {
      "id": 1337,
      "title": "The K Weakest Rows in a Matrix",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search",
        "Matrix",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/1337. The K Weakest Rows in a Matrix"
    },
    {
      "id": 1338,
      "title": "Reduce Array Size to The Half",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Hash Table",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1338. Reduce Array Size to The Half"
    },
    {
      "id": 1339,
      "title": "Maximum Product of Splitted Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/1339. Maximum Product of Splitted Binary Tree"
    },
    {
      "id": 1346,
      "title": "Check If N and Its Double Exist",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1346. Check If N and Its Double Exist"
    },
    {
      "id": 1347,
      "title": "Minimum Number of Steps to Make Two Strings Anagram",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Dart",
        "Elixir",
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1347. Minimum Number of Steps to Make Two Strings Anagram"
    },
    {
      "id": 1351,
      "title": "Count Negative Numbers in a Sorted Matrix",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search",
        "Matrix"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/1351. Count Negative Numbers in a Sorted Matrix"
    },
    {
      "id": 1356,
      "title": "Sort Integers by The Number of 1 Bits",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Counting",
        "Sorting"
      ],
      "languages": [
        "C",
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1356. Sort Integers by The Number of 1 Bits"
    },
    {
      "id": 1365,
      "title": "How Many Numbers Are Smaller Than the Current Number",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Counting Sort",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/1365. How Many Numbers Are Smaller Than the Current Number"
    },
    {
      "id": 1367,
      "title": "Linked List in Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Linked List",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1367. Linked List in Binary Tree"
    },
    {
      "id": 1370,
      "title": "Increasing Decreasing String",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1370. Increasing Decreasing String"
    },
    {
      "id": 1372,
      "title": "Longest ZigZag Path in a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Dynamic Programming",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1372. Longest ZigZag Path in a Binary Tree"
    },
    {
      "id": 1376,
      "title": "Time Needed to Inform All Employees",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/1376. Time Needed to Inform All Employees"
    },
    {
      "id": 1379,
      "title": "Find a Corresponding Node of a Binary Tree in a Clone of That Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1379. Find a Corresponding Node of a Binary Tree in a Clone of That Tree"
    },
    {
      "id": 1382,
      "title": "Balance a Binary Search Tree",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Tree",
        "Depth-First Search",
        "Binary Search Tree",
        "Divide and Conquer",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1382. Balance a Binary Search Tree"
    },
    {
      "id": 1383,
      "title": "Maximum Performance of a Team",
      "difficulty": "hard",
      "tags": [
        "Greedy",
        "Array",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Java"
      ],
      "path": "leetcode/hard/1383. Maximum Performance of a Team"
    },
    {
      "id": 1385,
      "title": "Find the Distance Value Between Two Arrays",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/easy/1385. Find the Distance Value Between Two Arrays"
    },
    {
      "id": 1389,
      "title": "Create Target Array in the Given Order",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Simulation"
      ],
      "languages": [
        "Rust",
        "Scala"
      ],
      "path": "leetcode/easy/1389. Create Target Array in the Given Order"
    },
    {
      "id": 1403,
      "title": "Minimum Subsequence in Non-Increasing Order",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1403. Minimum Subsequence in Non-Increasing Order"
    },
    {
      "id": 1404,
      "title": "Number of Steps to Reduce a Number in Binary Representation to One",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "String",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1404. Number of Steps to Reduce a Number in Binary Representation to One"
    },
    {
      "id": 1415,
      "title": "The k-th Lexicographical String of All Happy Strings of Length n",
      "difficulty": "medium",
      "tags": [
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1415. The k-th Lexicographical String of All Happy Strings of Length n"
    },
    {
      "id": 1420,
      "title": "Build Array Where You Can Find The Maximum Exactly K Comparisons",
      "difficulty": "hard",
      "tags": [
        "Dynamic Programming",
        "Prefix Sum"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/1420. Build Array Where You Can Find The Maximum Exactly K Comparisons"
    },
    {
      "id": 1431,
      "title": "Kids With the Greatest Number of Candies",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/1431. Kids With the Greatest Number of Candies"
    },
    {
      "id": 1436,
      "title": "Destination City",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1436. Destination City"
    },
    {
      "id": 1437,
      "title": "Check If All 1's Are at Least Length K Places Away",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1437. Check If All 1's Are at Least Length K Places Away"
    },
    {
      "id": 1441,
      "title": "Build an Array With Stack Operations",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1441. Build an Array With Stack Operations"
    },
    {
      "id": 1448,
      "title": "Count Good Nodes in Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1448. Count Good Nodes in Binary Tree"
    },
    {
      "id": 1456,
      "title": "Maximum Number of Vowels in a Substring of Given Length",
      "difficulty": "medium",
      "tags": [
        "String",
        "Sliding Window"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1456. Maximum Number of Vowels in a Substring of Given Length"
    },
    {
      "id": 1457,
      "title": "Pseudo-Palindromic Paths in a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1457. Pseudo-Palindromic Paths in a Binary Tree"
    },
    {
      "id": 1458,
      "title": "Max Dot Product of Two Subsequences",
      "difficulty": "hard",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/hard/1458. Max Dot Product of Two Subsequences"
    },
    {
      "id": 1464,
      "title": "Maximum Product of Two Elements in an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/1464. Maximum Product of Two Elements in an Array"
    },
    {
      "id": 1470,
      "title": "Shuffle the Array",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Rust",
        "Scala"
      ],
      "path": "leetcode/easy/1470. Shuffle the Array"
    },
    {
      "id": 1472,
      "title": "Design Browser History",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Design",
        "Array",
        "Linked List",
        "Data Stream",
        "Doubly-Linked List"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1472. Design Browser History"
    },
    {
      "id": 1476,
      "title": "Subrectangle Queries",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Java",
        "Rust"
      ],
      "path": "leetcode/medium/1476. Subrectangle Queries"
    },
    {
      "id": 1480,
      "title": "Running Sum of 1d Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1480. Running Sum of 1d Array"
    },
    {
      "id": 1484,
      "title": "Group Sold Products By The Date",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1484. Group Sold Products By The Date"
    },
    {
      "id": 1489,
      "title": "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
      "difficulty": "hard",
      "tags": [
        "Union Find",
        "Graph",
        "Minimum Spanning Tree",
        "Sorting",
        "Strongly Connected Component"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/hard/1489. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree"
    },
    {
      "id": 1491,
      "title": "Average Salary Excluding the Minimum and Maximum Salary",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1491. Average Salary Excluding the Minimum and Maximum Salary"
    },
    {
      "id": 1498,
      "title": "Number of Subsequences That Satisfy the Given Sum Condition",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1498. Number of Subsequences That Satisfy the Given Sum Condition"
    },
    {
      "id": 1503,
      "title": "Last Moment Before All Ants Fall Out of a Plank",
      "difficulty": "medium",
      "tags": [
        "Brainteaser",
        "Array",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1503. Last Moment Before All Ants Fall Out of a Plank"
    },
    {
      "id": 1512,
      "title": "Number of Good Pairs",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Math",
        "Counting"
      ],
      "languages": [
        "Go",
        "Rust",
        "Scala"
      ],
      "path": "leetcode/easy/1512. Number of Good Pairs"
    },
    {
      "id": 1514,
      "title": "Path with Maximum Probability",
      "difficulty": "medium",
      "tags": [
        "Graph",
        "Array",
        "Shortest Path",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/1514. Path with Maximum Probability"
    },
    {
      "id": 1517,
      "title": "Find Users With Valid E-Mails",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1517. Find Users With Valid E-Mails"
    },
    {
      "id": 1518,
      "title": "Water Bottles",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1518. Water Bottles"
    },
    {
      "id": 1523,
      "title": "Count Odd Numbers in an Interval Range",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1523. Count Odd Numbers in an Interval Range"
    },
    {
      "id": 1527,
      "title": "Patients With a Condition",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1527. Patients With a Condition"
    },
    {
      "id": 1534,
      "title": "Count Good Triplets",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Enumeration"
      ],
      "languages": [
        "C",
        "C++",
        "Go",
        "Java",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1534. Count Good Triplets"
    },
    {
      "id": 1535,
      "title": "Find the Winner of an Array Game",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1535. Find the Winner of an Array Game"
    },
    {
      "id": 1539,
      "title": "Kth Missing Positive Number",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/easy/1539. Kth Missing Positive Number"
    },
    {
      "id": 1550,
      "title": "Three Consecutive Odds",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1550. Three Consecutive Odds"
    },
    {
      "id": 1557,
      "title": "Minimum Number of Vertices to Reach All Nodes",
      "difficulty": "medium",
      "tags": [
        "Graph"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1557. Minimum Number of Vertices to Reach All Nodes"
    },
    {
      "id": 1559,
      "title": "Detect Cycles in 2D Grid",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1559. Detect Cycles in 2D Grid"
    },
    {
      "id": 1572,
      "title": "Matrix Diagonal Sum",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1572. Matrix Diagonal Sum"
    },
    {
      "id": 1574,
      "title": "Shortest Subarray to be Removed to Make Array Sorted",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Array",
        "Two Pointers",
        "Binary Search",
        "Monotonic Stack"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1574. Shortest Subarray to be Removed to Make Array Sorted"
    },
    {
      "id": 1581,
      "title": "Customer Who Visited but Did Not Make Any Transactions",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1581. Customer Who Visited but Did Not Make Any Transactions"
    },
    {
      "id": 1584,
      "title": "Min Cost to Connect All Points",
      "difficulty": "medium",
      "tags": [
        "Union Find",
        "Graph",
        "Array",
        "Minimum Spanning Tree"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/1584. Min Cost to Connect All Points"
    },
    {
      "id": 1590,
      "title": "Make Sum Divisible by P",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Prefix Sum"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1590. Make Sum Divisible by P"
    },
    {
      "id": 1593,
      "title": "Split a String Into the Max Number of Unique Substrings",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1593. Split a String Into the Max Number of Unique Substrings"
    },
    {
      "id": 1608,
      "title": "Special Array With X Elements Greater Than or Equal X",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Elixir",
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1608. Special Array With X Elements Greater Than or Equal X"
    },
    {
      "id": 1624,
      "title": "Largest Substring Between Two Equal Characters",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Dart",
        "Elixir",
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1624. Largest Substring Between Two Equal Characters"
    },
    {
      "id": 1630,
      "title": "Arithmetic Subarrays",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Sorting"
      ],
      "languages": [
        "Java",
        "TypeScript"
      ],
      "path": "leetcode/medium/1630. Arithmetic Subarrays"
    },
    {
      "id": 1631,
      "title": "Path With Minimum Effort",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Binary Search",
        "Matrix",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/1631. Path With Minimum Effort"
    },
    {
      "id": 1647,
      "title": "Minimum Deletions to Make Character Frequencies Unique",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/1647. Minimum Deletions to Make Character Frequencies Unique"
    },
    {
      "id": 1653,
      "title": "Minimum Deletions to Make String Balanced",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "String",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1653. Minimum Deletions to Make String Balanced"
    },
    {
      "id": 1656,
      "title": "Design an Ordered Stream",
      "difficulty": "easy",
      "tags": [
        "Design",
        "Array",
        "Hash Table",
        "Data Stream"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1656. Design an Ordered Stream"
    },
    {
      "id": 1657,
      "title": "Determine if Two Strings Are Close",
      "difficulty": "medium",
      "tags": [
        "Hash Table",
        "String",
        "Counting",
        "Sorting"
      ],
      "languages": [
        "Dart",
        "Elixir",
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/1657. Determine if Two Strings Are Close"
    },
    {
      "id": 1662,
      "title": "Check If Two String Arrays are Equivalent",
      "difficulty": "easy",
      "tags": [
        "Array",
        "String"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/1662. Check If Two String Arrays are Equivalent"
    },
    {
      "id": 1667,
      "title": "Fix Names in a Table",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1667. Fix Names in a Table"
    },
    {
      "id": 1683,
      "title": "Invalid Tweets",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1683. Invalid Tweets"
    },
    {
      "id": 1684,
      "title": "Count the Number of Consistent Strings",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/easy/1684. Count the Number of Consistent Strings"
    },
    {
      "id": 1689,
      "title": "Partitioning Into Minimum Number Of Deci-Binary Numbers",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "String"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1689. Partitioning Into Minimum Number Of Deci-Binary Numbers"
    },
    {
      "id": 1693,
      "title": "Daily Leads and Partners",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1693. Daily Leads and Partners"
    },
    {
      "id": 1704,
      "title": "Determine if String Halves Are Alike",
      "difficulty": "easy",
      "tags": [
        "String",
        "Counting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1704. Determine if String Halves Are Alike"
    },
    {
      "id": 1721,
      "title": "Swapping Nodes in a Linked List",
      "difficulty": "medium",
      "tags": [
        "Linked List",
        "Two Pointers"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1721. Swapping Nodes in a Linked List"
    },
    {
      "id": 1729,
      "title": "Find Followers Count",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1729. Find Followers Count"
    },
    {
      "id": 1731,
      "title": "The Number of Employees Which Report to Each Employee",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1731. The Number of Employees Which Report to Each Employee"
    },
    {
      "id": 1732,
      "title": "Find the Highest Altitude",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1732. Find the Highest Altitude"
    },
    {
      "id": 1742,
      "title": "Maximum Number of Balls in a Box",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "Math",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1742. Maximum Number of Balls in a Box"
    },
    {
      "id": 1743,
      "title": "Restore the Array From Adjacent Pairs",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/1743. Restore the Array From Adjacent Pairs"
    },
    {
      "id": 1752,
      "title": "Check if Array Is Sorted and Rotated",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/1752. Check if Array Is Sorted and Rotated"
    },
    {
      "id": 1757,
      "title": "Recyclable and Low Fat Products",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/easy/1757. Recyclable and Low Fat Products"
    },
    {
      "id": 1759,
      "title": "Count Number of Homogenous Substrings",
      "difficulty": "medium",
      "tags": [
        "Math",
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1759. Count Number of Homogenous Substrings"
    },
    {
      "id": 1790,
      "title": "Check if One String Swap Can Make Strings Equal",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1790. Check if One String Swap Can Make Strings Equal"
    },
    {
      "id": 1795,
      "title": "Rearrange Products Table",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1795. Rearrange Products Table"
    },
    {
      "id": 1796,
      "title": "Second Largest Digit in a String",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1796. Second Largest Digit in a String"
    },
    {
      "id": 1799,
      "title": "Maximize Score After N Operations",
      "difficulty": "hard",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Math",
        "Dynamic Programming",
        "Backtracking",
        "Bitmask",
        "Number Theory"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/1799. Maximize Score After N Operations"
    },
    {
      "id": 1800,
      "title": "Maximum Ascending Subarray Sum",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1800. Maximum Ascending Subarray Sum"
    },
    {
      "id": 1802,
      "title": "Maximum Value at a Given Index in a Bounded Array",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Math",
        "Binary Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1802. Maximum Value at a Given Index in a Bounded Array"
    },
    {
      "id": 1813,
      "title": "Sentence Similarity III",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1813. Sentence Similarity III"
    },
    {
      "id": 1822,
      "title": "Sign of the Product of an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/easy/1822. Sign of the Product of an Array"
    },
    {
      "id": 1823,
      "title": "Find the Winner of the Circular Game",
      "difficulty": "medium",
      "tags": [
        "Recursion",
        "Queue",
        "Array",
        "Math",
        "Simulation"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1823. Find the Winner of the Circular Game"
    },
    {
      "id": 1827,
      "title": "Minimum Operations to Make the Array Increasing",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1827. Minimum Operations to Make the Array Increasing"
    },
    {
      "id": 1832,
      "title": "Check if the Sentence Is Pangram",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/easy/1832. Check if the Sentence Is Pangram"
    },
    {
      "id": 1845,
      "title": "Seat Reservation Manager",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1845. Seat Reservation Manager"
    },
    {
      "id": 1846,
      "title": "Maximum Element After Decreasing and Rearranging",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1846. Maximum Element After Decreasing and Rearranging"
    },
    {
      "id": 1855,
      "title": "Maximum Distance Between a Pair of Values",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1855. Maximum Distance Between a Pair of Values"
    },
    {
      "id": 1870,
      "title": "Minimum Speed to Arrive on Time",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/1870. Minimum Speed to Arrive on Time"
    },
    {
      "id": 1873,
      "title": "Calculate Special Bonus",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "Python",
        "SQL"
      ],
      "path": "leetcode/easy/1873. Calculate Special Bonus"
    },
    {
      "id": 1876,
      "title": "Substrings of Size Three with Distinct Characters",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting",
        "Sliding Window"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1876. Substrings of Size Three with Distinct Characters"
    },
    {
      "id": 1886,
      "title": "Determine Whether Matrix Can Be Obtained By Rotation",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Matrix"
      ],
      "languages": [
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/1886. Determine Whether Matrix Can Be Obtained By Rotation"
    },
    {
      "id": 1890,
      "title": "The Latest Login in 2020",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1890. The Latest Login in 2020"
    },
    {
      "id": 1905,
      "title": "Count Sub Islands",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1905. Count Sub Islands"
    },
    {
      "id": 1913,
      "title": "Maximum Product Difference Between Two Pairs",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/1913. Maximum Product Difference Between Two Pairs"
    },
    {
      "id": 1915,
      "title": "Number of Wonderful Substrings",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Hash Table",
        "String",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1915. Number of Wonderful Substrings"
    },
    {
      "id": 1922,
      "title": "Count Good Numbers",
      "difficulty": "medium",
      "tags": [
        "Recursion",
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1922. Count Good Numbers"
    },
    {
      "id": 1927,
      "title": "Sum Game",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Math",
        "String",
        "Game Theory"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/1927. Sum Game"
    },
    {
      "id": 1929,
      "title": "Concatenation of Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Simulation"
      ],
      "languages": [
        "Rust",
        "Scala"
      ],
      "path": "leetcode/easy/1929. Concatenation of Array"
    },
    {
      "id": 1930,
      "title": "Unique Length-3 Palindromic Subsequences",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Hash Table",
        "String",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/1930. Unique Length-3 Palindromic Subsequences"
    },
    {
      "id": 1941,
      "title": "Check if All Characters Have Equal Number of Occurrences",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1941. Check if All Characters Have Equal Number of Occurrences"
    },
    {
      "id": 1942,
      "title": "The Number of the Smallest Unoccupied Chair",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1942. The Number of the Smallest Unoccupied Chair"
    },
    {
      "id": 1964,
      "title": "Find the Longest Valid Obstacle Course at Each Position",
      "difficulty": "hard",
      "tags": [
        "Binary Indexed Tree",
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/1964. Find the Longest Valid Obstacle Course at Each Position"
    },
    {
      "id": 1965,
      "title": "Employees With Missing Information",
      "difficulty": "easy",
      "tags": [
        "Database"
      ],
      "languages": [
        "SQL"
      ],
      "path": "leetcode/easy/1965. Employees With Missing Information"
    },
    {
      "id": 1971,
      "title": "Find if Path Exists in Graph",
      "difficulty": "easy",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "Swift",
        "TypeScript"
      ],
      "path": "leetcode/easy/1971. Find if Path Exists in Graph"
    },
    {
      "id": 1975,
      "title": "Maximum Matrix Sum",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1975. Maximum Matrix Sum"
    },
    {
      "id": 1979,
      "title": "Find Greatest Common Divisor of Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math",
        "Number Theory"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/1979. Find Greatest Common Divisor of Array"
    },
    {
      "id": 1980,
      "title": "Find Unique Binary String",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Backtracking"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/1980. Find Unique Binary String"
    },
    {
      "id": 1996,
      "title": "The Number of Weak Characters in the Game",
      "difficulty": "medium",
      "tags": [
        "Stack",
        "Greedy",
        "Array",
        "Sorting",
        "Monotonic Stack"
      ],
      "languages": [
        "TypeScript"
      ],
      "path": "leetcode/medium/1996. The Number of Weak Characters in the Game"
    },
    {
      "id": 2006,
      "title": "Count Number of Pairs With Absolute Difference K",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2006. Count Number of Pairs With Absolute Difference K"
    },
    {
      "id": 2011,
      "title": "Final Value of Variable After Performing Operations",
      "difficulty": "easy",
      "tags": [
        "Array",
        "String",
        "Simulation"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/2011. Final Value of Variable After Performing Operations"
    },
    {
      "id": 2032,
      "title": "Two Out of Three",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2032. Two Out of Three"
    },
    {
      "id": 2038,
      "title": "Remove Colored Pieces if Both Neighbors are the Same Color",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Math",
        "String",
        "Game Theory"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/2038. Remove Colored Pieces if Both Neighbors are the Same Color"
    },
    {
      "id": 2044,
      "title": "Count Number of Maximum Bitwise-OR Subsets",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Backtracking",
        "Enumeration"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2044. Count Number of Maximum Bitwise-OR Subsets"
    },
    {
      "id": 2053,
      "title": "Kth Distinct String in an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2053. Kth Distinct String in an Array"
    },
    {
      "id": 2054,
      "title": "Two Best Non-Overlapping Events",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search",
        "Dynamic Programming",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2054. Two Best Non-Overlapping Events"
    },
    {
      "id": 2062,
      "title": "Count Vowel Substrings of a String",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2062. Count Vowel Substrings of a String"
    },
    {
      "id": 2064,
      "title": "Minimized Maximum of Products Distributed to Any Store",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2064. Minimized Maximum of Products Distributed to Any Store"
    },
    {
      "id": 2075,
      "title": "Decode the Slanted Ciphertext",
      "difficulty": "medium",
      "tags": [
        "String",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2075. Decode the Slanted Ciphertext"
    },
    {
      "id": 2085,
      "title": "Count Common Words With One Occurrence",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2085. Count Common Words With One Occurrence"
    },
    {
      "id": 2089,
      "title": "Find Target Indices After Sorting Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2089. Find Target Indices After Sorting Array"
    },
    {
      "id": 2090,
      "title": "K Radius Subarray Averages",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Sliding Window"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2090. K Radius Subarray Averages"
    },
    {
      "id": 2096,
      "title": "Step-By-Step Directions From a Binary Tree Node to Another",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "String",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2096. Step-By-Step Directions From a Binary Tree Node to Another"
    },
    {
      "id": 2099,
      "title": "Find Subsequence of Length K With the Largest Sum",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Sorting",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2099. Find Subsequence of Length K With the Largest Sum"
    },
    {
      "id": 2103,
      "title": "Rings and Rods",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2103. Rings and Rods"
    },
    {
      "id": 2114,
      "title": "Maximum Number of Words Found in Sentences",
      "difficulty": "easy",
      "tags": [
        "Array",
        "String"
      ],
      "languages": [
        "Java",
        "Rust"
      ],
      "path": "leetcode/easy/2114. Maximum Number of Words Found in Sentences"
    },
    {
      "id": 2125,
      "title": "Number of Laser Beams in a Bank",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math",
        "String",
        "Matrix"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/2125. Number of Laser Beams in a Bank"
    },
    {
      "id": 2140,
      "title": "Solving Questions With Brainpower",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/2140. Solving Questions With Brainpower"
    },
    {
      "id": 2160,
      "title": "Minimum Sum of Four Digit Number After Splitting Digits",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Math",
        "Sorting"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/easy/2160. Minimum Sum of Four Digit Number After Splitting Digits"
    },
    {
      "id": 2176,
      "title": "Count Equal and Divisible Pairs in an Array",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/2176. Count Equal and Divisible Pairs in an Array"
    },
    {
      "id": 2179,
      "title": "Count Good Triplets in an Array",
      "difficulty": "hard",
      "tags": [
        "Binary Indexed Tree",
        "Segment Tree",
        "Array",
        "Binary Search",
        "Divide and Conquer",
        "Ordered Set",
        "Merge Sort"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/2179. Count Good Triplets in an Array"
    },
    {
      "id": 2187,
      "title": "Minimum Time to Complete Trips",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Binary Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2187. Minimum Time to Complete Trips"
    },
    {
      "id": 2196,
      "title": "Create Binary Tree From Descriptions",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Array",
        "Hash Table",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/medium/2196. Create Binary Tree From Descriptions"
    },
    {
      "id": 2206,
      "title": "Divide Array Into Equal Pairs",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array",
        "Hash Table",
        "Counting"
      ],
      "languages": [
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/2206. Divide Array Into Equal Pairs"
    },
    {
      "id": 2215,
      "title": "Find the Difference of Two Arrays",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2215. Find the Difference of Two Arrays"
    },
    {
      "id": 2221,
      "title": "Find Triangular Sum of an Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math",
        "Combinatorics",
        "Number Theory",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2221. Find Triangular Sum of an Array"
    },
    {
      "id": 2225,
      "title": "Find Players With Zero or One Losses",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Counting",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2225. Find Players With Zero or One Losses"
    },
    {
      "id": 2256,
      "title": "Minimum Average Difference",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "C",
        "Go"
      ],
      "path": "leetcode/medium/2256. Minimum Average Difference"
    },
    {
      "id": 2265,
      "title": "Count Nodes Equal to Average of Subtree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust"
      ],
      "path": "leetcode/medium/2265. Count Nodes Equal to Average of Subtree"
    },
    {
      "id": 2270,
      "title": "Number of Ways to Split Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2270. Number of Ways to Split Array"
    },
    {
      "id": 2273,
      "title": "Find Resultant Array After Removing Anagrams",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2273. Find Resultant Array After Removing Anagrams"
    },
    {
      "id": 2283,
      "title": "Check if Number Has Equal Digit Count and Digit Value",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2283. Check if Number Has Equal Digit Count and Digit Value"
    },
    {
      "id": 2300,
      "title": "Successful Pairs of Spells and Potions",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Binary Search",
        "Sorting"
      ],
      "languages": [
        "Elixir",
        "Go"
      ],
      "path": "leetcode/medium/2300. Successful Pairs of Spells and Potions"
    },
    {
      "id": 2309,
      "title": "Greatest English Letter in Upper and Lower Case",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Enumeration"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2309. Greatest English Letter in Upper and Lower Case"
    },
    {
      "id": 2316,
      "title": "Count Unreachable Pairs of Nodes in an Undirected Graph",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2316. Count Unreachable Pairs of Nodes in an Undirected Graph"
    },
    {
      "id": 2325,
      "title": "Decode the Message",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2325. Decode the Message"
    },
    {
      "id": 2328,
      "title": "Number of Increasing Paths in a Grid",
      "difficulty": "hard",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Graph",
        "Topological Sort",
        "Memoization",
        "Array",
        "Dynamic Programming",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/2328. Number of Increasing Paths in a Grid"
    },
    {
      "id": 2331,
      "title": "Evaluate Boolean Binary Tree",
      "difficulty": "easy",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2331. Evaluate Boolean Binary Tree"
    },
    {
      "id": 2341,
      "title": "Maximum Number of Pairs in Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2341. Maximum Number of Pairs in Array"
    },
    {
      "id": 2348,
      "title": "Number of Zero-Filled Subarrays",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2348. Number of Zero-Filled Subarrays"
    },
    {
      "id": 2351,
      "title": "First Letter to Appear Twice",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2351. First Letter to Appear Twice"
    },
    {
      "id": 2352,
      "title": "Equal Row and Column Pairs",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Matrix",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2352. Equal Row and Column Pairs"
    },
    {
      "id": 2363,
      "title": "Merge Similar Items",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Ordered Set",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2363. Merge Similar Items"
    },
    {
      "id": 2366,
      "title": "Minimum Replacements to Sort the Array",
      "difficulty": "hard",
      "tags": [
        "Greedy",
        "Array",
        "Math"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/hard/2366. Minimum Replacements to Sort the Array"
    },
    {
      "id": 2367,
      "title": "Number of Arithmetic Triplets",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Enumeration"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2367. Number of Arithmetic Triplets"
    },
    {
      "id": 2369,
      "title": "Check if There is a Valid Partition For The Array",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Dynamic Programming"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/2369. Check if There is a Valid Partition For The Array"
    },
    {
      "id": 2389,
      "title": "Longest Subsequence With Limited Sum",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array",
        "Binary Search",
        "Prefix Sum",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2389. Longest Subsequence With Limited Sum"
    },
    {
      "id": 2391,
      "title": "Minimum Amount of Time to Collect Garbage",
      "difficulty": "medium",
      "tags": [
        "Array",
        "String",
        "Prefix Sum"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2391. Minimum Amount of Time to Collect Garbage"
    },
    {
      "id": 2415,
      "title": "Reverse Odd Levels of Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Tree"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2415. Reverse Odd Levels of Binary Tree"
    },
    {
      "id": 2418,
      "title": "Sort the People",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "String",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2418. Sort the People"
    },
    {
      "id": 2429,
      "title": "Minimize XOR",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Bit Manipulation"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2429. Minimize XOR"
    },
    {
      "id": 2462,
      "title": "Total Cost to Hire K Workers",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Two Pointers",
        "Simulation",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Python"
      ],
      "path": "leetcode/medium/2462. Total Cost to Hire K Workers"
    },
    {
      "id": 2466,
      "title": "Count Ways To Build Good Strings",
      "difficulty": "medium",
      "tags": [
        "Dynamic Programming"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2466. Count Ways To Build Good Strings"
    },
    {
      "id": 2469,
      "title": "Convert the Temperature",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2469. Convert the Temperature"
    },
    {
      "id": 2483,
      "title": "Minimum Penalty for a Shop",
      "difficulty": "medium",
      "tags": [
        "String",
        "Prefix Sum"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2483. Minimum Penalty for a Shop"
    },
    {
      "id": 2486,
      "title": "Append Characters to String to Make Subsequence",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Two Pointers",
        "String"
      ],
      "languages": [
        "Elixir",
        "Go",
        "Python",
        "Rust",
        "Scala",
        "TypeScript",
        "Zig"
      ],
      "path": "leetcode/medium/2486. Append Characters to String to Make Subsequence"
    },
    {
      "id": 2492,
      "title": "Minimum Score of a Path Between Two Cities",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Graph"
      ],
      "languages": [
        "Go",
        "TypeScript"
      ],
      "path": "leetcode/medium/2492. Minimum Score of a Path Between Two Cities"
    },
    {
      "id": 2530,
      "title": "Maximal Score After Applying K Operations",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2530. Maximal Score After Applying K Operations"
    },
    {
      "id": 2537,
      "title": "Count the Number of Good Subarrays",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Sliding Window"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2537. Count the Number of Good Subarrays"
    },
    {
      "id": 2540,
      "title": "Minimum Common Value",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Binary Search"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2540. Minimum Common Value"
    },
    {
      "id": 2578,
      "title": "Split With Minimum Sum",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Math",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2578. Split With Minimum Sum"
    },
    {
      "id": 2582,
      "title": "Pass the Pillow",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Simulation"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2582. Pass the Pillow"
    },
    {
      "id": 2583,
      "title": "Kth Largest Sum in a Binary Tree",
      "difficulty": "medium",
      "tags": [
        "Tree",
        "Breadth-First Search",
        "Binary Tree",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2583. Kth Largest Sum in a Binary Tree"
    },
    {
      "id": 2610,
      "title": "Convert an Array Into a 2D Array With Conditions",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Dart",
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2610. Convert an Array Into a 2D Array With Conditions"
    },
    {
      "id": 2616,
      "title": "Minimize the Maximum Difference of Pairs",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Binary Search",
        "Dynamic Programming",
        "Sorting"
      ],
      "languages": [
        "Rust"
      ],
      "path": "leetcode/medium/2616. Minimize the Maximum Difference of Pairs"
    },
    {
      "id": 2642,
      "title": "Design Graph With Shortest Path Calculator",
      "difficulty": "hard",
      "tags": [
        "Graph",
        "Design",
        "Shortest Path",
        "Heap (Priority Queue)"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/hard/2642. Design Graph With Shortest Path Calculator"
    },
    {
      "id": 2656,
      "title": "Maximum Sum With Exactly K Elements",
      "difficulty": "easy",
      "tags": [
        "Greedy",
        "Array"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/2656. Maximum Sum With Exactly K Elements"
    },
    {
      "id": 2658,
      "title": "Maximum Number of Fish in a Grid",
      "difficulty": "medium",
      "tags": [
        "Depth-First Search",
        "Breadth-First Search",
        "Union Find",
        "Array",
        "Matrix"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2658. Maximum Number of Fish in a Grid"
    },
    {
      "id": 2661,
      "title": "First Completely Painted Row or Column",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Matrix"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2661. First Completely Painted Row or Column"
    },
    {
      "id": 2678,
      "title": "Number of Senior Citizens",
      "difficulty": "easy",
      "tags": [
        "Array",
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/2678. Number of Senior Citizens"
    },
    {
      "id": 2683,
      "title": "Neighboring Bitwise XOR",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2683. Neighboring Bitwise XOR"
    },
    {
      "id": 2696,
      "title": "Minimum String Length After Removing Substrings",
      "difficulty": "easy",
      "tags": [
        "Stack",
        "String",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/2696. Minimum String Length After Removing Substrings"
    },
    {
      "id": 2780,
      "title": "Minimum Index of a Valid Split",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Hash Table",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2780. Minimum Index of a Valid Split"
    },
    {
      "id": 2785,
      "title": "Sort Vowels in a String",
      "difficulty": "medium",
      "tags": [
        "String",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2785. Sort Vowels in a String"
    },
    {
      "id": 2815,
      "title": "Max Pair Sum in an Array",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Hash Table"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2815. Max Pair Sum in an Array"
    },
    {
      "id": 2843,
      "title": "Count Symmetric Integers",
      "difficulty": "easy",
      "tags": [
        "Math",
        "Enumeration"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/easy/2843. Count Symmetric Integers"
    },
    {
      "id": 2849,
      "title": "Determine if a Cell Is Reachable at a Given Time",
      "difficulty": "medium",
      "tags": [
        "Math"
      ],
      "languages": [
        "Elixir",
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2849. Determine if a Cell Is Reachable at a Given Time"
    },
    {
      "id": 2870,
      "title": "Minimum Number of Operations to Make Array Empty",
      "difficulty": "medium",
      "tags": [
        "Greedy",
        "Array",
        "Hash Table",
        "Counting"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/medium/2870. Minimum Number of Operations to Make Array Empty"
    },
    {
      "id": 2873,
      "title": "Maximum Value of an Ordered Triplet I",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/2873. Maximum Value of an Ordered Triplet I"
    },
    {
      "id": 2874,
      "title": "Maximum Value of an Ordered Triplet II",
      "difficulty": "medium",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/2874. Maximum Value of an Ordered Triplet II"
    },
    {
      "id": 2914,
      "title": "Minimum Number of Changes to Make Binary String Beautiful",
      "difficulty": "medium",
      "tags": [
        "String"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/2914. Minimum Number of Changes to Make Binary String Beautiful"
    },
    {
      "id": 2976,
      "title": "Minimum Cost to Convert String I",
      "difficulty": "medium",
      "tags": [
        "Graph",
        "Array",
        "String",
        "Shortest Path"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/2976. Minimum Cost to Convert String I"
    },
    {
      "id": 3047,
      "title": "Find the Largest Area of Square Inside Two Rectangles",
      "difficulty": "medium",
      "tags": [
        "Geometry",
        "Array",
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/3047. Find the Largest Area of Square Inside Two Rectangles"
    },
    {
      "id": 3105,
      "title": "Longest Strictly Increasing or Strictly Decreasing Subarray",
      "difficulty": "easy",
      "tags": [
        "Array"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/3105. Longest Strictly Increasing or Strictly Decreasing Subarray"
    },
    {
      "id": 3163,
      "title": "String Compression III",
      "difficulty": "medium",
      "tags": [
        "String"
      ],
      "languages": [
        "Go",
        "Rust"
      ],
      "path": "leetcode/medium/3163. String Compression III"
    },
    {
      "id": 3169,
      "title": "Count Days Without Meetings",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/3169. Count Days Without Meetings"
    },
    {
      "id": 3314,
      "title": "Construct the Minimum Bitwise Array I",
      "difficulty": "easy",
      "tags": [
        "Bit Manipulation",
        "Array"
      ],
      "languages": [
        "Go",
        "Kotlin",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/3314. Construct the Minimum Bitwise Array I"
    },
    {
      "id": 3315,
      "title": "Construct the Minimum Bitwise Array II",
      "difficulty": "medium",
      "tags": [
        "Bit Manipulation",
        "Array"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/medium/3315. Construct the Minimum Bitwise Array II"
    },
    {
      "id": 3394,
      "title": "Check if Grid can be Cut into Sections",
      "difficulty": "medium",
      "tags": [
        "Array",
        "Sorting"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/3394. Check if Grid can be Cut into Sections"
    },
    {
      "id": 3483,
      "title": "Unique 3-Digit Even Numbers",
      "difficulty": "easy",
      "tags": [
        "Recursion",
        "Array",
        "Hash Table",
        "Enumeration"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/3483. Unique 3-Digit Even Numbers"
    },
    {
      "id": 3498,
      "title": "Reverse Degree of a String",
      "difficulty": "easy",
      "tags": [
        "String",
        "Simulation"
      ],
      "languages": [
        "Go",
        "Python",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/3498. Reverse Degree of a String"
    },
    {
      "id": 3508,
      "title": "Implement Router",
      "difficulty": "medium",
      "tags": [
        "Design",
        "Queue",
        "Array",
        "Hash Table",
        "Binary Search",
        "Ordered Set"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/3508. Implement Router"
    },
    {
      "id": 3541,
      "title": "Find Most Frequent Vowel and Consonant",
      "difficulty": "easy",
      "tags": [
        "Hash Table",
        "String",
        "Counting"
      ],
      "languages": [
        "Go",
        "Rust",
        "TypeScript"
      ],
      "path": "leetcode/easy/3541. Find Most Frequent Vowel and Consonant"
    },
    {
      "id": 3550,
      "title": "Smallest Index With Digit Sum Equal to Index",
      "difficulty": "easy",
      "tags": [
        "Array",
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/easy/3550. Smallest Index With Digit Sum Equal to Index"
    },
    {
      "id": 3622,
      "title": "Check Divisibility by Digit Sum and Product",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "C",
        "Go",
        "Python"
      ],
      "path": "leetcode/easy/3622. Check Divisibility by Digit Sum and Product"
    },
    {
      "id": 3623,
      "title": "Count Number of Trapezoids I",
      "difficulty": "medium",
      "tags": [
        "Geometry",
        "Array",
        "Hash Table",
        "Math"
      ],
      "languages": [
        "Go"
      ],
      "path": "leetcode/medium/3623. Count Number of Trapezoids I"
    },
    {
      "id": 3783,
      "title": "Mirror Distance of an Integer",
      "difficulty": "easy",
      "tags": [
        "Math"
      ],
      "languages": [
        "Go",
        "Python",
        "TypeScript"
      ],
      "path": "leetcode/easy/3783. Mirror Distance of an Integer"
    }
  ],
  "counts": {
    "topics": 2,
    "notes": 25,
    "solvedProblems": 628,
    "languages": [
      "C",
      "C++",
      "Dart",
      "Elixir",
      "Go",
      "Java",
      "JavaScript",
      "Kotlin",
      "Python",
      "Rust",
      "Scala",
      "Shell",
      "SQL",
      "Swift",
      "TypeScript",
      "Zig"
    ]
  }
} as const satisfies RepositorySnapshot
