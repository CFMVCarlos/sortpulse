package sorter

import (
	"reflect"
	"sort"
	"testing"
)

func TestIntroSort(t *testing.T) {
	sorter := &IntroSorter{}

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
			minSteps: 1,
		},
		{
			name:     "two elements slice",
			input:    []int{7, 2},
			minSteps: 2,
		},
		{
			name:     "already sorted slice",
			input:    []int{1, 2, 3, 4, 5, 6, 7, 8},
			minSteps: 8,
		},
		{
			name:     "reverse sorted slice",
			input:    []int{8, 7, 6, 5, 4, 3, 2, 1},
			minSteps: 16,
		},
		{
			name:     "random unsorted slice (medium)",
			input:    []int{12, 5, 18, 2, 9, 1, 14, 8, 3, 20, 6, 11, 4, 15, 17, 7, 10, 13, 19, 16},
			minSteps: 20,
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

			if !reflect.DeepEqual(trace.FinalArray, expected) {
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
