impl Solution {
    pub fn kids_with_candies(candies: Vec<i32>, extra_candies: i32) -> Vec<bool> {
        let max_candy = *candies.iter().max().unwrap();
        candies.into_iter().map(|x| if x + extra_candies >= max_candy { true } else { false }).collect()
    }
}