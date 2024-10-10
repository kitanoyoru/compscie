fn descending_order(x: u64) -> u64 {
    let mut digits: Vec<char> = x.to_string().chars().collect();

    digits.sort_by(|a, b| b.cmp(a));

    let result: u64 = digits.iter().collect::<String>().parse().unwrap();

    result
}

