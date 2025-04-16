impl Solution {
    pub fn find_words(words: Vec<String>) -> Vec<String> {
        let mut letters: HashMap<char, i32> = HashMap::new();

        for c in "qwertyuiop".to_string().chars() {
            letters.insert(c, 1);
        }

        for c in "asdfghjkl".to_string().chars() {
            letters.insert(c, 2);
        }

        for c in "zxcvbnm".to_string().chars() {
            letters.insert(c, 3);
        }

        words
            .into_iter()
            .filter(|word| {
                let lowercased_word = word.to_lowercase();
                let mut chars = lowercased_word.chars();

                if let Some(first_char) = chars.next() {
                    let row = letters.get(&first_char).unwrap_or(&0);
                    chars.all(|c| letters.get(&c).unwrap_or(&0) == row)
                } else {
                    false
                }
            })
            .collect()
    }
}

