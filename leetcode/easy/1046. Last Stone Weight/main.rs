use std::collections::BinaryHeap;

impl Solution {
    pub fn last_stone_weight(stones: Vec<i32>) -> i32 {
        let mut pq = BinaryHeap::from(stones);

        loop {
            match pq.len() {
                0 => return 0,
                1 => return pq.pop().unwrap(),
                _ => {}
            }

            let x = pq.pop().unwrap();
            let y = pq.pop().unwrap();

            if x != y {
                pq.push(i32::abs(x - y));
            }
        }
    }
}