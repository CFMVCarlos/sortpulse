package sorter

import (
	"fmt"
	"time"
)

type CountingSorter struct{}

func (s *CountingSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "counting",
		Name:            "Counting Sort",
		Category:        "distribution",
		BestTime:        "O(n + k)",
		AverageTime:     "O(n + k)",
		WorstTime:       "O(n + k)",
		SpaceComplexity: "O(k)",
		Stable:          true,
		Description:     "An integer sorting algorithm that operates by counting the number of objects that possess distinct key values, and applying prefix sum to find the position of each key.",
	}
}

func (s *CountingSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	if len(arr) > 0 {
		max := arr[0]
		for i := 1; i < len(arr); i++ {
			if arr[i] > max {
				max = arr[i]
			}
		}

		count := make([]int, max+1)
		for i := 0; i < len(arr); i++ {
			count[arr[i]]++
		}

		idx := 0
		for i := 0; i <= max; i++ {
			for count[i] > 0 {
				descOverwrite := fmt.Sprintf("Overwriting arr[%d] with %d", idx, i)
				tracer.Overwrite(idx, i, descOverwrite)
				tracer.MarkSorted(idx, fmt.Sprintf("arr[%d] is placed in sorted position", idx))
				idx++
				count[i]--
			}
		}
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "counting",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
