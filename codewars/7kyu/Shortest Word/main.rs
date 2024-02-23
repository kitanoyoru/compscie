fn find_short(s: &str) -> usize {
    let num = s.split_whitespace().map(str::len).min().unwrap();

    num as usize
}
