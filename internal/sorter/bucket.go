package sorter

import (
	"fmt"
	"sort"
	"time"
)

// BucketSorter implements Bucket Sort by distributing elements into buckets, sorting them, and concatenating.
type BucketSorter struct{}

func (s *BucketSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "bucket",
		Name:            "Bucket Sort",
		Category:        "distribution",
		BestTime:        "O(n + k)",
		AverageTime:     "O(n + k)",
		WorstTime:       "O(n²)",
		SpaceComplexity: "O(n + k)",
		Stable:          true,
		Description:     "A distribution sort that partitions an array into a number of buckets, sorts each bucket individually (e.g., using insertion sort), and concatenates the results.",
	}
}

func (s *BucketSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*8)

	n := len(arr)
	if n > 0 {
		minVal, maxVal := arr[0], arr[0]
		for i := 1; i < n; i++ {
			tracer.comps++
			tracer.steps = append(tracer.steps, Step{
				Type:        StepCompare,
				Indices:     []int{i},
				Description: fmt.Sprintf("Scanning arr[%d] (%d) to determine range bounds", i, arr[i]),
			})
			if arr[i] < minVal {
				minVal = arr[i]
			}
			if arr[i] > maxVal {
				maxVal = arr[i]
			}
		}

		if minVal == maxVal {
			for i := 0; i < n; i++ {
				tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted (all elements equal)", i))
			}
		} else {
			numBuckets := n / 3
			if numBuckets < 3 {
				numBuckets = 3
			}
			if numBuckets > 10 {
				numBuckets = 10
			}

			buckets := make([][]int, numBuckets)
			valRange := float64(maxVal - minVal + 1)

			for i := 0; i < n; i++ {
				val := arr[i]
				bIdx := int((float64(val-minVal) / valRange) * float64(numBuckets))
				if bIdx >= numBuckets {
					bIdx = numBuckets - 1
				}
				buckets[bIdx] = append(buckets[bIdx], val)
				tracer.steps = append(tracer.steps, Step{
					Type:        StepCompare,
					Indices:     []int{i},
					Description: fmt.Sprintf("Distributing arr[%d] (%d) into bucket %d", i, val, bIdx),
				})
			}

			// Sort individual buckets with stable insertion sort
			for b := 0; b < numBuckets; b++ {
				sort.SliceStable(buckets[b], func(i, j int) bool {
					return buckets[b][i] < buckets[b][j]
				})
			}

			// Write sorted buckets back into array
			dest := 0
			for b := 0; b < numBuckets; b++ {
				for _, val := range buckets[b] {
					tracer.Overwrite(dest, val, fmt.Sprintf("Writing sorted bucket %d item (%d) into arr[%d]", b, val, dest))
					tracer.MarkSorted(dest, fmt.Sprintf("arr[%d] is placed in sorted position", dest))
					dest++
				}
			}
		}
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "bucket",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
