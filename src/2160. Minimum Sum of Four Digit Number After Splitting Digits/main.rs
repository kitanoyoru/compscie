impl Solution {
    pub fn minimum_sum(mut num: i32) -> i32 {
      let mut digits = Vec::with_capacity(4);

      (0..4).for_each(|_| {
        digits.push(num % 10);
        num /= 10;
      });

      digits.sort_by(|a, b| a.cmp(b));

      if let &[d1, d2, d3, d4] = digits.as_slice() {
          return (10 * d1 + d3) + (10 * d2 + d4) 
      }

      unreachable!()
    }
}