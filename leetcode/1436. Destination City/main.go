// Solved by @kitanoyoru

package main

func destCity(paths [][]string) string {
	m := make(map[string]bool)

	for _, path := range paths {
		m[path[0]] = true
		if _, ok := m[path[1]]; !ok {
			m[path[1]] = false
		}
	}

	for k, v := range m {
		if !v {
			return k
		}
	}

	return ""
}
