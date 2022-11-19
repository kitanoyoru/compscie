// Solved by @kitanoyoru

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

type FindElements struct {
	Root    *TreeNode
	HashMap map[int]bool
}

func (this *FindElements) recoverTree(node *TreeNode, num int) {
	if node == nil {
		return
	}
	this.recoverTree(node.Left, 2*num+1)
	node.Val = num
	this.HashMap[num] = true
	this.recoverTree(node.Right, 2*num+2)
}

func Constructor(root *TreeNode) FindElements {
	fe := FindElements{
		Root:    root,
		HashMap: make(map[int]bool),
	}

	fe.recoverTree(root, 0)

	return fe
}

func (this *FindElements) Find(target int) bool {
	return this.HashMap[target]
}

/**
 * Your FindElements object will be instantiated and called as such:
 * obj := Constructor(root);
 * param_1 := obj.Find(target);
 */
