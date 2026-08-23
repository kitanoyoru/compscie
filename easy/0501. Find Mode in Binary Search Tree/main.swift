public class TreeNode {
  public var val: Int
  public var left: TreeNode?
  public var right: TreeNode?
  public init() { self.val = 0; self.left = nil; self.right = nil; }
  public init(_ val: Int) { self.val = val; self.left = nil; self.right = nil; }
  public init(_ val: Int, _ left: TreeNode?, _ right: TreeNode?) {
      self.val = val
      self.left = left
      self.right = right
  }
}

class Solution {
    var map: [Int: Int] = [:]
    var max: Int?

    func findMode(_ root: TreeNode?) -> [Int] {
        dfs(root)
        
        var result: [Int] = []
        for (key, value) in map {
            if value == max {
                result.append(key)
            }
        }

        return result
    }

    func dfs(_ node: TreeNode?) {
        guard let node = node else { return }

        dfs(node.left)

        let newValue = (map[node.val] ?? 0) + 1
        map[node.val] = newValue
        if newValue > (max ?? Int.min) {
            max = newValue
        }

        dfs(node.right)
    }
}
