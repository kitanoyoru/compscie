package main

import "strings"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func dfs(node *TreeNode, value int, sb *strings.Builder) bool {
	if node == nil {
		return false
	}

	if node.Val == value {
		return true
	}

	if node.Left != nil && dfs(node.Left, value, sb) {
		sb.WriteRune('L')
		return true
	} else if node.Right != nil && dfs(node.Right, value, sb) {
		sb.WriteRune('R')
		return true
	}
	return false
}

func getDirections(root *TreeNode, startValue int, destValue int) string {
	var (
		startSB strings.Builder
		endSB   strings.Builder
	)

	dfs(root, startValue, &startSB)
	dfs(root, destValue, &endSB)

	start, end := startSB.String(), endSB.String()

	i, maxI := 0, min(len(start), len(end))
	for i < maxI && start[len(start)-i-1] == end[len(end)-i-1] {
		i++
	}

	var resSB strings.Builder
	resSB.WriteString(strings.Repeat("U", len(start)-i))
	resSB.WriteString(reverse(end[:len(end)-i]))

	return resSB.String()
}

func reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

