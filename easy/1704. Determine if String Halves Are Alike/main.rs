impl Solution {
    pub fn halves_are_alike(s: String) -> bool {
        assert!(s.len() % 2 == 0);

        let mid = s.len() / 2;
        let (first, second) = s.split_at(mid);

        Self::count_vowels(first) == Self::count_vowels(second)
    }

    fn count_vowels(s: &str) -> usize {
        let vowels: [char; 5] = ['a', 'e', 'i', 'o', 'u'];

        s.chars()
            .filter(|c| {
                vowels.contains(&c.to_ascii_lowercase()) || vowels.contains(&c.to_ascii_uppercase())
            })
            .count()
    }
}
