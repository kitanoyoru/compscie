// Solved by @kitanoyoru

int numJewelsInStones(char * jewels, char * stones){
  int i, j;
  int ans = 0;

  for (i = 0; i < strlen(jewels); i++) {
    for (j = 0; j < strlen(stones); j++) {
      if (jewels[i] == stones[j]) {
        ans++;
      }
    }
  }

  return ans;
}
