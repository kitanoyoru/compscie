func isPalindrome(x int) bool {
	n, rev := x, 0

	for n > 0 {
		rev = rev*10 + n%10
		n /= 10
	}

	return rev == x
}
