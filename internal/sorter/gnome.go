package sorter

import (
	"fmt"
	"time"
)

// GnomeSorter implements Gnome Sort (stupid sort variant similar to insertion sort).
type GnomeSorter struct{}

func (s *GnomeSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "gnome",
		Name:            "Gnome Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          true,
		Description:     "Iterates through the array like a garden gnome inspecting flowerpots: stepping forward when elements are ordered and stepping backward swapping when an inversion is spotted.",
	}
}

func (s *GnomeSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*len(arr)/2)

	n := len(arr)
	pos := 0

	for pos < n {
		if pos == 0 {
			pos++
			continue
		}

		descComp := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d)", pos-1, tracer.arr[pos-1], pos, tracer.arr[pos])
		if tracer.Compare(pos-1, pos, descComp) {
			descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", pos-1, tracer.arr[pos-1], pos, tracer.arr[pos])
			tracer.Swap(pos-1, pos, descSwap)
			pos--
		} else {
			pos++
		}
	}

	for k := range n {
		tracer.MarkSorted(k, fmt.Sprintf("Marked arr[%d] as sorted", k))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "gnome",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
