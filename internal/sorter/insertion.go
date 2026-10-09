package sorter

import (
	"fmt"
	"time"
)

// InsertionSorter implements comparison-based Insertion Sort.
type InsertionSorter struct{}

func (s *InsertionSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "insertion",
		Name:            "Insertion Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          true,
		Description:     "Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position in the sorted portion.",
	}
}

func (s *InsertionSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	for i := 1; i < n; i++ {
		tracer.Pivot(i, fmt.Sprintf("Selected arr[%d] (%d) to insert into sorted prefix", i, tracer.arr[i]))
		j := i
		for j > 0 {
			desc := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d)", j-1, tracer.arr[j-1], j, tracer.arr[j])
			if tracer.Compare(j-1, j, desc) {
				descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", j-1, tracer.arr[j-1], j, tracer.arr[j])
				tracer.Swap(j-1, j, descSwap)
				j--
			} else {
				break
			}
		}
	}

	// Once the entire array is sorted, mark all elements in a clean final sweep
	for i := 0; i < n; i++ {
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "insertion",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
