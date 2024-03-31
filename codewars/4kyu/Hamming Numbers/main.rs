fn hamming(n: usize) -> u64 {
    let mut h = vec![0u64; n];
    h[0] = 1;

    let (mut next_two, mut next_three, mut next_five) = (2u64, 3u64, 5u64);
    let (mut i, mut j, mut k) = (0, 0, 0);

    for m in 1..n {
        let next_hamming = next_two.min(next_three.min(next_five));
        h[m] = next_hamming;

        if next_hamming == next_two {
            i += 1;
            next_two = 2 * h[i];
        }
        if next_hamming == next_three {
            j += 1;
            next_three = 3 * h[j];
        }
        if next_hamming == next_five {
            k += 1;
            next_five = 5 * h[k];
        }
    }

    h[n - 1]
}
