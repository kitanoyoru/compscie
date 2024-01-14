class Solution {
  bool closeStrings(String word1, String word2) {
    if (word1.length != word2.length) {
      return false;
    }

    List<int> firstFreq = List<int>.filled(26, 0);
    List<int> secondFreq = List<int>.filled(26, 0);

    for (int i = 0; i < word1.length; i++) {
      firstFreq[word1.codeUnitAt(i) - 'a'.codeUnitAt(0)]++;
      secondFreq[word2.codeUnitAt(i) - 'a'.codeUnitAt(0)]++;
    }

    for (int i = 0; i < 26; i++) {
      if ((firstFreq[i] == 0 && secondFreq[i] > 0) ||
          (firstFreq[i] == 0 && secondFreq[i] > 0)) {
        return false;
      }
    }

    firstFreq.sort();
    secondFreq.sort();

    for (int i = 0; i < 26; i++) {
      if (firstFreq[i] != secondFreq[i]) {
        return false;
      }
    }

    return true;
  }
}
