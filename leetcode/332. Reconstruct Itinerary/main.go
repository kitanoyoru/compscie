package main

import "sort"

func reverseStringSlice(s []string) []string {
	n := len(s)

	for i := 0; i < n/2; i++ {
		s[i], s[n-1-i] = s[n-1-i], s[i]
	}

	return s
}

func findItinerary(tickets [][]string) []string {
	adj := make(map[string][]string)

	for _, ticket := range tickets {
		adj[ticket[0]] = append(adj[ticket[0]], ticket[1])
	}
	for key := range adj {
		sort.Sort(sort.Reverse(sort.StringSlice(adj[key])))
	}

	itinerary := []string{}

	var dfs func(string)
	dfs = func(airport string) {
		for len(adj[airport]) > 0 {
			next := adj[airport][len(adj[airport])-1]
			adj[airport] = adj[airport][:len(adj[airport])-1]
			dfs(next)
		}
		itinerary = append(itinerary, airport)
	}

	dfs("JFK")

	return reverseStringSlice(itinerary)
}
