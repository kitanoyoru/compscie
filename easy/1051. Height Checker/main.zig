const std = @import("std");

fn height_checker(allocator: std.mem.Allocator, heights: []const u32) !u32 {
    const sortedHeights = try allocator.alloc(u32, heights.len);
    defer allocator.free(sortedHeights);

    std.mem.copyForwards(u32, sortedHeights, heights);

    std.sort.heap(u32, sortedHeights, {}, std.sort.asc(u32));

    var result: u32 = 0;
    for (heights, 0..) |current, i| {
        if (current != sortedHeights[i]) {
            result += 1;
        }
    }

    return result;
}

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    const heights: [6]u32 = .{ 1, 1, 4, 2, 1, 3 };
    const result = try height_checker(allocator, &heights);
    std.debug.print("Result: {}\n", .{result}); // Result: 3
}
