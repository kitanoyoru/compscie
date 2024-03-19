impl Solution {
    pub fn least_interval(tasks: Vec<char>, n: i32) -> i32 {
        let mut freq: Vec<i32> = vec![0; 26];
        for &task in &tasks {
            freq[(task as u8 - b'A') as usize] += 1;
        }
        freq.sort();

        let chunk = freq[25] - 1;
        let mut idle = chunk * n;

        for i in (0..25).rev() {
            idle -= std::cmp::min(chunk, freq[i]);
        }

        if idle < 0 {
            tasks.len() as i32
        } else {
            tasks.len() as i32 + idle
        }
    }
}
