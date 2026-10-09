package sorter

import (
	"fmt"
	"time"
)

// ShellSorter implements Shell Sort with diminishing gap increments.
type ShellSorter struct{}

func (s *ShellSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "shell",
		Name:            "Shell Sort",
		Category:        "comparison",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n^(4/3))",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "An optimization over insertion sort that allows exchanges of elements far apart using diminishing gap intervals before finishing with standard adjacent insertion.",
	}
}

func (s *ShellSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	for gap := n / 2; gap > 0; gap /= 2 {
		for i := gap; i < n; i++ {
			for j := i; j >= gap; j -= gap {
				descComp := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d) across gap %d", j-gap, tracer.arr[j-gap], j, tracer.arr[j], gap)
				if tracer.Compare(j-gap, j, descComp) {
					descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d) across gap %d", j-gap, tracer.arr[j-gap], j, tracer.arr[j], gap)
					tracer.Swap(j-gap, j, descSwap)
				} else {
					break
				}
			}
		}
	}

	for k := range n {
		tracer.MarkSorted(k, fmt.Sprintf("Marked arr[%d] as sorted", k))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "shell",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
