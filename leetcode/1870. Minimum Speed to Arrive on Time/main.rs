impl Solution {
    pub fn min_speed_on_time(dist: Vec<i32>, hour: f64) -> i32 {
        if (dist.len() - 1) as f64 >= hour {
            return -1;
        }

        let mut left = 1;
        let mut right = Solution::get_upper_bound(&dist, hour);

        while left < right {
            let mid = left + (right - left) / 2;
            if Solution::calc_time(&dist, mid as f64) > hour {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        left
    }

    fn get_upper_bound(dist: &Vec<i32>, hour: f64) -> i32 {
        let total_distance: f64 = dist.iter().fold(0.0, |sum, &x| sum + (x as f64));
        let total_time = hour + 1.0 - (dist.len() as f64);

        (total_distance as f64 / total_time).ceil() as i32
    }

    fn calc_time(dist: &Vec<i32>, speed: f64) -> f64 {
        dist.iter().fold(0.0, |mut sum, &x| {
            sum = sum.ceil();
            sum + (x as f64) / speed
        })
    }
}
