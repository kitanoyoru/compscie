impl Solution {
    pub fn append_characters(s: String, t: String) -> i32 {
        let mut t = t.bytes().peekable();

        s.bytes().for_each(|c| {
            t.next_if_eq(&c);
        });

        t.len() as _
    }
}
