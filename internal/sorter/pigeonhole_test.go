package sorter

import (
	"reflect"
	"sort"
	"testing"
)

func TestPigeonholeSort(t *testing.T) {
	sorter := &PigeonholeSorter{}

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
			input:    []int{12},
			minSteps: 1,
		},
		{
			name:     "identical elements",
			input:    []int{3, 3, 3, 3},
			minSteps: 4,
		},
		{
			name:     "already sorted slice",
			input:    []int{1, 2, 3, 4, 5},
			minSteps: 5,
		},
		{
			name:     "reverse sorted slice",
			input:    []int{5, 4, 3, 2, 1},
			minSteps: 5,
		},
		{
			name:     "random unsorted slice",
			input:    []int{8, 3, 2, 7, 4, 6, 8},
			minSteps: 7,
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
