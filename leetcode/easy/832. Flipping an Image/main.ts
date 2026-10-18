function flipAndInvertImage(image: number[][]): number[][] {
  return image.map((row) => row.reverse().map((value) => 1 - value))
}
