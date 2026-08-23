class Solution {
  int maxLengthBetweenEqualCharacters(String s) {
    var maxLength = -1;

    for (int left = 0; left < s.length; left++) {
      for (int right = left + 1; right < s.length; right++) {
        if (s[left] == s[right]) {
          maxLength = max(maxLength, right - left - 1);
        }
      }
    }

    return maxLength;
  }
}
