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
use std::collections::VecDeque;

impl Solution {
    pub fn is_complete_tree(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
      let mut q = VecDeque::new();
      
      q.push_back(root);
      
      let mut is_prev_none = false;

      while !q.is_empty() {
         let node = q.pop_front().unwrap();

         match node {
            Some(node) => {
               if is_prev_none {
                  return false;
               }

               let node = node.borrow();

               q.push_back(node.left.clone());
               q.push_back(node.right.clone());
            },
            None => {
               is_prev_none = true;
               continue;
            }
         }
      }

      true
    }
}