// SOlved by @kitanoyoru

int countConsistentStrings(char * allowed, char ** words, int wordsSize){
  int s = 0, ans = 0;
  for (int i = 0; allowed[i]; i++) {
    s |= 1 << (allowed[i] - 'a');
  }

  for (int i = 0; i < wordsSize; i++) {
    int c = 0;
    for (int j = 0; words[i][j]; j++) {
      c |= 1 << (words[i][j] - 'a');
    }
    if (s == (c | s)) {
      ans++;
    }
  }

  return ans;
}
