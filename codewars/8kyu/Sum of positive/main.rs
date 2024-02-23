fn positive_sum(slice: &[i32]) -> i32 {
    slice.iter().filter(|&num| *num > 0).sum::<i32>()
}
