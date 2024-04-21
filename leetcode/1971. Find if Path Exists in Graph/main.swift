typealias Graph = [Int: [Int]]

class Solution {
    func validPath(_ n: Int, _ edges: [[Int]], _ source: Int, _ destination: Int) -> Bool {
        let graph = buildGraph(edges: edges)
        return hasPath(graph, source: source, destination: destination)
    }

    private func buildGraph(edges: [[Int]]) -> Graph {
        var graph: Graph = [:]
        
        for edge in edges {
            let node1 = edge[0], node2 = edge[1]
            graph[node1, default: []].append(node2)
            graph[node2, default: []].append(node1)
        }
        
        return graph
    }

    private func hasPath(_ graph: Graph, source: Int, destination: Int) -> Bool {
        var visited: Set<Int> = []
        return dfs(graph, current: source, target: destination, visited: &visited)
    }

    private func dfs(_ graph: Graph, current: Int, target: Int, visited: inout Set<Int>) -> Bool {
        if current == target { return true }
        if visited.contains(current) { return false }
        
        visited.insert(current)
        for neighbor in graph[current] ?? [] {
            if dfs(graph, current: neighbor, target: target, visited: &visited) {
                return true
            }
        }
        
        return false
    }
}

