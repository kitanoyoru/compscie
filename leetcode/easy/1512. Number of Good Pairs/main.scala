object Solution {
    def numIdenticalPairs(nums: Array[Int]): Int = {
      var s = 0

      for (i <- 0 to nums.length; j <- i+1 to nums.length - 1) {
        if (nums(i) == nums(j)) {
          s += 1
        }
      }

      s
    }
}
