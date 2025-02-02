package main

import (
	"strconv"
	"strings"
)

func restoreIpAddresses(s string) []string {
	var ips []string

	var backtrack func(ip []string, str string)
	backtrack = func(ip []string, str string) {
		if len(ip) == 4 {
			if str == "" {
				ips = append(ips, strings.Join(ip, "."))
			}
			return
		}

		for i := 1; i <= 3 && i <= len(str); i++ {
			substr := str[:i]

			if isValid(substr) {
				backtrack(append(ip, substr), str[i:])
			}
		}
	}

	backtrack([]string{}, s)
	return ips
}

func isValid(num string) bool {
	if len(num) == 0 || (len(num) > 1 && num[0] == '0') {
		return false
	}

	pNum, err := strconv.Atoi(num)
	if err != nil || pNum > 255 {
		return false
	}

	return true
}
