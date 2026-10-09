package sorter

import (
	"fmt"
	"time"
)

// CombSorter implements Comb Sort with a 1.3 shrink factor.
type CombSorter struct{}

func (s *CombSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "comb",
		Name:            "Comb Sort",
		Category:        "comparison",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n² / 2^p)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "An improvement on bubble sort that eliminates small values near the end (turtles) by comparing elements separated by a gap that shrinks by a factor of 1.3 each pass.",
	}
}

func (s *CombSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	gap := n
	shrink := 1.3
	swapped := true

	for gap > 1 || swapped {
		gap = max(1, int(float64(gap)/shrink))

		swapped = false
		for i := 0; i+gap < n; i++ {
			descComp := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d) across gap %d", i, tracer.arr[i], i+gap, tracer.arr[i+gap], gap)
			if tracer.Compare(i, i+gap, descComp) {
				descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d) across gap %d", i, tracer.arr[i], i+gap, tracer.arr[i+gap], gap)
				tracer.Swap(i, i+gap, descSwap)
				swapped = true
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
		Algorithm:       "comb",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
