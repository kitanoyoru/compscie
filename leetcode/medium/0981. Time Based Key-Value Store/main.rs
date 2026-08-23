use std::collections::HashMap; 

struct TimeMap {
    map: HashMap<String, Vec<(i32, String)>>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl TimeMap {

    fn new() -> Self {
        TimeMap {
            map: HashMap::new(),
        }
    }
    
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        self.map.entry(key).or_insert(Vec::new()).push((timestamp, value));
    }
    
    fn get(&self, key: String, timestamp: i32) -> String {
        match self.map.get(&key) {
            Some(values) => {
                let mut left = 0;
                let mut right = values.len() as i32 - 1;

                let mut result = "";

                while left <= right {
                    let mid = left + (right - left) / 2;

                    let (mid_ts, mid_val) = &values[mid as usize];

                    if *mid_ts == timestamp {
                        return mid_val.clone();
                    } else if *mid_ts < timestamp {
                        result = mid_val;
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }

                result.to_string()
            },
            None => String::new(),
        }
    }
}

/**
 * Your TimeMap object will be instantiated and called as such:
 * let obj = TimeMap::new();
 * obj.set(key, value, timestamp);
 * let ret_2: String = obj.get(key, timestamp);
 */
