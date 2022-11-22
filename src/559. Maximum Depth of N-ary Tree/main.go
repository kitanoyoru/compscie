// Solved by @kitanoyoru

package main

type Node struct {
	Val      int
	Children []*Node
}

func dfs(node *Node, curLevel int, maxLevel *int) {
	if len(node.Children) == 0 {
		if curLevel > *maxLevel {
			*maxLevel = curLevel
		}
		return
	}
	for _, child := range node.Children {
		dfs(child, curLevel+1, maxLevel)
	}
}

func maxDepth(root *Node) int {
	if root == nil {
		return 0
	}
	maxLevel, curLevel := 1, 1
	dfs(root, curLevel, &maxLevel)
	return maxLevel
}
