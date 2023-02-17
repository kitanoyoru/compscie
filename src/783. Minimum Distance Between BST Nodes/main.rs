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
use std::cmp::min;

type NodePointer = Rc<RefCell<TreeNode>>;

impl Solution {
    pub fn min_diff_in_bst(root: Option<NodePointer>) -> i32 {
        let (mut ans, mut prev) = (i32::MAX, i32::MIN);
        Self::dfs(root.clone(), &mut prev, &mut ans);
        ans
    }

    fn dfs(node: Option<NodePointer>, prev: &mut i32, ans: &mut i32) {
        if let Some(node) = node {
            let (val, left, right) = match RefCell::borrow(&node) {
                n => (n.val, n.left.clone(), n.right.clone())
            };
            Self::dfs(left, prev, ans);
            *ans = (val.saturating_sub(*prev)).min(*ans);
            *prev = val;
            Self::dfs(right, prev, ans);
        }
    }
}