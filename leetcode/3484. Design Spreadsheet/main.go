package main

import (
	"strconv"
	"strings"
)

type Spreadsheet struct {
	cells map[string]map[int]int
}

func Constructor(rows int) Spreadsheet {
	columns := getColumns()

	cells := make(map[string]map[int]int, len(columns))

	for _, column := range columns {
		if cells[column] == nil {
			cells[column] = make(map[int]int, rows)
		}

		for row := 0; row < rows; row++ {
			cells[column][row] = 0
		}
	}

	return Spreadsheet{
		cells,
	}
}

func (this *Spreadsheet) SetCell(cell string, value int) {
	column := string(cell[0])
	row, _ := strconv.Atoi(cell[1:])

	this.cells[column][row] = value
}

func (this *Spreadsheet) ResetCell(cell string) {
	column := string(cell[0])
	row, _ := strconv.Atoi(cell[1:])

	this.cells[column][row] = 0
}

func (this *Spreadsheet) GetValue(formula string) int {
	values := strings.Split(formula[1:], "+")
	left, right := values[0], values[1]

	var (
		leftValue, rightValue int
		err                   error
	)

	leftValue, err = strconv.Atoi(left)
	if err != nil {
		column := string(left[0])
		row, _ := strconv.Atoi(left[1:])

		leftValue = this.cells[column][row]
	}

	rightValue, err = strconv.Atoi(right)
	if err != nil {
		column := string(right[0])
		row, _ := strconv.Atoi(right[1:])

		rightValue = this.cells[column][row]
	}

	return leftValue + rightValue
}

func getColumns() [26]string {
	var columns [26]string
	for i := 0; i < 26; i++ {
		columns[i] = string(rune('A' + i))
	}

	return columns
}

/**
 * Your Spreadsheet object will be instantiated and called as such:
 * obj := Constructor(rows);
 * obj.SetCell(cell,value);
 * obj.ResetCell(cell);
 * param_3 := obj.GetValue(formula);
 */
