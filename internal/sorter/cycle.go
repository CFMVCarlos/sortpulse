package sorter

import (
	"fmt"
	"time"
)

// CycleSorter implements Cycle Sort, theoretically optimal in memory writes.
type CycleSorter struct{}

func (s *CycleSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "cycle",
		Name:            "Cycle Sort",
		Category:        "comparison",
		BestTime:        "O(n²)",
		AverageTime:     "O(n²)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "An in-place comparison sort that is theoretically optimal in total writes to the array, decomposing the permutation into cycles.",
	}
}

func (s *CycleSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)

	for cycleStart := 0; cycleStart < n-1; cycleStart++ {
		item := tracer.arr[cycleStart]
		pos := cycleStart

		// Find where to put item
		for i := cycleStart + 1; i < n; i++ {
			descComp := fmt.Sprintf("Comparing arr[%d] (%d) with cycle item %d", i, tracer.arr[i], item)
			tracer.comps++
			tracer.steps = append(tracer.steps, Step{
				Type:        StepCompare,
				Indices:     []int{i, cycleStart},
				Description: descComp,
			})
			if tracer.arr[i] < item {
				pos++
			}
		}

		if pos == cycleStart {
			tracer.MarkSorted(cycleStart, fmt.Sprintf("Marked arr[%d] as sorted", cycleStart))
			continue
		}

		// Skip duplicate values
		for item == tracer.arr[pos] {
			pos++
		}

		// Put item into its right position
		if pos != cycleStart {
			descWrite := fmt.Sprintf("Overwriting arr[%d] with cycle item %d", pos, item)
			temp := tracer.arr[pos]
			tracer.Overwrite(pos, item, descWrite)
			item = temp
			tracer.swaps++
		}

		// Rotate rest of the cycle
		for pos != cycleStart {
			pos = cycleStart
			for i := cycleStart + 1; i < n; i++ {
				descComp := fmt.Sprintf("Cycle rotation: comparing arr[%d] (%d) with item %d", i, tracer.arr[i], item)
				tracer.comps++
				tracer.steps = append(tracer.steps, Step{
					Type:        StepCompare,
					Indices:     []int{i, cycleStart},
					Description: descComp,
				})
				if tracer.arr[i] < item {
					pos++
				}
			}

			for item == tracer.arr[pos] {
				pos++
			}

			if item != tracer.arr[pos] {
				descWrite := fmt.Sprintf("Overwriting arr[%d] with cycle item %d", pos, item)
				temp := tracer.arr[pos]
				tracer.Overwrite(pos, item, descWrite)
				item = temp
				tracer.swaps++
			}
		}

		tracer.MarkSorted(cycleStart, fmt.Sprintf("Marked arr[%d] as sorted", cycleStart))
	}

	if n > 0 {
		tracer.MarkSorted(n-1, fmt.Sprintf("Marked arr[%d] as sorted", n-1))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "cycle",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
