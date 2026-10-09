package sorter

import (
	"fmt"
	"time"
)

// SelectionSorter implements comparison-based Selection Sort.
type SelectionSorter struct{}

func (s *SelectionSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "selection",
		Name:            "Selection Sort",
		Category:        "comparison",
		BestTime:        "O(n²)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "A comparison-based in-place algorithm that repeatedly finds the minimum element from the unsorted sublist and moves it to the end of the sorted sublist.",
	}
}

func (s *SelectionSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*len(arr)/2)

	n := len(arr)
	for i := range n {
		minIdx := i
		for j := i + 1; j < n; j++ {
			desc := fmt.Sprintf("Comparing arr[%d] (%d) with current min arr[%d] (%d)", j, arr[j], minIdx, arr[minIdx])
			// Compare returns arr[i] > arr[j]
			if !tracer.Compare(j, minIdx, desc) {
				// We actually want to know if arr[j] < arr[minIdx], which means arr[minIdx] > arr[j]
			}
			// Let's do it manually because Compare returns arr[x] > arr[y]
			// We want to know if arr[j] < arr[minIdx], so Compare(minIdx, j, desc) returns true if arr[minIdx] > arr[j]
			if tracer.Compare(minIdx, j, desc) {
				minIdx = j
			}
		}
		if minIdx != i {
			descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", i, arr[i], minIdx, arr[minIdx])
			tracer.Swap(i, minIdx, descSwap)
		}
		tracer.MarkSorted(i, fmt.Sprintf("Marked arr[%d] as sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "selection",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
