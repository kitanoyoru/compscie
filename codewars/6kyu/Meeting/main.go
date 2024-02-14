package kata

import (
	"fmt"
	"sort"
	"strings"
)

func Meeting(s string) string {
	names := strings.Split(s, ";")

	splittedNames := make([][]string, 0, len(names))
	for _, v := range names {
		splittedNames = append(splittedNames, strings.Split(strings.ToUpper(v), ":"))
	}

	sort.Slice(splittedNames, func(i, j int) bool {
		if splittedNames[i][1] == splittedNames[j][1] {
			return splittedNames[i][0] < splittedNames[j][0]
		}

		return splittedNames[i][1] < splittedNames[j][1]
	})

	res := make([]string, 0, len(splittedNames))
	for _, v := range splittedNames {
		res = append(res, fmt.Sprintf("(%s, %s)", v[1], v[0]))
	}

	return strings.Join(res, "")
}
