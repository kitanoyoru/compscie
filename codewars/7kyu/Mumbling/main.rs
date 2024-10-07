fn accum(s: &str) -> String {
    s.chars()
        .enumerate()
        .map(|(i, c)| {
            let mut segment = c.to_uppercase().to_string();
            segment.push_str(&c.to_lowercase().to_string().repeat(i));

            segment
        })
        .collect::<Vec<String>>()
        .join("-")
        .to_string()
}

