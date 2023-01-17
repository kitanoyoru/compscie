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
    pub fn find_bottom_left_value(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let (max_level, ans) = (&mut 0, &mut 0);
        
        Self::dfs(root.clone(), 1,  max_level, ans);

        *ans
        
    }

    fn dfs(node: Option<Rc<RefCell<TreeNode>>>, level: i32, max_level: &mut i32, ans: &mut i32) {
        match node {
            Some(node) => {
                Self::dfs(node.borrow().left.clone(), level+1, max_level, ans);
                if level > *max_level {
                    *max_level = level;
                    *ans = node.borrow().val;
                }
                Self::dfs(node.borrow().right.clone(), level+1, max_level, ans);
            }
            _ => (),
        }
    }
}