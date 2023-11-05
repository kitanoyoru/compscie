impl Solution {
    pub fn get_winner(arr: Vec<i32>, k: i32) -> i32 {
        let n = arr.len();

        if k as usize >= n {
            return *arr.iter().max().unwrap();
        }

        let mut winner = arr[0];
        let mut consecutive_wins = 0;

        for i in 1..n {
            if winner > arr[i] {
                consecutive_wins += 1;
            } else {
                winner = arr[i];
                consecutive_wins = 1;
            }

            if consecutive_wins == k as usize {
                return winner;
            }
        }

        winner
    }
}
