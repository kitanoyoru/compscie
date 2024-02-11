package kata

import "strings"

const (
	LatinAlphabetLengh = 26

	ROT13Offset = 13
)

func Rot13(msg string) string {
	var sb strings.Builder

	for i := 0; i < len(msg); i++ {
		c := msg[i]

		switch {
		case c >= 'A' && c <= 'Z':
			sb.WriteByte((c-'A'+ROT13Offset)%LatinAlphabetLengh + 'A')
		case c >= 'a' && c <= 'z':
			sb.WriteByte((c-'a'+ROT13Offset)%LatinAlphabetLengh + 'a')
		default:
			sb.WriteByte(c)
		}
	}

	return sb.String()
}
