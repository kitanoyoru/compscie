type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func NewTreeMode(l, r *TreeNode) *TreeNode {
	return &TreeNode{
		Left:  l,
		Right: r,
	}
}

func allPossibleFBT(n int) []*TreeNode {
	memo := make(map[int][]*TreeNode)

	var closure func(int) []*TreeNode
	closure = func(n int) []*TreeNode {
		if n&1 != 1 {
			return []*TreeNode{}
		}

		if _, has := memo[n]; !has {
			trees := []*TreeNode{}

			if n == 1 {
				trees = append(trees, &TreeNode{})
			} else {
				for i := 1; i < n; i += 2 {
					lNodes := closure(i)
					rNodes := closure(n - i - 1)

					for _, l := range lNodes {
						for _, r := range rNodes {
							trees = append(trees, NewTreeMode(l, r))
						}
					}
				}
			}

			memo[n] = trees
		}

		return memo[n]
	}

	return closure(n)
}
