package main

import "sort"

const (
	WinnerIdx int = iota
	LoserIdx
)

type Player struct {
	id     int
	Won    int
	Played int
}

func NewPlayer(id int) *Player {
	return &Player{
		id: id,
	}
}

func (p *Player) Play(match []int) {
	if match[WinnerIdx] == p.id {
		p.Won++
	}
	p.Played++
}

func (p *Player) WonAll() bool {
	return p.Won == p.Played
}

func (p *Player) LostOne() bool {
	return p.Won == p.Played-1
}

func getPlayersWins(matches [][]int) map[int]*Player {
	players := make(map[int]*Player)

	for _, match := range matches {
		for _, id := range match {
			if _, ok := players[id]; !ok {
				players[id] = NewPlayer(id)
			}

			players[id].Play(match)
		}
	}

	return players
}

func filterKeysByValue[K comparable, V any](target map[K]V, cond func(val V) bool) []K {
	filtered := make([]K, 0, len(target))

	for k, v := range target {
		if cond(v) {
			filtered = append(filtered, k)
		}
	}

	return filtered
}
func findWinners(matches [][]int) [][]int {
	players := getPlayersWins(matches)

	wonAllPlayers := filterKeysByValue(players, func(p *Player) bool { return p.WonAll() })
	lostOnePlayers := filterKeysByValue(players, func(p *Player) bool { return p.LostOne() })

	for _, p := range [][]int{wonAllPlayers, lostOnePlayers} {
		sort.Ints(p)
	}

	return [][]int{wonAllPlayers, lostOnePlayers}
}
