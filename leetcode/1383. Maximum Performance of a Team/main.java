class Solution {
  public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    int[][] arr = new int[n][2];
    for (int i = 0; i < n; i++) {
      arr[i] = new int[] {efficiency[i], speed[i]};
    }
    
    Arrays.sort(arr, (a, b) -> b[0] - a[0]);
    
    PriorityQueue<Integer> pq = new PriorityQueue<>(k, (a, b) -> a - b);
    long ans = 0, temp = 0;

    for (int[] e : arr) {
      pq.add(e[1]);
      temp += e[1];
      if (pq.size() > k) temp -= pq.poll();
      ans = Math.max(ans, (temp * e[0]));
    }

    return (int)(ans % (long)(1e9 + 7));
  }
}
