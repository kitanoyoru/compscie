#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        ListNode { next: None, val }
    }
}

impl Solution {
    pub fn partition(mut head: Option<Box<ListNode>>, x: i32) -> Option<Box<ListNode>> {
        let (mut before, mut after) = (ListNode::new(0), ListNode::new(0));

        let (mut before_target, mut after_target) = (&mut before, &mut after);

        while let Some(mut node) = head {
            head = node.next.take();
            if node.val < x {
                before_target.next = Some(node);
                before_target = before_target.next.as_mut().unwrap();
            } else {
                after_target.next = Some(node);
                after_target = after_target.next.as_mut().unwrap();
            }
        }

        before_target.next = after.next;

        before.next
    }
}
