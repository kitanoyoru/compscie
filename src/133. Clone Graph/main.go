package main

type Queue struct {
	values []*Node
}

func NewQueue() *Queue {
	return &Queue{
		values: []*Node{},
	}
}

func (q *Queue) put(value *Node) {
	q.values = append(q.values, value)
}

func (q *Queue) get() *Node {
	value := q.values[0]
	q.values = q.values[1:]
	return value
}

func (q *Queue) empty() bool {
	return len(q.values) == 0
}

type Node struct {
	Val       int
	Neighbors []*Node
}

func NewNode(val int, neighs []*Node) *Node {
	return &Node{
		Val:       val,
		Neighbors: neighs,
	}
}

func cloneGraph(node *Node) *Node {
	if node == nil {
		return node
	}

	q, clones := NewQueue(), make(map[int]*Node)

	q.put(node)
	clones[node.Val] = NewNode(node.Val, []*Node{})

	for !q.empty() {
		cur := q.get()
		cur_clone := clones[cur.Val]

		for _, neigh := range cur.Neighbors {
			if _, exists := clones[neigh.Val]; !exists {
				clones[neigh.Val] = NewNode(neigh.Val, []*Node{})
				q.put(neigh)
			}

			cur_clone.Neighbors = append(cur_clone.Neighbors, clones[neigh.Val])
		}
	}

	return clones[node.Val]
}
