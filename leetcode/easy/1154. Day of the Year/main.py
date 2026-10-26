from datetime import datetime


class Solution:
    def dayOfYear(self, date: str) -> int:
        t = datetime.strptime(date, "%Y-%m-%d")
        return t.timetuple().tm_yday
