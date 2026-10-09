package sorter

import (
	"sort"
	"testing"
)

func TestGnomeSorter(t *testing.T) {
	sorter := &GnomeSorter{}
	input := []int{5, 3, 8, 1, 9, 2, 7, 4, 6}

	trace := sorter.Sort(input)

	if trace.Algorithm != "gnome" {
		t.Errorf("Expected algorithm 'gnome', got %s", trace.Algorithm)
	}

	if !sort.IntsAreSorted(trace.FinalArray) {
		t.Errorf("Expected sorted array, got %v", trace.FinalArray)
	}

	if len(trace.Steps) == 0 {
		t.Errorf("Expected steps to be recorded")
	}
}
