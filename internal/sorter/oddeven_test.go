package sorter

import (
	"sort"
	"testing"
)

func TestOddEvenSorter(t *testing.T) {
	sorter := &OddEvenSorter{}
	input := []int{5, 3, 8, 1, 9, 2, 7, 4, 6}

	trace := sorter.Sort(input)

	if trace.Algorithm != "oddeven" {
		t.Errorf("Expected algorithm 'oddeven', got %s", trace.Algorithm)
	}

	if !sort.IntsAreSorted(trace.FinalArray) {
		t.Errorf("Expected sorted array, got %v", trace.FinalArray)
	}

	if len(trace.Steps) == 0 {
		t.Errorf("Expected steps to be recorded")
	}
}
