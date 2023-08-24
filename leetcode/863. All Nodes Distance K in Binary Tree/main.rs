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

use std::collections::{HashMap, HashSet, VecDeque};

type Node = Rc<RefCell<TreeNode>>;

impl Solution {
    pub fn distance_k(root: Option<Node>, target: Option<Node>, k: i32) -> Vec<i32> {
        if k == 0 {
            return vec![target.unwrap().borrow().val];
        }

        let mut graph = HashMap::new();

        if let Some(r) = root.as_ref() {
            Self::build_adj_list(r, &mut graph);
        }

        Self::find_nodes_with_k_distance(target, k, &mut graph)
    }

    fn build_adj_list(parent: &Node, graph: &mut HashMap<usize, Vec<usize>>) -> usize {
        let parent = parent.borrow();
        let parent_val = parent.val as usize;

        if let Some(node) = parent.left.as_ref() {
            let node_val = Self::build_adj_list(node, graph);
            graph.entry(parent_val).or_insert(vec![]).push(node_val);
            graph.entry(node_val).or_insert(vec![]).push(parent_val);
        }

        if let Some(node) = parent.right.as_ref() {
            let node_val = Self::build_adj_list(node, graph);
            graph.entry(parent_val).or_insert(vec![]).push(node_val);
            graph.entry(node_val).or_insert(vec![]).push(parent_val);
        }

        parent_val
    }

    fn find_nodes_with_k_distance(
        target: Option<Node>,
        k: i32,
        graph: &mut HashMap<usize, Vec<usize>>,
    ) -> Vec<i32> {
        let mut dist = 0;
        let mut visited = HashSet::new();

        let mut q = VecDeque::new();
        if let Some(target) = target.as_ref() {
            q.push_back(target.borrow().val as usize);
        }

        while !q.is_empty() && dist < k {
            for _ in 0..q.len() {
                let node_val = q.pop_front().unwrap();
                visited.insert(node_val);

                if let Some(adj) = graph.remove(&node_val) {
                    q.extend(adj.into_iter().filter(|x| !visited.contains(x)));
                }
            }

            dist += 1
        }

        q.into_iter().map(|x| x as i32).collect()
    }
}
