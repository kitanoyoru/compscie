use std::cmp::min;
use std::i64;

impl Solution {
    pub fn minimum_cost(
        source: String,
        target: String,
        original: Vec<char>,
        changed: Vec<char>,
        cost: Vec<i32>,
    ) -> i64 {
        let mut graph = Self::build_graph(&original, &changed, &cost);
        Self::optimize_graph(&mut graph);
        Self::compute_total_cost(&source, &target, &graph)
    }

    fn build_graph(original: &[char], changed: &[char], cost: &[i32]) -> Vec<Vec<i64>> {
        let mut graph = vec![vec![i64::MAX; 26]; 26];
        for i in 0..26 {
            graph[i][i] = 0;
        }
        for (i, &o) in original.iter().enumerate() {
            let from = (o as usize) - ('a' as usize);
            let to = (changed[i] as usize) - ('a' as usize);
            graph[from][to] = min(graph[from][to], cost[i] as i64);
        }

        graph
    }

    fn optimize_graph(graph: &mut Vec<Vec<i64>>) {
        for k in 0..26 {
            for i in 0..26 {
                if graph[i][k] < i64::MAX {
                    for j in 0..26 {
                        if graph[k][j] < i64::MAX {
                            if graph[k][j] < i64::MAX {
                                graph[i][j] = min(graph[i][j], graph[i][k] + graph[k][j]);
                            }
                        }
                    }
                }
            }
        }
    }

    fn compute_total_cost(source: &str, target: &str, graph: &[Vec<i64>]) -> i64 {
        if source.len() != target.len() {
            return -1;
        }

        let mut total = 0;

        for (s, t) in source.chars().zip(target.chars()) {
            let source_char = (s as usize) - ('a' as usize);
            let target_char = (t as usize) - ('a' as usize);

            if source_char != target_char {
                if graph[source_char][target_char] == i64::MAX {
                    return -1;
                }

                total += graph[source_char][target_char];
            }
        }

        total
    }
}

