impl Solution {
    pub fn maximum69_number(num: i32) -> i32 {
        let mut digits: Vec<char> = num.to_string().chars().collect();

        if !digits.contains(&'6') {
            return num;
        }
        let idx = digits.iter().position(|&x| x == '6').unwrap();
        digits[idx] = '9';

        let num_str: String = digits.iter().collect();
        let num: i32 = num_str.parse().unwrap();

        num
    }
}
