package main

type Foo struct {
	firstDone  chan struct{}
	secondDone chan struct{}
}

func NewFoo() *Foo {
	return &Foo{
		firstDone:  make(chan struct{}),
		secondDone: make(chan struct{}),
	}
}

func (f *Foo) First(printFirst func()) {
	defer func() {
		close(f.firstDone)
	}()

	// Do not change this line
	printFirst()
}

func (f *Foo) Second(printSecond func()) {
	<-f.firstDone
	defer func() {
		close(f.secondDone)
	}()

	/// Do not change this line
	printSecond()
}

func (f *Foo) Third(printThird func()) {
	<-f.secondDone

	// Do not change this line
	printThird()
}
