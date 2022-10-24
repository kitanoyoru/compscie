var seen []bool
func uniqueChars(s string) int {
    for _, c := range s { seen[c -'a'] = false }
    for _, c := range s {
        if seen[c-'a'] {
            return -1 
        }
        seen[c-'a'] = true
    }
    return len(s)
}

var max, n int
var strs []string
func maxConcat(i int, cur string) {
    l := uniqueChars(cur)
    switch {
        case i == n && l > max :
            max = l
            return
        case i == n || l == -1 :
            return
        default :
            maxConcat(i + 1, cur + strs[i])     // to be, 
            maxConcat(i + 1, cur)               // or not to be, that is the question!
    }
}

func maxLength(arr []string) int {
    strs, n, max, seen = arr, len(arr), 0, make([]bool, 26)
    maxConcat(0, "")
    return max   
}
