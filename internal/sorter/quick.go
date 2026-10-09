package sorter

import (
	"fmt"
	"time"
)

// QuickSorter implements divide-and-conquer Quicksort with pivot tracing.
type QuickSorter struct{}

func (s *QuickSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "quick",
		Name:            "Quicksort",
		Category:        "comparison",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n log n)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(log n)",
		Stable:          false,
		Description:     "A divide-and-conquer comparison algorithm that selects a pivot, partitions the array so smaller elements precede larger ones, and recursively sorts each partition.",
	}
}

func (s *QuickSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	var quicksort func(low, high int)
	quicksort = func(low, high int) {
		if low < high {
			pi := partition(tracer, low, high)
			tracer.MarkSorted(pi, fmt.Sprintf("Pivot arr[%d] is in its final sorted position", pi))
			quicksort(low, pi-1)
			quicksort(pi+1, high)
		} else if low == high {
			tracer.MarkSorted(low, fmt.Sprintf("arr[%d] is sorted", low))
		}
	}

	quicksort(0, len(arr)-1)

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "quick",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func partition(tracer *Tracer, low, high int) int {
	pivotIdx := high
	tracer.Pivot(pivotIdx, fmt.Sprintf("Selected arr[%d] (%d) as pivot", pivotIdx, tracer.arr[pivotIdx]))

	i := low - 1
	for j := low; j < high; j++ {
		desc := fmt.Sprintf("Comparing arr[%d] (%d) with pivot arr[%d] (%d)", j, tracer.arr[j], pivotIdx, tracer.arr[pivotIdx])
		// We want arr[j] < arr[pivotIdx], so we check if arr[pivotIdx] > arr[j]
		if tracer.Compare(pivotIdx, j, desc) {
			i++
			if i != j {
				descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], j, tracer.arr[j])
				tracer.Swap(i, j, descSwap)
			}
		}
	}
	if i+1 != high {
		descSwap := fmt.Sprintf("Swapping pivot arr[%d] (%d) to its correct position arr[%d]", high, tracer.arr[high], i+1)
		tracer.Swap(i+1, high, descSwap)
	}
	return i + 1
}
