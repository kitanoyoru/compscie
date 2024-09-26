package main

type Event struct {
	start int
	end   int
}

type MyCalendar struct {
	events []Event
}

func Constructor() MyCalendar {
	return MyCalendar{
		events: []Event{},
	}
}

func (this *MyCalendar) Book(start int, end int) bool {
	for _, evt := range this.events {
		if start < evt.end && end > evt.start {
			return false
		}
	}

	this.events = append(this.events, Event{start, end})

	return true
}

/**
 * Your MyCalendar object will be instantiated and called as such:
 * obj := Constructor();
 * param_1 := obj.Book(start,end);
 */

