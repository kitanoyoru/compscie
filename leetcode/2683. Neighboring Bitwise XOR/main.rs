impl Solution {
    pub fn does_valid_array_exist(derived: Vec<i32>) -> bool {
        let mut original = vec![0; derived.len() + 1];

        original[0] = 0;
        for i in 0..derived.len() {
            original[i + 1] = derived[i] ^ original[i];
        }

        let check_for_zero = (original[0] == original[original.len() - 1]);

        original[0] = 1;
        for i in 0..derived.len() {
            original[i + 1] = derived[i] ^ original[i];
        }

        let check_for_one = (original[0] == original[original.len() - 1]);

        check_for_zero || check_for_one
    }
}
