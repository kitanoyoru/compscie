package main

import "container/heap"

type Edge struct {
	to   int
	cost int
}

type PriorityQueue []*Edge

func (pq PriorityQueue) Len() int { return len(pq) }

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].cost < pq[j].cost
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}

func (pq *PriorityQueue) Push(x interface{}) {
	node := x.(*Edge)
	*pq = append(*pq, node)
}

func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	node := old[n-1]
	*pq = old[0 : n-1]
	return node
}

type Graph struct {
	nodes int
	adj   map[int][]Edge
}

func Constructor(n int, edges [][]int) Graph {
	g := Graph{
		nodes: n,
		adj:   make(map[int][]Edge),
	}

	for _, edge := range edges {
		g.adj[edge[0]] = append(g.adj[edge[0]], Edge{
			to:   edge[1],
			cost: edge[2],
		})
	}

	return g
}

func (this *Graph) AddEdge(edge []int) {
	this.adj[edge[0]] = append(this.adj[edge[0]], Edge{
		to:   edge[1],
		cost: edge[2],
	})
}

func (this *Graph) ShortestPath(node1 int, node2 int) int {
	distances := make([]int, this.nodes)

	for i := range distances {
		distances[i] = int(^uint(0) >> 1)
	}
	distances[node1] = 0

	pq := make(PriorityQueue, 0)
	heap.Init(&pq)
	heap.Push(&pq, &Edge{to: node1, cost: 0})

	for pq.Len() > 0 {
		current := heap.Pop(&pq).(*Edge)

		from := current.to
		fromWeight := current.cost

		if fromWeight > distances[from] {
			continue
		}
		if from == node2 {
			break
		}

		for _, edge := range this.adj[from] {
			to := edge.to
			toWeight := edge.cost

			distance := toWeight + distances[from]

			if distance < distances[to] {
				distances[to] = distance
				heap.Push(&pq, &Edge{to: to, cost: distance})
			}
		}
	}

	if distances[node2] == int(^uint(0)>>1) {
		return -1
	}

	return distances[node2]
}
