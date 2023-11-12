use std::borrow::Borrow;
use std::cell::UnsafeCell;

use super::node::Node;

pub struct SplayMap<K: Ord, V> {
    root: UnsafeCell<Option<Box<Node<K, V>>>>,
    size: usize,
}

pub struct IntoIter<K, V> {
    cur: Option<Box<Node<K, V>>>,
    remaining: usize,
}

fn splay<K, V, Q: ?Sized>(key: &Q, node: &mut Box<Node<K, V>>)
where
    K: Ord + Borrow<Q>,
    Q: Ord,
{
    let mut new_left = None;
    let mut new_right = None;

    {
        let mut l = &mut new_right;
        let mut r = &mut new_left;

        loop {
            match key.cmp(node.key.borrow()) {
                Equal => break,

                Less => {
                    let mut left = match node.pop_left() {
                        Some(left) => left,
                        None => break,
                    };

                    if key.cmp(left.key.borrow()) == Less {
                        std::mem::swap(&mut node.left, &mut left.right);
                        std::mem::swap(&mut left, node);

                        let none = std::mem::replace(&mut node.right, Some(left));

                        match std::mem::replace(&mut node.left, none) {
                            Some(l) => left = l,
                            None => break,
                        }
                    }

                    *r = Some(std::mem::replace(node, left));
                    let tmp = r;
                    r = &mut tmp.as_mut().unwrap().left;
                }
            }
        }
    }
}
