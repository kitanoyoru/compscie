# Solved by @kitanoyoru
# https://leetcode.com/problems/design-circular-queue/

class MyCircularQueue:

    def __init__(self, k: int) -> None:
        self.arr = [None] * k
        self.size = k
        self.putloc = -1
        self.getloc = 0

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        
        self.putloc = (self.putloc + 1) % self.size
        self.arr[self.putloc] = value

        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False

        if self.putloc == self.getloc:
            self.getloc = 0
            self.putloc = -1
        else:
            self.getloc = (self.getloc + 1) % self.size
        
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.arr[self.getloc]        

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.arr[self.putloc]

    def isEmpty(self) -> bool:
        return self.putloc == -1
        

    def isFull(self) -> bool:
        return not self.isEmpty() and (self.putloc + 1) % self.size == self.getloc
        


# Your MyCircularQueue object will be instantiated and called as such:
# obj = MyCircularQueue(k)
# param_1 = obj.enQueue(value)
# param_2 = obj.deQueue()
# param_3 = obj.Front()
# param_4 = obj.Rear()
# param_5 = obj.isEmpty()
# param_6 = obj.isFull()
