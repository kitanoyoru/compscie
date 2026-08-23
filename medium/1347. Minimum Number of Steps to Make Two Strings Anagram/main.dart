class Solution {
  int minSteps(String s, String t) {
    List<int> sFreq = List<int>.filled(26, 0);
    List<int> tFreq = List<int>.filled(26, 0);

    for (int i = 0; i < s.length; i++) {
      sFreq[s.codeUnitAt(i) - 'a'.codeUnitAt(0)]++;
      tFreq[t.codeUnitAt(i) - 'a'.codeUnitAt(0)]++;
    }

    int steps = 0;
    for (int i = 0; i < 26; i++) {
      steps += (sFreq[i] - tFreq[i]).abs();
    }

    return steps ~/ 2;
  }
}
