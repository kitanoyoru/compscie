package kata

func DirReduc(arr []string) []string {
	opposites := map[string]string{
		"NORTH": "SOUTH",
		"SOUTH": "NORTH",
		"EAST":  "WEST",
		"WEST":  "EAST",
	}

	var res []string
	for _, d := range arr {
		if len(res) > 0 && opposites[d] == res[len(res)-1] {
			res = res[:len(res)-1]
		} else {
			res = append(res, d)
		}
	}

	return res
}
