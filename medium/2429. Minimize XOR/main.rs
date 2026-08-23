impl Solution {
    pub fn minimize_xor(num1: i32, num2: i32) -> i32 {
        let mut result = num1;

        let target_ones = num2.count_ones() as i32;
        let mut set_ones = result.count_ones() as i32;

        let mut current_bit = 0;

        while set_ones < target_ones {
            if !Self::is_bit_set(result, current_bit) {
                result = Self::set_bit(result, current_bit);
                set_ones += 1;
            }

            current_bit += 1;
        }

        current_bit = 0;
        while set_ones > target_ones {
            if Self::is_bit_set(result, current_bit) {
                result = Self::unset_bit(result, current_bit);
                set_ones -= 1;
            }

            current_bit += 1;
        }

        result
    }

    fn is_bit_set(x: i32, bit: u32) -> bool {
        (x & (1 << bit)) != 0
    }

    fn set_bit(x: i32, bit: u32) -> i32 {
        x | (1 << bit)
    }

    fn unset_bit(x: i32, bit: u32) -> i32 {
        x & !(1 << bit)
    }
}

