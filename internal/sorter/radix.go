package sorter

import (
	"fmt"
	"time"
)

type RadixSorter struct{}

func (s *RadixSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "radix",
		Name:            "Radix Sort",
		Category:        "distribution",
		BestTime:        "O(nk)",
		AverageTime:     "O(nk)",
		WorstTime:       "O(nk)",
		SpaceComplexity: "O(n + k)",
		Stable:          true,
		Description:     "Sorts the elements by processing individual digits. It sorts the elements digit by digit, from least significant to most significant.",
	}
}

func (s *RadixSorter) Sort(input []int) Trace {
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

		for exp := 1; max/exp > 0; exp *= 10 {
			countSort(tracer, exp)
		}

		for i := 0; i < len(arr); i++ {
			tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is fully sorted", i))
		}
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "radix",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func countSort(tracer *Tracer, exp int) {
	n := len(tracer.arr)
	output := make([]int, n)
	count := make([]int, 10)

	for i := 0; i < n; i++ {
		count[(tracer.arr[i]/exp)%10]++
	}

	for i := 1; i < 10; i++ {
		count[i] += count[i-1]
	}

	for i := n - 1; i >= 0; i-- {
		idx := (tracer.arr[i] / exp) % 10
		output[count[idx]-1] = tracer.arr[i]
		count[idx]--
	}

	for i := 0; i < n; i++ {
		if tracer.arr[i] != output[i] {
			descOverwrite := fmt.Sprintf("Overwriting arr[%d] with %d for digit place %d", i, output[i], exp)
			tracer.Overwrite(i, output[i], descOverwrite)
		}
	}
}
