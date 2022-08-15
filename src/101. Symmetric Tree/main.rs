// Solved by @kitanoyoru
// https://leetcode.com/problems/symmetric-tree/submissions/

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

use std::rc::Rc;
use std::cell::RefCell;

type OptionalNode = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    fn helper(left: OptionalNode, right: OptionalNode) -> bool {
        match (left, right) {
            (None, None) => true,
            (None, Some(n)) | (Some(n), None) => false,
            (Some(l), Some(r)) => {
                if l.borrow().val != r.borrow().val {
                    return false;
                }
                Self::helper(l.borrow().left.clone(), r.borrow().right.clone())
                    && Self::helper(l.borrow().right.clone(), r.borrow().left.clone())
            }
        }
    }

    pub fn is_symmetric(root: OptionalNode) -> bool {
        match root {
            Some(root_ref) => Self::helper(root_ref.borrow().left.clone(), root_ref.borrow().right.clone()),
            None => true
        }        
    }
}
