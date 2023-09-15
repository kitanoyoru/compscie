use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

impl Solution {
    pub fn dist(p1: &[i32], p2: &[i32]) -> i32 {
        assert!(p1.len() == 2 && p2.len() == 2);

        (p1[0] - p2[0]).abs() + (p1[1] - p2[1]).abs()
    }

    pub fn min_cost_connect_points(points: Vec<Vec<i32>>) -> i32 {
        let n = points.len();

        let mut visited = vec![false; n];
        let mut heap_dict = HashMap::new();

        heap_dict.insert(0, 0);

        let mut min_heap = BinaryHeap::new();

        min_heap.push(Reverse((0, 0)));

        let mut mst_weight = 0;

        while let Some(Reverse((w, u))) = min_heap.pop() {
            if visited[u] || heap_dict[&u] < w {
                continue;
            }

            visited[u] = true;
            mst_weight += w;

            for v in 0..n {
                if !visited[v] {
                    let new_distance = Self::dist(&points[u], &points[v]);
                    if new_distance < *heap_dict.get(&v).unwrap_or(&i32::MAX) {
                        heap_dict.insert(v, new_distance);
                        min_heap.push(Reverse((new_distance, v)));
                    }
                }
            }
        }

        mst_weight
    }
}
