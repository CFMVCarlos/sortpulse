package sorter

import (
	"sort"
	"testing"
)

func TestCountingSorter(t *testing.T) {
	sorter := &CountingSorter{}
	testCases := [][]int{
		{5, 3, 8, 1, 9, 2},
		{-5, 3, -8, 1, 0, -2, 4},
		{0, 0, 0},
	}

	for _, input := range testCases {
		trace := sorter.Sort(input)

		if trace.Algorithm != "counting" {
			t.Errorf("Expected algorithm 'counting', got %s", trace.Algorithm)
		}

		if !sort.IntsAreSorted(trace.FinalArray) {
			t.Errorf("Expected sorted array for input %v, got %v", input, trace.FinalArray)
		}

		if len(trace.Steps) == 0 {
			t.Errorf("Expected steps to be recorded for %v", input)
		}
	}
}
