use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn valid_path(n: i32, edges: Vec<Vec<i32>>, source: i32, destination: i32) -> bool {
        let mut graph: HashMap<i32, Vec<i32>> = HashMap::new();
        for edge in edges {
            let (u, v) = (edge[0], edge[1]);
            graph.entry(u).or_insert(vec![]).push(v);
            graph.entry(v).or_insert(vec![]).push(u);
        }

        Self::dfs(&graph, source, destination, &mut HashSet::new())
    }

    fn dfs(
        graph: &HashMap<i32, Vec<i32>>,
        current: i32,
        target: i32,
        visited: &mut HashSet<i32>,
    ) -> bool {
        if current == target {
            return true;
        }

        if visited.contains(&current) {
            return false;
        } else {
            visited.insert(current);
        }

        if let Some(neighbours) = graph.get(&current) {
            for &next in neighbours {
                if Self::dfs(graph, next, target, visited) {
                    return true;
                }
            }
        }

        false
    }
}
