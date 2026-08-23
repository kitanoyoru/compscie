impl Solution {
    pub fn is_reachable_at_time(sx: i32, sy: i32, fx: i32, fy: i32, t: i32) -> bool {
        let d = Self::find_chebyshev_dist(sx, sy, fx, fy);
        d > 0 && t >= d || d == 0 && t != 1
    }

    fn find_chebyshev_dist(sx: i32, sy: i32, fx: i32, fy: i32) -> i32 {
        ((sx - fx).abs()).max((sy - fy).abs())
    }
}
