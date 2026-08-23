// Solved by @kitanoyoru
// https://leetcode.com/problems/defanging-an-ip-address/submissions/

impl Solution {
   pub fn defang_i_paddr(address: String) -> String {
        address.replace(".", "[.]")       
    }
}

