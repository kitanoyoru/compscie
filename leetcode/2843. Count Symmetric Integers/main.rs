impl Solution {
    pub fn count_symmetric_integers(low: i32, high: i32) -> i32 {
        let mut result = 0;

        for number in low..=high {
            let digits = Self::get_digits(number);
            if digits.len() % 2 == 1 {
                continue;
            }

            if Self::is_symmetric(&digits) {
                result += 1
            }
        }

        result
    }

    fn get_digits(mut number: i32) -> Vec<i32> {
        let mut digits = Vec::new();

        while number > 0 {
            digits.push(number % 10);
            number /= 10;
        }

        digits.reverse();

        digits
    }

    fn is_symmetric(digits: &[i32]) -> bool {
        let n = digits.len() / 2;

        let (first, second) = digits.split_at(n);

        let sum1: i32 = first.iter().sum();
        let sum2: i32 = second.iter().sum();

        sum1 == sum2
    }
}
