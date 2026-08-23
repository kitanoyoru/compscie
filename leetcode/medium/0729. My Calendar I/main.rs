struct MyCalendar {
    events: Vec<(i32, i32)>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyCalendar {

    fn new() -> Self {
        Self {
            events: vec![],
        }
    }
    
    fn book(&mut self, start: i32, end: i32) -> bool {
        for &evt in &self.events {
            if start < evt.1 && end > evt.0 {
                return false;
            }
        }

        self.events.push((start, end));

        true
    }
}

/**
 * Your MyCalendar object will be instantiated and called as such:
 * let obj = MyCalendar::new();
 * let ret_1: bool = obj.book(start, end);
 */
