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
            right: None,
        }
    }
}

use std::cell::RefCell;
use std::rc::Rc;

impl Solution {
    pub fn average_of_subtree(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut counter = 0;
        Solution::dfs(&root, &mut counter);
        counter
    }

    fn dfs(root: &Option<Rc<RefCell<TreeNode>>>, counter: &mut i32) {
        if let Some(node) = root {
            Solution::dfs(&node.borrow().left, counter);
            if node.borrow().val == Solution::find_average(root) {
                *counter += 1
            }
            Solution::dfs(&node.borrow().right, counter);
        }
    }

    fn find_average(root: &Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut avg_node_vals = vec![];
        Solution::inorder_traversal_to_find_average(root, &mut avg_node_vals);

        let mut sum = 0;
        for val in &avg_node_vals {
            sum += val
        }

        sum / avg_node_vals.len() as i32
    }

    fn inorder_traversal_to_find_average(
        root: &Option<Rc<RefCell<TreeNode>>>,
        avg_nodes: &mut Vec<i32>,
    ) {
        if let Some(node) = root {
            Solution::inorder_traversal_to_find_average(&node.borrow().left, avg_nodes);
            avg_nodes.push(node.borrow().val);
            Solution::inorder_traversal_to_find_average(&node.borrow().right, avg_nodes);
        }
    }
}
