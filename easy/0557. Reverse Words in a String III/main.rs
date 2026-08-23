use std::iter::FromIterator;

impl Solution {
    pub fn reverse_words(s: String) -> String {
        s.split(" ")
            .map(|word| String::from_iter(word.chars().rev()))
            .collect::<Vec<String>>()
            .join(" ")
    }
}
