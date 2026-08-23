package main

type Value struct {
	timestamp int
	value     string
}

type TimeMap struct {
	m map[string][]Value
}

func Constructor() TimeMap {
	return TimeMap{
		m: make(map[string][]Value),
	}
}

func (this *TimeMap) Set(key string, value string, timestamp int) {
	this.m[key] = append(this.m[key], Value{timestamp, value})
}

func (this *TimeMap) Get(key string, timestamp int) string {
	values, ok := this.m[key]
	if !ok {
		return ""
	}

	result := ""

	low, high := 0, len(values)-1

	for low <= high {
		mid := low + (high-low)/2

		if values[mid].timestamp == timestamp {
			return values[mid].value
		} else if values[mid].timestamp < timestamp {
			result = values[mid].value
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return result
}

/**
 * Your TimeMap object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Set(key,value,timestamp);
 * param_2 := obj.Get(key,timestamp);
 */
