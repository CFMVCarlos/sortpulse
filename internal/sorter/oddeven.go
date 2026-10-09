package sorter

import (
	"fmt"
	"time"
)

// OddEvenSorter implements Odd-Even Sort (Brick Sort).
type OddEvenSorter struct{}

func (s *OddEvenSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "oddeven",
		Name:            "Odd-Even Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          true,
		Description:     "A parallel-oriented variation of bubble sort that alternates between comparing odd-indexed adjacent pairs and even-indexed adjacent pairs.",
	}
}

func (s *OddEvenSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	sorted := false

	for !sorted {
		sorted = true

		// Odd phase
		for i := 1; i < n-1; i += 2 {
			descComp := fmt.Sprintf("Odd phase: comparing arr[%d] (%d) with arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
			if tracer.Compare(i, i+1, descComp) {
				descSwap := fmt.Sprintf("Odd phase: swapping arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
				tracer.Swap(i, i+1, descSwap)
				sorted = false
			}
		}

		// Even phase
		for i := 0; i < n-1; i += 2 {
			descComp := fmt.Sprintf("Even phase: comparing arr[%d] (%d) with arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
			if tracer.Compare(i, i+1, descComp) {
				descSwap := fmt.Sprintf("Even phase: swapping arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
				tracer.Swap(i, i+1, descSwap)
				sorted = false
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
		Algorithm:       "oddeven",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
