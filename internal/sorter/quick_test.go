package sorter

import (
	"sort"
	"testing"
)

func TestQuickSorter(t *testing.T) {
	sorter := &QuickSorter{}
	input := []int{5, 3, 8, 1, 9, 2}

	trace := sorter.Sort(input)

	if trace.Algorithm != "quick" {
		t.Errorf("Expected algorithm 'quick', got %s", trace.Algorithm)
	}

	if !sort.IntsAreSorted(trace.FinalArray) {
		t.Errorf("Expected sorted array, got %v", trace.FinalArray)
	}

	if len(trace.Steps) == 0 {
		t.Errorf("Expected steps to be recorded")
	}
}
