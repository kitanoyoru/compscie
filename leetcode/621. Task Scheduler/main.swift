class Solution {
    func leastInterval(_ tasks: [Character], _ n: Int) -> Int {
        var freq = Array(repeating: 0, count: 26)
        for task in tasks {
            if let ascii = task.asciiValue {
                freq[Int(ascii - Character("A").asciiValue!)] += 1
            }
        }
        freq.sort()

        let chunk = freq[25] - 1
        var idle = chunk * n

        for i in stride(from: 24, through: 0, by: -1) {
            idle -= min(chunk, freq[i])
        }

        if idle < 0 {
            return tasks.count
        }

        return tasks.count + idle
    }

    func min(_ a: Int, _ b: Int) -> Int {
        return a < b ? a : b
    }
}
