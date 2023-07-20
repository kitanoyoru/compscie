from typing import Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> Optional[ListNode]:
        num1, num2 = map(self.get_number_from_list, (l1, l2))

        return self.get_list_from_number(num1 + num2)

    def get_number_from_list(self, l: ListNode) -> int:
        cur, num = l, ""

        while cur:
            num += str(cur.val)
            cur = cur.next

        return int(num)

    def get_list_from_number(self, num: int) -> Optional[ListNode]:
        root = ListNode()

        cur = root

        for digit in str(num):
            cur.next = ListNode(val=int(digit))
            cur = cur.next

        return root.next
