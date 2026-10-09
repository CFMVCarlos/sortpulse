package sorter

import (
	"fmt"
	"time"
)

// TimSorter implements TimSort, a hybrid of Merge Sort and Insertion Sort designed for real-world data.
type TimSorter struct{}

func (s *TimSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "timsort",
		Name:            "TimSort",
		Category:        "hybrid",
		BestTime:        "O(n)",
		AverageTime:     "O(n log n)",
		WorstTime:       "O(n log n)",
		SpaceComplexity: "O(n)",
		Stable:          true,
		Description:     "A hybrid stable sorting algorithm derived from Merge Sort and Insertion Sort, designed to perform exceptionally well on many kinds of real-world data (used as default in Python and Java).",
	}
}

const timSortRun = 16

func (s *TimSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*10)

	n := len(arr)
	if n > 1 {
		// Sort individual subarrays of size RUN using insertion sort
		for i := 0; i < n; i += timSortRun {
			end := i + timSortRun - 1
			if end >= n {
				end = n - 1
			}
			timInsertionSort(tracer, i, end)
		}

		// Merge runs from size RUN upwards
		for size := timSortRun; size < n; size = 2 * size {
			for left := 0; left < n; left += 2 * size {
				mid := left + size - 1
				right := left + 2*size - 1
				if right >= n {
					right = n - 1
				}

				if mid < right {
					timMerge(tracer, left, mid, right)
				}
			}
		}
	}

	for i := range arr {
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "timsort",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func timInsertionSort(tracer *Tracer, left, right int) {
	for i := left + 1; i <= right; i++ {
		for j := i; j > left; j-- {
			desc := fmt.Sprintf("TimSort insertion: comparing arr[%d] and arr[%d]", j-1, j)
			if tracer.Compare(j-1, j, desc) {
				tracer.Swap(j-1, j, fmt.Sprintf("TimSort insertion: swapping arr[%d] and arr[%d]", j-1, j))
			} else {
				break
			}
		}
	}
}

func timMerge(tracer *Tracer, left, mid, right int) {
	len1 := mid - left + 1
	len2 := right - mid

	leftPart := make([]int, len1)
	rightPart := make([]int, len2)

	for i := 0; i < len1; i++ {
		leftPart[i] = tracer.arr[left+i]
	}
	for i := 0; i < len2; i++ {
		rightPart[i] = tracer.arr[mid+1+i]
	}

	i, j, k := 0, 0, left

	for i < len1 && j < len2 {
		tracer.comps++
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{left + i, mid + 1 + j},
			Description: fmt.Sprintf("TimSort merge: comparing left (%d) and right (%d)", leftPart[i], rightPart[j]),
		})

		if leftPart[i] <= rightPart[j] {
			tracer.Overwrite(k, leftPart[i], fmt.Sprintf("TimSort merge: placing left element %d into arr[%d]", leftPart[i], k))
			i++
		} else {
			tracer.Overwrite(k, rightPart[j], fmt.Sprintf("TimSort merge: placing right element %d into arr[%d]", rightPart[j], k))
			j++
		}
		k++
	}

	for i < len1 {
		tracer.Overwrite(k, leftPart[i], fmt.Sprintf("TimSort merge: flushing remaining left %d into arr[%d]", leftPart[i], k))
		i++
		k++
	}

	for j < len2 {
		tracer.Overwrite(k, rightPart[j], fmt.Sprintf("TimSort merge: flushing remaining right %d into arr[%d]", rightPart[j], k))
		j++
		k++
	}
}
