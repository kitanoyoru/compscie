// Solved by @kitanoyoru
// https://leetcode.com/problems/design-hashmap/

type HashMap = {
  [key: number]: number;
}

interface IMyHashMap {
  put: (key: number, value: number) => void;
  get: (key: number) => number;
  remove: (key: number) => void;
}

class MyHashMap implements IMyHashMap {
  constructor(private obj: HashMap = {}) {}

  put(key: number, value: number): void {
    this.obj[key] = value;
  }

  get(key: number): number {
    if (this.obj[key] || this.obj[key] == 0) {
      return this.obj[key];
    }
    return -1;
  }

  remove(key: number): void {
    delete this.obj[key];
  }
}

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */

 export {}
