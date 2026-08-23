// Solved by @kitanoyoru
// https://leetcode.com/problems/maximum-depth-of-binary-tree/submissions/

// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
//
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode {
//       val,
//       left: None,
//       right: None
//     }
//   }
// }

use std::cell::RefCell;
use std::rc::Rc;

impl Solution {
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        match root {
            Some(root_ref) => {
                let left = root_ref.borrow_mut().left.take();
                let right = root_ref.borrow_mut().right.take();

                i32::max(Self::max_depth(left), Self::max_depth(right)) + 1
            }
            None => 0,
        }
    }
}
