const std = @import("std");

fn appendCharacters(s: []const u8, t: []const u8) usize {
    var i: usize = 0;
    var j: usize = 0;

    while (i < s.len and j < t.len) {
        if (s[i] == t[j]) {
            j += 1;
        }

        i += 1;
    }

    return t.len - j;
}

pub fn main() void {
    const s = "abc";
    const t = "cde";

    const result = appendCharacters(s, t);
    std.debug.print("Result: {}\n", .{result});
}
