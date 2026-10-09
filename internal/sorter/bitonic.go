package sorter

import (
	"fmt"
	"time"
)

// BitonicSorter implements Bitonic Sort, a classic parallel sorting network algorithm.
type BitonicSorter struct{}

func (s *BitonicSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "bitonic",
		Name:            "Bitonic Sort",
		Category:        "comparison",
		BestTime:        "O(n log² n)",
		AverageTime:     "O(n log² n)",
		WorstTime:       "O(n log² n)",
		SpaceComplexity: "O(log² n)",
		Stable:          false,
		Description:     "A parallel sorting network algorithm that converts arbitrary sequences into bitonic sequences (monotonically increasing then decreasing) and recursively merges them.",
	}
}

func (s *BitonicSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	if n > 1 {
		var bitonicMerge func(low, count int, dir bool)
		bitonicMerge = func(low, count int, dir bool) {
			if count <= 1 {
				return
			}

			// Greatest power of 2 strictly less than count
			k := 1
			for k*2 < count {
				k *= 2
			}

			for i := low; i < low+count-k; i++ {
				j := i + k
				desc := fmt.Sprintf("Bitonic compare: arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], j, tracer.arr[j])
				isGreater := tracer.Compare(i, j, desc)
				// If dir is true (ascending), we want arr[i] <= arr[j]. If isGreater, swap.
				// If dir is false (descending), we want arr[i] >= arr[j]. If !isGreater and not equal, swap.
				if (dir && isGreater) || (!dir && !isGreater && tracer.arr[i] != tracer.arr[j]) {
					tracer.Swap(i, j, fmt.Sprintf("Bitonic swap: exchanging arr[%d] and arr[%d]", i, j))
				}
			}

			bitonicMerge(low, k, dir)
			bitonicMerge(low+k, count-k, dir)
		}

		var bitonicSort func(low, count int, dir bool)
		bitonicSort = func(low, count int, dir bool) {
			if count <= 1 {
				return
			}

			k := count / 2
			bitonicSort(low, k, !dir)
			bitonicSort(low+k, count-k, dir)
			bitonicMerge(low, count, dir)
		}

		bitonicSort(0, n, true)
	}

	for i := range arr {
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "bitonic",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
