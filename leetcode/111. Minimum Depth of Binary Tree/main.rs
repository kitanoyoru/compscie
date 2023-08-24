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
//

use std::cell::RefCell;
use std::rc::Rc;

use std::cmp::min;

type Node = Rc<RefCell<TreeNode>>;

// dfs

impl Solution {
    pub fn min_depth(root: Option<Node>) -> i32 {
        Self::dfs(root)
    }

    fn dfs(node: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        if let Some(n) = node {
            let n = n.borrow();
            let (l, r) = (Self::dfs(n.left.clone()), Self::dfs(n.right.clone()));
            if l == 0 || r == 0 {
                return 1 + l + r;
            } else {
                return 1 + min(l, r);
            }
        }

        0
    }
}

// bfs

use std::collections::VecDeque;

impl Solution {
    pub fn min_depth(root: Option<Node>) -> i32 {
        if let Some(r) = root {
            let mut q = VecDeque::new();
            q.push_back((1, r));

            while !q.is_empty() {
                if let Some((level, node)) = q.pop_front() {
                    let node = node.borrow();
                    if node.left.is_none() && node.right.is_none() {
                        return level;
                    }
                    if let Some(l) = node.left.clone() {
                        q.push_back((level + 1, l))
                    }

                    if let Some(r) = node.right.clone() {
                        q.push_back((level + 1, r))
                    }
                }
            }

            return 0;
        }

        0
    }
}
