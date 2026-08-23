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
    pub fn sum_numbers(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut sum = 0;
        Self::helper(&root, 0, &mut sum);
        return sum;
    }

    fn helper(root: &Option<Rc<RefCell<TreeNode>>>, mut path: i32, sum: &mut i32) {
        if let Some(root) = root {
            let root = root.borrow();

            path = path * 10 + root.val;

            if root.left.is_none() && root.right.is_none() {
                *sum += path;
                return;
            }

            Self::helper(&root.left, path, sum);
            Self::helper(&root.right, path, sum);
        }
    }
}