const DATA_LEN: usize = 125001;

struct MyHashSet {
    data: [usize; DATA_LEN],
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyHashSet {

    fn new() -> Self {
        Self { data: [0; DATA_LEN] } 
    }
    
    fn add(&mut self, key: i32) {
        let (byte, bit) = self.find_position(key);
        self.data[byte] |= (1 << bit);
         
    }
    
    fn remove(&mut self, key: i32) {
        let (byte, bit) = self.find_position(key);
        self.data[byte] &= !(1 << bit);
    }
    
    fn contains(&self, key: i32) -> bool {
        let (byte, bit) = self.find_position(key);

        (self.data[byte] & (1 << bit)) != 0
        
    }

    fn find_position(&self, key: i32) -> (usize, usize) {
        ((key / 8) as usize, (key % 8) as usize)
    }
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * let obj = MyHashSet::new();
 * obj.add(key);
 * obj.remove(key);
 * let ret_3: bool = obj.contains(key);
 */

