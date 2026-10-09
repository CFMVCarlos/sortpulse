package sorter

import (
	"math/rand"
	"reflect"
	"sort"
	"testing"
	"time"
)

func TestAllRegisteredAlgorithms(t *testing.T) {
	algorithms := List()
	if len(algorithms) == 0 {
		t.Fatal("no algorithms registered")
	}

	testCases := []struct {
		name  string
		input []int
	}{
		{"empty", []int{}},
		{"single", []int{42}},
		{"two_sorted", []int{1, 2}},
		{"two_reversed", []int{2, 1}},
		{"two_equal", []int{5, 5}},
		{"all_identical", []int{7, 7, 7, 7, 7, 7}},
		{"already_sorted", []int{1, 2, 3, 4, 5, 6, 7, 8}},
		{"reverse_sorted", []int{8, 7, 6, 5, 4, 3, 2, 1}},
		{"perm_3_1", []int{1, 2, 3}},
		{"perm_3_2", []int{1, 3, 2}},
		{"perm_3_3", []int{2, 1, 3}},
		{"perm_3_4", []int{2, 3, 1}},
		{"perm_3_5", []int{3, 1, 2}},
		{"perm_3_6", []int{3, 2, 1}},
		{"random_15", []int{14, 3, 8, 1, 15, 9, 2, 7, 4, 6, 12, 11, 5, 10, 13}},
	}

	for _, meta := range algorithms {
		s, ok := Get(meta.ID)
		if !ok {
			t.Errorf("algorithm %s in List() but not Get()", meta.ID)
			continue
		}

		t.Run(meta.Name, func(t *testing.T) {
			for _, tc := range testCases {
				// Bogo sort on arrays > 3 is non-deterministic and can hit iteration limit
				if meta.ID == "bogo" && len(tc.input) > 3 {
					continue
				}

				// Negative numbers or large non-zero offset checks for distribution sorts if any
				inputCopy := make([]int, len(tc.input))
				copy(inputCopy, tc.input)

				expected := make([]int, len(tc.input))
				copy(expected, tc.input)
				sort.Ints(expected)

				trace := s.Sort(inputCopy)

				// 1. Verify sorted output
				if !reflect.DeepEqual(trace.FinalArray, expected) {
					t.Errorf("[%s] %s failed: got %v, want %v", meta.Name, tc.name, trace.FinalArray, expected)
				}

				// 2. Verify initial array preserved
				if !reflect.DeepEqual(trace.InitialArray, tc.input) {
					t.Errorf("[%s] %s modified InitialArray: got %v, want %v", meta.Name, tc.name, trace.InitialArray, tc.input)
				}

				// 3. Verify step indices within bounds
				n := len(tc.input)
				for stepIdx, step := range trace.Steps {
					for _, idx := range step.Indices {
						if idx < 0 || idx >= n {
							t.Errorf("[%s] %s step %d (%s) out of bounds index: %d (len %d)", meta.Name, tc.name, stepIdx, step.Type, idx, n)
						}
					}
				}
			}
		})
	}
}

func TestRandomArraysAllAlgorithms(t *testing.T) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	algorithms := List()

	for _, meta := range algorithms {
		if meta.ID == "bogo" {
			continue // skip bogo on random arrays of size 20
		}

		s, ok := Get(meta.ID)
		if !ok {
			t.Fatalf("algorithm %s not found", meta.ID)
		}

		t.Run(meta.Name, func(t *testing.T) {
			for trial := 0; trial < 10; trial++ {
				size := rng.Intn(25) + 5 // 5 to 30 elements
				arr := make([]int, size)
				for i := 0; i < size; i++ {
					arr[i] = rng.Intn(100) // values 0 to 99
				}

				expected := make([]int, size)
				copy(expected, arr)
				sort.Ints(expected)

				trace := s.Sort(arr)

				if !reflect.DeepEqual(trace.FinalArray, expected) {
					t.Fatalf("[%s] trial %d failed: got %v, want %v", meta.Name, trial, trace.FinalArray, expected)
				}

				for stepIdx, step := range trace.Steps {
					for _, idx := range step.Indices {
						if idx < 0 || idx >= size {
							t.Fatalf("[%s] step %d has index %d out of bounds (size %d)", meta.Name, stepIdx, idx, size)
						}
					}
				}
			}
		})
	}
}
