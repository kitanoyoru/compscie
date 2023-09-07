class ListNode {
  val: number
  next: ListNode | null

  constructor(val?: number, next?: ListNode | null) {
      this.val = (val===undefined ? 0 : val)
      this.next = (next===undefined ? null : next)
  }
}

function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
    if (!head || right == left) {
        return head;
    }

    let dummy = new ListNode(0, head);
    let prev = dummy;

    for (let i = 0; i < left-1; i++) {
        prev = prev!.next!;
    }

    let cur = prev.next;

    for (let i = 0; i < right - left; i++) {
        let next = cur!.next;
        cur!.next = next!.next;
        next!.next = prev.next;
        prev!.next = next;
    }

    return dummy.next;
};
