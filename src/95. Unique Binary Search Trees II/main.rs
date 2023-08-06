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
    pub fn generate_trees(n: i32) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
        Self::dfs(1, n)
    }

    fn dfs(start: i32, end: i32) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
        if start > end {
            return vec![None];
        }

        let mut trees = Vec::new();

        for i in start..=end {
            let left_trees = Self::dfs(start, i - 1);
            let right_trees = Self::dfs(i + 1, end);

            for left in &left_trees {
                for right in &right_trees {
                    let mut root = Some(Rc::new(RefCell::new(TreeNode::new(i))));
                    root.as_ref().unwrap().borrow_mut().left = left.clone();
                    root.as_ref().unwrap().borrow_mut().right = right.clone();
                    trees.push(root)
                }
            }
        }

        trees
    }
}
