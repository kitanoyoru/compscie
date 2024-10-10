type IEvent = [start: number, end: number]

class MyCalendar {
  private events: Array<IEvent>

  constructor() {
    this.events = []
  }

  book(start: number, end: number): boolean {
    for (const evt of this.events) {
      if (start < evt[1] && end > evt[0]) {
        return false
      }
    }

    this.events.push([start, end])

    return true
  }
}

/**
 * Your MyCalendar object will be instantiated and called as such:
 * var obj = new MyCalendar()
 * var param_1 = obj.book(start,end)
 */
