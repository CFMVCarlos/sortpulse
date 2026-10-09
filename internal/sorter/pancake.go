package sorter

import (
	"fmt"
	"time"
)

// PancakeSorter implements Pancake Sort using prefix flips.
type PancakeSorter struct{}

func (s *PancakeSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "pancake",
		Name:            "Pancake Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "Sorts the array using only prefix reversals (flips), repeatedly flipping the maximum unsorted element to the top of the stack and then into its final bottom position.",
	}
}

func (s *PancakeSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)

	// flip reverses arr[0..k]
	flip := func(k int) {
		start := 0
		for start < k {
			desc := fmt.Sprintf("Flipping prefix: swapping arr[%d] (%d) and arr[%d] (%d)", start, tracer.arr[start], k, tracer.arr[k])
			tracer.Swap(start, k, desc)
			start++
			k--
		}
	}

	for currSize := n; currSize > 1; currSize-- {
		// Find maximum element in arr[0..currSize-1]
		maxIdx := 0
		for i := 1; i < currSize; i++ {
			descComp := fmt.Sprintf("Comparing arr[%d] (%d) with current maximum arr[%d] (%d)", i, tracer.arr[i], maxIdx, tracer.arr[maxIdx])
			if tracer.Compare(i, maxIdx, descComp) {
				maxIdx = i
			}
		}

		if maxIdx != currSize-1 {
			// Flip max element to index 0 if not already there
			if maxIdx > 0 {
				flip(maxIdx)
			}
			// Flip max element to its target position currSize-1
			flip(currSize - 1)
		}

		tracer.MarkSorted(currSize-1, fmt.Sprintf("Marked arr[%d] as sorted", currSize-1))
	}

	if n > 0 {
		tracer.MarkSorted(0, "Marked arr[0] as sorted")
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "pancake",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
