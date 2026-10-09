package sorter

import (
	"fmt"
	"time"
)

// PigeonholeSorter implements Pigeonhole Sort for integers with a bounded range.
type PigeonholeSorter struct{}

func (s *PigeonholeSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "pigeonhole",
		Name:            "Pigeonhole Sort",
		Category:        "distribution",
		BestTime:        "O(n + k)",
		AverageTime:     "O(n + k)",
		WorstTime:       "O(n + k)",
		SpaceComplexity: "O(k)",
		Stable:          true,
		Description:     "A non-comparison distribution sorting algorithm where each key is moved directly to its corresponding hole (bucket). In asymptotic notation, k is the range of key values (max - min + 1).",
	}
}

func (s *PigeonholeSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*6)

	n := len(arr)
	if n > 0 {
		minVal, maxVal := arr[0], arr[0]
		for i := 1; i < n; i++ {
			tracer.comps++
			tracer.steps = append(tracer.steps, Step{
				Type:        StepCompare,
				Indices:     []int{i},
				Description: fmt.Sprintf("Scanning arr[%d] (%d) to find min and max", i, arr[i]),
			})
			if arr[i] < minVal {
				minVal = arr[i]
			}
			if arr[i] > maxVal {
				maxVal = arr[i]
			}
		}

		rangeSize := maxVal - minVal + 1
		holes := make([][]int, rangeSize)

		for i := 0; i < n; i++ {
			val := arr[i]
			holeIdx := val - minVal
			holes[holeIdx] = append(holes[holeIdx], val)
			tracer.steps = append(tracer.steps, Step{
				Type:        StepCompare,
				Indices:     []int{i},
				Description: fmt.Sprintf("Placing arr[%d] (%d) into pigeonhole %d", i, val, holeIdx),
			})
		}

		dest := 0
		for h := 0; h < rangeSize; h++ {
			for _, val := range holes[h] {
				tracer.Overwrite(dest, val, fmt.Sprintf("Writing element %d from pigeonhole %d into arr[%d]", val, h, dest))
				tracer.MarkSorted(dest, fmt.Sprintf("arr[%d] is placed in sorted position", dest))
				dest++
			}
		}
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "pigeonhole",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
