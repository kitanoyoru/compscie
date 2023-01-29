#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
  pub val: i32,
  pub left: Option<Rc<RefCell<TreeNode>>>,
  pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
  #[inline]
  pub fn new(val: i32) -> Self {
    TreeNode {
      val,
      left: None,
      right: None
    }
  }
}

use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashSet;

impl Solution {
    pub fn dfs(node: Option<&Rc<RefCell<TreeNode>>>, mut path: HashSet<i32>) -> i32 {
        if let Some(node_ref) = node {
            let node = node_ref.borrow();
            if path.contains(&node.val) {
                path.remove(&node.val);
            } else {
                path.insert(node.val);
            }

            if node.left.is_none() && node.right.is_none() {
                if path.len() <= 1 {
                    return 1;
                }
            }

            let left = Self::dfs(node.left.as_ref(), path.clone());
            let right = Self::dfs(node.right.as_ref(), path.clone());

            return left + right;
        }

        0
    }

    pub fn pseudo_palindromic_paths (root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        Self::dfs(root.as_ref(), HashSet::new())
    }
}