from enum import Enum
from typing import List, Tuple, Dict


class Side(Enum):
    NORTH = "N"
    EAST = "E"
    SOUTH = "S"
    WEST = "W"


Item = Tuple[int, int, Side]


class Solution:
    def __init__(self) -> None:
        self.roots: Dict[Item] = {}

    def regionsBySlashes(self, grid: List[str]) -> int:
        def find(x: Item) -> Item:
            if x not in self.roots:
                self.roots[x] = x
            while x != self.roots[x]:
                x = self.roots[x]

            return x

        def union(x: Item, y: Item) -> None:
            self.roots[find(x)] = find(y)

        n = len(grid)

        for i in range(n):
            for j in range(n):
                if grid[i][j] == "/":
                    union((i, j, Side.NORTH), (i, j, Side.WEST))
                    union((i, j, Side.SOUTH), (i, j, Side.EAST))
                elif grid[i][j] == "\\":
                    union((i, j, Side.NORTH), (i, j, Side.EAST))
                    union((i, j, Side.SOUTH), (i, j, Side.WEST))
                elif grid[i][j] == " ":
                    union((i, j, Side.NORTH), (i, j, Side.EAST))
                    union((i, j, Side.SOUTH), (i, j, Side.WEST))
                    union((i, j, Side.NORTH), (i, j, Side.WEST))

                if j > 0:
                    union((i, j - 1, Side.EAST), (i, j, Side.WEST))
                if i > 0:
                    union((i - 1, j, Side.SOUTH), (i, j, Side.NORTH))

        return len(set(map(find, self.roots)))
