impl Solution {
    pub fn count_seniors(details: Vec<String>) -> i32 {
        let mut res = 0;

        for detail in details {
            if let Ok(age) = detail[11..13].parse::<i32>() {
                if age > 60 {
                    res += 1;
                }
            }
        }

        res
    }
}

