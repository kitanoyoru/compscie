impl Solution {
    pub fn compressed_string(word: String) -> String {
        let mut result = String::new();
        let mut i = 0;

        while i < word.len() {
            let char_byte = word.as_bytes()[i];
            let mut counter = 0;

            while i < word.len() && word.as_bytes()[i] == char_byte && counter < 9 {
                counter += 1;
                i += 1;
            }

            result.push_str(&format!("{}{}", counter, char_byte as char));
        }

        result
    }
}
