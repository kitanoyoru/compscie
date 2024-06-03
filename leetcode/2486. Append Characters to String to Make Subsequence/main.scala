object Solution {
    def appendCharacters(s: String, t: String): Int = {
      var i = 0
      var j = 0

      while (i < s.length && j < t.length) {
        if (s.charAt(i) == t.charAt(j)) {
          j += 1
        }

        i += 1
      }

      t.length - j
    }
}
