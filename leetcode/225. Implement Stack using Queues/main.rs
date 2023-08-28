use std::collections::VecDeque;

struct MyStack {
    q: VecDeque<i32>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyStack {

    fn new() -> Self {
       MyStack { q: VecDeque::new() } 
    }
    
    fn push(&mut self, x: i32) {
       self.q.push_back(x); 
       self.reverse();
    }
    
    fn pop(&mut self) -> i32 {
       self.q.pop_front().unwrap() 
    }
    
    fn top(&self) -> i32 {
       *self.q.front().unwrap() 
    }
    
    fn empty(&self) -> bool {
       self.q.is_empty() 
    }

    fn reverse(&mut self) {
        for _ in 0..self.q.len() - 1 {
            let val = self.q.pop_front().unwrap();
            self.q.push_back(val);
        }
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * let obj = MyStack::new();
 * obj.push(x);
 * let ret_2: i32 = obj.pop();
 * let ret_3: i32 = obj.top();
 * let ret_4: bool = obj.empty();
 */
