package main

func areAlmostEqual(s1 string, s2 string) bool {
	if s1 == s2 {
		return true
	}

	var diffIndices []int

	for i := range s1 {
		if s1[i] != s2[i] {
			diffIndices = append(diffIndices, i)
		}
	}

	return len(diffIndices) == 2 && s1[diffIndices[0]] == s2[diffIndices[1]] && s1[diffIndices[1]] == s2[diffIndices[0]]
}

