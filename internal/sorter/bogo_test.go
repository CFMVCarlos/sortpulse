package sorter

import (
	"reflect"
	"sort"
	"testing"
)

func TestBogoSort(t *testing.T) {
	sorter := &BogoSorter{}

	tests := []struct {
		name        string
		input       []int
		minSteps    int
		checkSorted bool
	}{
		{
			name:        "empty slice",
			input:       []int{},
			minSteps:    0,
			checkSorted: true,
		},
		{
			name:        "single element slice",
			input:       []int{1},
			minSteps:    1,
			checkSorted: true,
		},
		{
			name:        "already sorted slice",
			input:       []int{1, 2, 3, 4},
			minSteps:    3,
			checkSorted: true,
		},
		{
			name:        "small unsorted slice",
			input:       []int{3, 1, 2},
			minSteps:    3,
			checkSorted: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			original := make([]int, len(tt.input))
			copy(original, tt.input)

			expected := make([]int, len(tt.input))
			copy(expected, tt.input)
			sort.Ints(expected)

			trace := sorter.Sort(original)

			if tt.checkSorted && !reflect.DeepEqual(trace.FinalArray, expected) {
				t.Errorf("FinalArray = %v, want %v", trace.FinalArray, expected)
			}

			if !reflect.DeepEqual(trace.InitialArray, tt.input) {
				t.Errorf("InitialArray = %v, want %v", trace.InitialArray, tt.input)
			}

			if len(tt.input) > 0 && trace.TotalSteps < tt.minSteps {
				t.Errorf("TotalSteps = %d, want at least %d", trace.TotalSteps, tt.minSteps)
			}

			n := len(tt.input)
			for i, step := range trace.Steps {
				for _, idx := range step.Indices {
					if idx < 0 || idx >= n {
						t.Errorf("Step %d has out of bounds index: %d (array length %d)", i, idx, n)
					}
				}
			}
		})
	}
}

func TestBogoSortSafetyLimit(t *testing.T) {
	sorter := &BogoSorter{}
	// Large reverse-sorted array that will hit the limit safely and terminate quickly
	input := []int{20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1}
	trace := sorter.Sort(input)

	if len(trace.Steps) == 0 {
		t.Fatalf("expected steps from BogoSort shuffle")
	}

	// Verify no panics or hangs, and indices are valid
	n := len(input)
	for i, step := range trace.Steps {
		for _, idx := range step.Indices {
			if idx < 0 || idx >= n {
				t.Errorf("Step %d has out of bounds index: %d (array length %d)", i, idx, n)
			}
		}
	}
}
