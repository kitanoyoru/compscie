type Number interface {
	int | int32 | int64 | float32 | float64
}

func isEmpty[T Number](slice []T) bool {
	return len(slice) == 0
}

func abs[T Number](num T) T {
	if num < 0 {
		return -1 * num
	}

	return num
}

func asteroidCollision(asteroids []int) []int {
	afterCollisions := []int{}

	for _, asteroid := range asteroids {
		if isEmpty(afterCollisions) || asteroid > 0 {
			afterCollisions = append(afterCollisions, asteroid)
		} else {
			for !isEmpty(afterCollisions) && afterCollisions[len(afterCollisions)-1] > 0 && afterCollisions[len(afterCollisions)-1] < abs(asteroid) {
				afterCollisions = afterCollisions[:len(afterCollisions)-1]
			}

			if !isEmpty(afterCollisions) && afterCollisions[len(afterCollisions)-1] == abs(asteroid) {
				afterCollisions = afterCollisions[:len(afterCollisions)-1]
			} else {
				if isEmpty(afterCollisions) || afterCollisions[len(afterCollisions)-1] < 0 {
					afterCollisions = append(afterCollisions, asteroid)
				}
			}
		}
	}

	return afterCollisions
}
