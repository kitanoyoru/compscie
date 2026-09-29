class Solution:
    def convertToBase7(self, num: int) -> str:
        if num == 0:
            return "0"

        neg = num < 0
        if neg:
            num = -num

        buf = []

        while num > 0:
            buf.append(str(num % 7))
            num //= 7

        buf.reverse()

        s = "".join(buf)

        return "-" + s if neg else s
