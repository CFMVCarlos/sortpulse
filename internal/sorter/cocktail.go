package sorter

import (
	"fmt"
	"time"
)

// CocktailSorter implements bidirectional Bubble Sort (Cocktail Shaker Sort).
type CocktailSorter struct{}

func (s *CocktailSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "cocktail",
		Name:            "Cocktail Shaker Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          true,
		Description:     "A bidirectional variation of bubble sort that traverses both forward and backward through the array, resolving turtle elements faster.",
	}
}

func (s *CocktailSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*len(arr)/2)

	n := len(arr)
	start := 0
	end := n - 1
	swapped := true

	for swapped {
		swapped = false

		// Forward pass (left to right)
		for i := start; i < end; i++ {
			descComp := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
			if tracer.Compare(i, i+1, descComp) {
				descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
				tracer.Swap(i, i+1, descSwap)
				swapped = true
			}
		}

		if !swapped {
			break
		}

		tracer.MarkSorted(end, fmt.Sprintf("Marked arr[%d] as sorted", end))
		end--
		swapped = false

		// Backward pass (right to left)
		for i := end - 1; i >= start; i-- {
			descComp := fmt.Sprintf("Comparing arr[%d] (%d) with arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
			if tracer.Compare(i, i+1, descComp) {
				descSwap := fmt.Sprintf("Swapping arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
				tracer.Swap(i, i+1, descSwap)
				swapped = true
			}
		}

		tracer.MarkSorted(start, fmt.Sprintf("Marked arr[%d] as sorted", start))
		start++
	}

	for k := start; k <= end; k++ {
		tracer.MarkSorted(k, fmt.Sprintf("Marked arr[%d] as sorted", k))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "cocktail",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
