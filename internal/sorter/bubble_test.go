package sorter

import (
	"reflect"
	"sort"
	"testing"
)

func TestBubbleSort(t *testing.T) {
	sorter := &BubbleSorter{}

	tests := []struct {
		name     string
		input    []int
		minSteps int
	}{
		{
			name:     "empty slice",
			input:    []int{},
			minSteps: 0,
		},
		{
			name:     "single element slice",
			input:    []int{1},
			minSteps: 1, // Will mark the single element as sorted
		},
		{
			name:     "already sorted slice",
			input:    []int{1, 2, 3, 4, 5},
			minSteps: 5, // 4 compares + 5 mark_sorteds
		},
		{
			name:     "reverse sorted slice",
			input:    []int{5, 4, 3, 2, 1},
			minSteps: 15, // 10 compares + 10 swaps + 5 mark_sorteds = 25
		},
		{
			name:     "random unsorted slice",
			input:    []int{5, 3, 8, 1, 9, 2},
			minSteps: 10,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Make a copy to avoid mutating the original for verification
			original := make([]int, len(tt.input))
			copy(original, tt.input)

			// Expected final array using standard sort
			expected := make([]int, len(tt.input))
			copy(expected, tt.input)
			sort.Ints(expected)

			trace := sorter.Sort(original)

			if !reflect.DeepEqual(trace.FinalArray, expected) {
				t.Errorf("FinalArray = %v, want %v", trace.FinalArray, expected)
			}

			if !reflect.DeepEqual(trace.InitialArray, tt.input) {
				t.Errorf("InitialArray = %v, want %v", trace.InitialArray, tt.input)
			}

			if len(tt.input) > 0 && trace.TotalSteps < tt.minSteps {
				t.Errorf("TotalSteps = %d, want at least %d", trace.TotalSteps, tt.minSteps)
			}

			// Validate step indices
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
