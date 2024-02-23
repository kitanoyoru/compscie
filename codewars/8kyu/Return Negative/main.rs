fn make_negative(n: i32) -> i32 {
    match n < 0 {
        true => n,
        false => -n,
    }
}
