class Solution:
    def checkRecord(self, s: str) -> bool:
        absentCount, consecutiveLateCount = 0, 0

        for v in s:
            if v == "A":
                absentCount += 1
                if absentCount >= 2:
                    return False

            if v == "L":
                consecutiveLateCount += 1
                if consecutiveLateCount >= 3:
                    return False

                continue

            consecutiveLateCount = 0

        return True
