package main

type BrowserHistory struct {
	history []string
	current int
}

func Constructor(homepage string) BrowserHistory {
	return BrowserHistory{
		history: []string{homepage},
		current: 0,
	}
}

func (this *BrowserHistory) Visit(url string) {
	this.history = append(this.history[:this.current+1], url)
	this.current += 1
}

func (this *BrowserHistory) Back(steps int) string {
	this.current = max(0, this.current-steps)
	return this.history[this.current]
}

func (this *BrowserHistory) Forward(steps int) string {
	this.current = min(len(this.history)-1, this.current+steps)
	return this.history[this.current]
}

func max(a, b int) int {
	if a < b {
		return b
	}

	return a
}

func min(a, b int) int {
	if a < b {
		return a
	}

	return b
}
