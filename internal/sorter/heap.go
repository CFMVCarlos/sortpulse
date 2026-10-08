package sorter

import (
	"fmt"
	"time"
)

type HeapSorter struct{}

func (s *HeapSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "heap",
		Name:            "Heap Sort",
		Category:        "comparison",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n log n)",
		WorstTime:       "O(n log n)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "Comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end.",
	}
}

func (s *HeapSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)

	for i := n/2 - 1; i >= 0; i-- {
		heapify(tracer, n, i)
	}

	for i := n - 1; i > 0; i-- {
		descSwap := fmt.Sprintf("Swapping current root arr[%d] (%d) to the end arr[%d] (%d)", 0, tracer.arr[0], i, tracer.arr[i])
		tracer.Swap(0, i, descSwap)
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted", i))
		heapify(tracer, i, 0)
	}
	if n > 0 {
		tracer.MarkSorted(0, "arr[0] is sorted")
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "heap",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func heapify(tracer *Tracer, n, i int) {
	largest := i
	l := 2*i + 1
	r := 2*i + 2

	if l < n {
		desc := fmt.Sprintf("Comparing left child arr[%d] (%d) with largest arr[%d] (%d)", l, tracer.arr[l], largest, tracer.arr[largest])
		// Check if arr[l] > arr[largest]
		if tracer.Compare(l, largest, desc) {
			largest = l
		}
	}

	if r < n {
		desc := fmt.Sprintf("Comparing right child arr[%d] (%d) with largest arr[%d] (%d)", r, tracer.arr[r], largest, tracer.arr[largest])
		if tracer.Compare(r, largest, desc) {
			largest = r
		}
	}

	if largest != i {
		descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d) to maintain heap property", i, tracer.arr[i], largest, tracer.arr[largest])
		tracer.Swap(i, largest, descSwap)
		heapify(tracer, n, largest)
	}
}
