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
use std::cmp::Ordering;
use std::collections::HashMap;
use std::rc::Rc;

impl Solution {
    pub fn find_mode(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        let mut map: HashMap<i32, u32> = HashMap::new();

        Solution::dfs(&root, &mut map);

        let max_value: u32 = *map.values().max().unwrap_or(&(u32::MIN));

        let mut solution: Vec<i32> = Vec::new();
        if max_value == u32::MIN {
            return solution;
        }

        for (key, value) in map.iter() {
            match value.cmp(&max_value) {
                Ordering::Equal => {
                    solution.push(*key);
                }
                _ => {}
            }
        }

        solution
    }

    fn dfs(root: &Option<Rc<RefCell<TreeNode>>>, map: &mut HashMap<i32, u32>) {
        if let Some(node) = root {
            Solution::dfs(&(**node).borrow().left, map);
            map.entry((*node).borrow().val)
                .and_modify(|counter| *counter += 1)
                .or_insert(1);
            Solution::dfs(&(**node).borrow().right, map);
        }
    }
}
