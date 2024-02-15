package kata

import (
	"fmt"
	"math"
	"strings"
)

func SumOfDivided(lst []int) string {
	var sb strings.Builder

	maxNum := int(math.Abs(float64(lst[0])))
	for _, num := range lst {
		absNum := int(math.Abs(float64(num)))
		if absNum > maxNum {
			maxNum = absNum
		}
	}

	isPrime := make([]bool, maxNum+1)
	for i := 2; i <= maxNum; i++ {
		isPrime[i] = true
	}
	for i := 2; i <= int(math.Sqrt(float64(maxNum))); i++ {
		if isPrime[i] {
			for j := i * i; j <= maxNum; j += i {
				isPrime[j] = false
			}
		}
	}

	for i := 2; i <= maxNum; i++ {
		if isPrime[i] {
			sum := 0
			isFactor := false

			for _, num := range lst {
				if num%i == 0 {
					sum += num
					isFactor = true
				}
			}

			if isFactor {
				_, err := sb.WriteString(fmt.Sprintf("(%d %d)", i, sum))
				if err != nil {
					panic(err)
				}
			}
		}
	}

	return sb.String()
}
