// Solved by @kitanoyoru
// https://leetcode.com/problems/guess-number-higher-or-lower/

public class Solution extends GuessGame {
   public int guessNumber(int n) {
      int start = 1, end = n;

      while (start <= n) {
         int mid = start + (end - start) / 2;
         var guessAnswer = guess(mid);

         if (guessAnswer == 0) {
            return mid;
         } else if (guessAnswer == 1) {
            start = mid + 1;
         } else {
            end = mid - 1;
         }
      }
      return 0;
   }
}
