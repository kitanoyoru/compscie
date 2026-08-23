// Solved by @kitanoyoru
// https://leetcode.com/problems/pascals-triangle/

class Solution {
  public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> pascalTriangle = new ArrayList<>();
    for (var i = 0; i < numRows; i++) {
      List<Integer> row = new ArrayList<>(i);      
      
      row.add(1);

      for (var j = 1; j < i; j++) {
        int val = pascalTriangle.get(i-1).get(j-1) + pascalTriangle.get(i-1).get(j);
        row.add(val);
      }

      if (i != 0) {
        row.add(1);
      }

      pascalTriangle.add(row);
    }

    return pascalTriangle;
  }
}
