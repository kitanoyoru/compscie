fn number_to_string(i: i32) -> String {
    let mut n = i;

    if n == 0 {
        return "0".to_string();
    }

    let mut is_negative = false;

    if n < 0 {
        is_negative = true;
        n = -n
    }

    let mut digits = Vec::new();

    while n > 0 {
        let digit = n % 10;
        digits.push(digit as u8 + b'0');
        n /= 10;
    }

    if is_negative {
        digits.push(b'-');
    }

    digits.reverse();

    String::from_utf8(digits).unwrap()
}
