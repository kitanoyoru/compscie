// Solved by @kitanoyoru
// https://leetcode.com/problems/maximum-number-of-words-found-in-sentences/

impl Solution {
    pub fn most_words_found(sentences: Vec<String>) -> i32 {
        sentences.iter()
            .map(|x| x.split_whitespace().count())
            .max()
            .unwrap() as i32
    }

}

