use std::collections::VecDeque;

impl Solution {
    pub fn max_probability(
        n: i32,
        edges: Vec<Vec<i32>>,
        succ_prob: Vec<f64>,
        start: i32,
        end: i32,
    ) -> f64 {
        let mut adj = vec![vec![]; n as usize];
        for (edge, p) in edges.into_iter().zip(succ_prob.into_iter()) {
            adj[edge[0] as usize].push((edge[1] as usize, p));
            adj[edge[1] as usize].push((edge[0] as usize, p));
        }

        let mut probs = vec![0.; n as usize];

        let mut queue = VecDeque::new();
        queue.push_back((start as usize, 1.));

        probs[start as usize] = 1.;

        while let Some((i, p)) = queue.pop_front() {
            if p < probs[i] {
                continue;
            }

            for &(j, prob) in &adj[i] {
                if p * prob > probs[j] {
                    queue.push_back((j, p * prob));
                    probs[j] = p * prob;
                }
            }
        }

        probs[end as usize]
    }
}
