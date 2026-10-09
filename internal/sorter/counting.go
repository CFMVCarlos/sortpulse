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
		Description:     "A non-comparison distribution sorting algorithm that counts occurrences of each distinct integer key within range k (max - min + 1) to determine output positions.",
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
		min, max := arr[0], arr[0]
		for i := 1; i < len(arr); i++ {
			if arr[i] < min {
				min = arr[i]
			}
			if arr[i] > max {
				max = arr[i]
			}
		}

		rangeSize := max - min + 1
		count := make([]int, rangeSize)
		for i := range arr {
			count[arr[i]-min]++
		}

		idx := 0
		for i := range rangeSize {
			for count[i] > 0 {
				val := i + min
				descOverwrite := fmt.Sprintf("Overwriting arr[%d] with %d", idx, val)
				tracer.Overwrite(idx, val, descOverwrite)
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
