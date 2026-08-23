// Solved by @kitanoyoru
// https://leetcode.com/problems/invert-binary-tree/

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

type Node = Option<Rc<RefCell<TreeNode>>>; 

impl Solution {
    pub fn invert_tree(root: Node) -> Node {
        if let Some(node) = root.clone() {
            let mut node = node.borrow_mut();
            let (left, right) = (
                Self::invert_tree(node.left.clone()),
                Self::invert_tree(node.right.clone())
            );
            
            node.right = left;
            node.left = right;
        }
        root
    }
}
