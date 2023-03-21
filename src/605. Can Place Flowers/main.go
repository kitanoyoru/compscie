package main

func canPlaceFlowers(flowerbed []int, n int) bool {
	if n == 0 {
		return true
	}
	for i := 0; i < len(flowerbed); i++ {
		if flowerbed[i] == 0 {
			prevIsZero := i == 0 || flowerbed[i-1] == 0
			nextIsZero := i == len(flowerbed)-1 || flowerbed[i+1] == 0
			if prevIsZero && nextIsZero {
				flowerbed[i] = 1
				n--
				if n == 0 {
					return true
				}
			}
		}
	}

	return false
}
