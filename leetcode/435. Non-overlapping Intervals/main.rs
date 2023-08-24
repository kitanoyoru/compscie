impl Solution {
    pub fn erase_overlap_intervals(mut intervals: Vec<Vec<i32>>) -> i32 {
        use std::cmp::*;

        intervals.sort_by(|a, b| match a[0].cmp(&b[0]) {
            Ordering::Equal => a[1].cmp(&b[1]),
            x => x,
        });

        let mut counter = 0;
        let mut prev = intervals[0][1];

        for interval in intervals[1..].iter() {
            match interval[0].cmp(&prev) {
                Ordering::Less => {
                    counter += 1;
                    prev = min(prev, interval[1])
                }
                _ => prev = interval[1],
            }
        }

        counter
    }
}
