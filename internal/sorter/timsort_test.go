package sorter

import (
	"reflect"
	"sort"
	"testing"
)

func TestTimSort(t *testing.T) {
	sorter := &TimSorter{}

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
			name:     "small array (< 16)",
			input:    []int{9, 4, 1, 6, 8, 2},
			minSteps: 6,
		},
		{
			name:     "already sorted slice",
			input:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
			minSteps: 10,
		},
		{
			name:     "reverse sorted slice",
			input:    []int{10, 9, 8, 7, 6, 5, 4, 3, 2, 1},
			minSteps: 10,
		},
		{
			name: "large array spanning multiple runs (> 32)",
			input: []int{
				35, 12, 48, 2, 19, 87, 5, 64, 23, 91, 10, 44, 76, 3, 58, 29,
				14, 82, 6, 99, 31, 50, 7, 68, 41, 17, 85, 21, 60, 38, 9, 73,
				52, 1, 95, 27, 63, 11, 46, 80,
			},
			minSteps: 40,
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
