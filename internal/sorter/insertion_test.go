package sorter

import (
	"sort"
	"testing"
)

func TestInsertionSorter(t *testing.T) {
	sorter := &InsertionSorter{}
	input := []int{5, 3, 8, 1, 9, 2}

	trace := sorter.Sort(input)

	if trace.Algorithm != "insertion" {
		t.Errorf("Expected algorithm 'insertion', got %s", trace.Algorithm)
	}

	if !sort.IntsAreSorted(trace.FinalArray) {
		t.Errorf("Expected sorted array, got %v", trace.FinalArray)
	}

	if len(trace.Steps) == 0 {
		t.Errorf("Expected steps to be recorded")
	}
}
