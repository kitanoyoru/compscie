use std::collections::{HashMap, BinaryHeap};
use std::cmp::Ordering;


#[derive(Eq, PartialEq, Debug, Clone)]
struct Task {
    id: i32,
    user_id: i32,
    priority: i32,
}

impl Ord for Task {
    fn cmp(&self, other: &Self) -> Ordering {
        match self.priority.cmp(&other.priority) {
            Ordering::Equal => self.id.cmp(&other.id),
            ord => ord,
        }
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

struct TaskManager {
    heap: BinaryHeap<Task>,
    map: HashMap<i32, Task>
}

impl TaskManager {
    fn new(tasks: Vec<Vec<i32>>) -> Self {
        let mut heap = BinaryHeap::new();
        let mut map = HashMap::new();

        for task in tasks {
            let t = Task {
                id: task[1],
                user_id: task[0],
                priority: task[2],
            };

            heap.push(t.clone());
            map.insert(t.id, t);
        }

        Self { heap, map }
    }
    
    fn add(&mut self, user_id: i32, task_id: i32, priority: i32) {
        let task = Task { id: task_id, user_id, priority };
        self.heap.push(task.clone());
        self.map.insert(task_id, task);
        
    }
    
    fn edit(&mut self, task_id: i32, new_priority: i32) {
        if let Some(task) = self.map.get_mut(&task_id) {
            task.priority = new_priority;
            self.heap.push(task.clone());
        }
    }
    
    fn rmv(&mut self, task_id: i32) {
        self.map.remove(&task_id);
    }
    
    fn exec_top(&mut self) -> i32 {
        while let Some(top) = self.heap.pop() {
            if let Some(latest) = self.map.get(&top.id) {
                if latest.priority == top.priority {
                    self.map.remove(&top.id);
                    return top.user_id;
                }
            }
        }

        -1
    }
}


