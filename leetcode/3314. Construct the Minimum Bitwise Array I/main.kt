class Solution {
    fun minBitwiseArray(nums: List<Int>): IntArray {
        return IntArray(nums.size) { idx ->
            val value = nums[idx]
            var result = -1
            
            for (i in 0 until value) {
                if (i or (i + 1) == value) {
                    result = i
                    break
                }
            }

            result
        }
    }
}

