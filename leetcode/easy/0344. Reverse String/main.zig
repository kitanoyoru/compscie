const std = @import("std");

pub fn reverse_string(s: []u8) void {
    var start = usize(0);
    var end = s.len - usize(1);

    while (start < end) {
        const temp = s[start];
        s[start] = s[end];
        s[end] = temp;

        start += 1;
        end -= 1;
    }
}
