// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-tree-level-order-traversal/submissions/

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

impl Solution {
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        let mut ans = vec![];

        let mut q = vec![];
        if let Some(root) = root {
            q.push(root);
        }

        while !q.is_empty() {
            let mut level = vec![];
            let mut nq = vec![];

            for node in q.iter() {
                level.push(node.borrow().val);
                if let Some(left) = node.borrow_mut().left.take() {
                    nq.push(left);
                }
                if let Some(right) = node.borrow_mut().right.take() {
                    nq.push(right);
                }
            }

            ans.push(level);
            q = nq;
        }

        ans
    }
}
