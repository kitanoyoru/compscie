object Solution {
    def createTargetArray(nums: Array[Int], index: Array[Int]): Array[Int] = {
      (0 until nums.length).foldLeft(Array.emptyIntArray)((acc, i) => {
        var (left, right) = acc.splitAt(index(i))
        left ++ Array(nums(i)) ++ right
      })        
    }
}
