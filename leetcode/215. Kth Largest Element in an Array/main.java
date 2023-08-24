// Solved by @kitanoyoru
// https://leetcode.com/problems/kth-largest-element-in-an-array/

class Solution {
  public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int el : nums) {
      pq.add(el);
      while (pq.size() > k) {
        pq.poll();
      }
    }

    return pq.poll();
  }
}
