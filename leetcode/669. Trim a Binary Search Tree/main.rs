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

impl Solution {
    pub fn trim_bst(mut root: Option<Rc<RefCell<TreeNode>>>, low: i32, high: i32) -> Option<Rc<RefCell<TreeNode>>> {
        Self::dfs(&mut root, low, high)
    }

    fn dfs(node_ref: &mut Option<Rc<RefCell<TreeNode>>>, l: i32, h: i32) -> Option<Rc<RefCell<TreeNode>>> {
        if let Some(node_ref) = node_ref.take() {
            let mut node = node_ref.borrow_mut();

            if node.val < l {
                return Self::dfs(&mut node.right, l, h);
            }
            if node.val > h {
                return Self::dfs(&mut node.left, l, h);
            }

            node.left = Self::dfs(&mut node.left, l, h);
            node.right = Self::dfs(&mut node.right, l, h);

            drop(node);

            Some(node_ref)
        } else {
            None
        }
    }
}