object Solution {
    def shuffle(nums: Array[Int], n: Int): Array[Int] = {
      (0 until n).flatMap(i => Array(nums(i), nums(i+n))).toArray        
    }
}
