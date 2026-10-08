package sorter

import (
	"sort"
	"testing"
)

func TestRadixSorter(t *testing.T) {
	sorter := &RadixSorter{}
	testCases := [][]int{
		{5, 3, 8, 1, 9, 2},
		{-50, 20, -10, 0, 45, -3, 8},
		{1, 2, 3},
	}

	for _, input := range testCases {
		trace := sorter.Sort(input)

		if trace.Algorithm != "radix" {
			t.Errorf("Expected algorithm 'radix', got %s", trace.Algorithm)
		}

		if !sort.IntsAreSorted(trace.FinalArray) {
			t.Errorf("Expected sorted array for input %v, got %v", input, trace.FinalArray)
		}

		if len(trace.Steps) == 0 {
			t.Errorf("Expected steps to be recorded for %v", input)
		}
	}
}
