package main

import (
	"fmt"
	"sort"
)

type Packet struct {
	Source      int
	Destination int
	Timestamp   int
}

func (p Packet) Hash() string {
	return fmt.Sprintf("%d-%d-%d", p.Source, p.Destination, p.Timestamp)
}

func (p Packet) Raw() []int {
	return []int{p.Source, p.Destination, p.Timestamp}
}

type Router struct {
	limit   int
	queue   []Packet
	hashSet map[string]struct{}
	byDest  map[int][]Packet
}

func Constructor(memoryLimit int) Router {
	return Router{
		limit:   memoryLimit,
		queue:   make([]Packet, 0, memoryLimit),
		hashSet: make(map[string]struct{}, memoryLimit),
		byDest:  make(map[int][]Packet),
	}
}

func (this *Router) AddPacket(source int, destination int, timestamp int) bool {
	packet := Packet{Source: source, Destination: destination, Timestamp: timestamp}
	packetHash := packet.Hash()

	if _, exists := this.hashSet[packetHash]; exists {
		return false
	}

	if len(this.queue) == this.limit {
		old := this.queue[0]
		this.queue = this.queue[1:]
		delete(this.hashSet, old.Hash())

		this.byDest[old.Destination] = this.byDest[old.Destination][1:]
		if len(this.byDest[old.Destination]) == 0 {
			delete(this.byDest, old.Destination)
		}
	}

	this.queue = append(this.queue, packet)
	this.hashSet[packetHash] = struct{}{}
	this.byDest[destination] = append(this.byDest[destination], packet)

	return true
}

func (this *Router) ForwardPacket() []int {
	if len(this.queue) == 0 {
		return []int{}
	}

	packet := this.queue[0]
	this.queue = this.queue[1:]
	delete(this.hashSet, packet.Hash())

	this.byDest[packet.Destination] = this.byDest[packet.Destination][1:]
	if len(this.byDest[packet.Destination]) == 0 {
		delete(this.byDest, packet.Destination)
	}

	return packet.Raw()
}

func (this *Router) GetCount(destination int, startTime int, endTime int) int {
	packets, ok := this.byDest[destination]
	if !ok {
		return 0
	}

	left := sort.Search(len(packets), func(i int) bool { return packets[i].Timestamp >= startTime })
	right := sort.Search(len(packets), func(i int) bool { return packets[i].Timestamp > endTime })

	return right - left
}
