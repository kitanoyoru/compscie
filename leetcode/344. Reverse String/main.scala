object Solution {
    def reverseString(s: Array[Char]): Unit = {
      var start = 0
      var end = s.length - 1

      while (start < end) {
        val temp = s(start)
        s(start) = s(end)
        s(end) = temp

        start += 1
        end -= 1
      }
    }
}
