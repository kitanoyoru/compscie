package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

type Queue struct {
	arr []*TreeNode
}

func NewQueue() *Queue {
	return &Queue{}
}

func (q *Queue) push(item *TreeNode) {
	q.arr = append(q.arr, item)
}

func (q *Queue) pop() *TreeNode {
	item := q.arr[0]
	q.arr = q.arr[1:]
	return item
}

func levelOrderBottom(root *TreeNode) [][]int {
	ans := [][]int{}
	q := NewQueue()

	if root == nil {
		return ans
	}

	q.push(root)

	for {
		size := len(q.arr)
		if size == 0 {
			break
		}

		tempArr := []int{}
		for size > 0 {
			tempNode := q.pop()
			tempArr = append(tempArr, tempNode.Val)

			if tempNode.Left != nil {
				q.push(tempNode.Left)
			}
			if tempNode.Right != nil {
				q.push(tempNode.Right)
			}

			size--
		}

		ans = append(ans, tempArr)
	}

	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}

	return ans
}
