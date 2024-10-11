fn string_to_array(s: &str) -> Vec<String> {
    s.split_whitespace()
        .map(|word| word.to_string())
        .collect::<Vec<String>>()
}

