impl Solution {
    fn can_eat(k: i32, piles: &[i32], h: i32) -> bool {
        let mut act_h = 0;

        for &pile in piles {
            act_h += (pile + k - 1) / k
        }

        act_h <= h
    }

    pub fn min_eating_speed(piles: Vec<i32>, h: i32) -> i32 {
        let mut left = 1;
        let mut right = *piles.iter().max().unwrap();

        while left < right {
            let mid = left + (right - left) / 2;
            if Solution::can_eat(mid, &piles, h) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        left
    }
}
