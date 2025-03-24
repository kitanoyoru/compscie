impl Solution {
    pub fn count_days(days: i32, mut meetings: Vec<Vec<i32>>) -> i32 {
        meetings.sort_by_key(|m| m[0]);

        let mut merged: Vec<Vec<i32>> = Vec::new();

        for meet in meetings {
            if let Some(last) = merged.last_mut() {
                if last[1] >= meet[0] {
                    last[1] = last[1].max(meet[1]);
                    continue;
                }
            }

            merged.push(meet)
        }

        let mut result = 0;
        for meet in &merged {
            result += meet[1] - meet[0] + 1
        }

        days - result
    }
}

