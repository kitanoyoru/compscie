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
    pub fn longest_zig_zag(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut ans = 0;
        Self::longest_zig_zag_helper(root, &mut ans);

        ans
    }

    fn longest_zig_zag_helper(root: Option<Rc<RefCell<TreeNode>>>, ans: &mut i32) -> (i32, i32) {
        if let Some(root) = root {
            let root = root.borrow();
            let left = Self::longest_zig_zag_helper(root.left.clone(), ans).1 + 1;
            let right = Self::longest_zig_zag_helper(root.right.clone(), ans).0 + 1;

            *ans = right.max(left.max(*ans));

            (left, right)
        } else {
            (-1, -1)
        }
    }
}