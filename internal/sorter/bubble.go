package sorter

import (
	"fmt"
	"time"
)

// BubbleSorter implements comparison-based Bubble Sort.
type BubbleSorter struct{}

func (s *BubbleSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "bubble",
		Name:            "Bubble Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          true,
		Description:     "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
	}
}

func (s *BubbleSorter) Sort(input []int) Trace {
	startTime := time.Now()

	// Create a copy for the tracer
	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	for i := 0; i < n; i++ {
		swapped := false
		for j := 0; j < n-i-1; j++ {
			desc := fmt.Sprintf("Comparing array[%d] (%d) with array[%d] (%d)", j, arr[j], j+1, arr[j+1])
			if tracer.Compare(j, j+1, desc) {
				desc = fmt.Sprintf("Swapping array[%d] (%d) with array[%d] (%d)", j, arr[j], j+1, arr[j+1])
				tracer.Swap(j, j+1, desc)
				swapped = true
			}
		}

		if n-i-1 >= 0 {
			tracer.MarkSorted(n-i-1, fmt.Sprintf("Marked array[%d] as sorted", n-i-1))
		}

		if !swapped {
			for k := 0; k < n-i-1; k++ {
				tracer.MarkSorted(k, fmt.Sprintf("Marked array[%d] as sorted (early exit)", k))
			}
			break
		}
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "bubble",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
