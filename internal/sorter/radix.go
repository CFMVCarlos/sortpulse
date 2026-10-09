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
		BestTime:        "O(d · (n + k))",
		AverageTime:     "O(d · (n + k))",
		WorstTime:       "O(d · (n + k))",
		SpaceComplexity: "O(n + k)",
		Stable:          true,
		Description:     "A non-comparison distribution algorithm that sorts integers digit by digit, from least significant to most significant digit, using a stable counting sort subroutine.",
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
		min := arr[0]
		for _, v := range arr {
			if v < min {
				min = v
			}
		}

		offset := 0
		if min < 0 {
			offset = -min
			for i := range tracer.arr {
				tracer.arr[i] += offset
			}
		}

		max := tracer.arr[0]
		for i := 1; i < len(tracer.arr); i++ {
			if tracer.arr[i] > max {
				max = tracer.arr[i]
			}
		}

		for exp := 1; max/exp > 0; exp *= 10 {
			countSort(tracer, exp)
		}

		if offset > 0 {
			for i := range tracer.arr {
				actualVal := tracer.arr[i] - offset
				tracer.Overwrite(i, actualVal, fmt.Sprintf("Restoring arr[%d] to original offset value %d", i, actualVal))
			}
		}

		for i := range arr {
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

	for i := range n {
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

	for i := range n {
		if tracer.arr[i] != output[i] {
			descOverwrite := fmt.Sprintf("Overwriting arr[%d] with %d for digit place %d", i, output[i], exp)
			tracer.Overwrite(i, output[i], descOverwrite)
		}
	}
}
