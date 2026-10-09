package sorter

import (
	"fmt"
	"time"
)

// ThreeWayMergeSorter implements 3-Way Merge Sort by recursively splitting the array into thirds.
type ThreeWayMergeSorter struct{}

func (s *ThreeWayMergeSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "three_way_merge",
		Name:            "3-Way Merge Sort",
		Category:        "comparison",
		BestTime:        "O(n log₃ n)",
		AverageTime:     "O(n log₃ n)",
		WorstTime:       "O(n log₃ n)",
		SpaceComplexity: "O(n)",
		Stable:          true,
		Description:     "A variant of Merge Sort that divides the array into three parts instead of two, recursively sorts them, and merges the three sorted subarrays.",
	}
}

func (s *ThreeWayMergeSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	var sort3Way func(l, r int)
	sort3Way = func(l, r int) {
		if l >= r {
			return
		}

		mid1 := l + (r-l)/3
		mid2 := l + 2*(r-l)/3

		sort3Way(l, mid1)
		if mid1+1 <= mid2 {
			sort3Way(mid1+1, mid2)
		}
		if mid2+1 <= r {
			sort3Way(mid2+1, r)
		}

		merge3Way(tracer, l, mid1, mid2, r)
	}

	if len(arr) > 1 {
		sort3Way(0, len(arr)-1)
	}

	for i := range arr {
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is fully sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "three_way_merge",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func merge3Way(tracer *Tracer, l, mid1, mid2, r int) {
	n1 := mid1 - l + 1
	n2 := 0
	if mid2 >= mid1+1 {
		n2 = mid2 - (mid1 + 1) + 1
	}
	n3 := 0
	if r >= mid2+1 {
		n3 = r - (mid2 + 1) + 1
	}

	left := make([]int, n1)
	mid := make([]int, n2)
	right := make([]int, n3)

	for i := 0; i < n1; i++ {
		left[i] = tracer.arr[l+i]
	}
	for i := 0; i < n2; i++ {
		mid[i] = tracer.arr[mid1+1+i]
	}
	for i := 0; i < n3; i++ {
		right[i] = tracer.arr[mid2+1+i]
	}

	i, j, k, dest := 0, 0, 0, l

	for i < n1 && j < n2 && k < n3 {
		tracer.comps += 2
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{l + i, mid1 + 1 + j},
			Description: fmt.Sprintf("Comparing 3-way merge heads: %d, %d, %d", left[i], mid[j], right[k]),
		})

		if left[i] <= mid[j] {
			if left[i] <= right[k] {
				tracer.Overwrite(dest, left[i], fmt.Sprintf("Overwriting arr[%d] with %d from left partition", dest, left[i]))
				i++
			} else {
				tracer.Overwrite(dest, right[k], fmt.Sprintf("Overwriting arr[%d] with %d from right partition", dest, right[k]))
				k++
			}
		} else {
			if mid[j] <= right[k] {
				tracer.Overwrite(dest, mid[j], fmt.Sprintf("Overwriting arr[%d] with %d from middle partition", dest, mid[j]))
				j++
			} else {
				tracer.Overwrite(dest, right[k], fmt.Sprintf("Overwriting arr[%d] with %d from right partition", dest, right[k]))
				k++
			}
		}
		dest++
	}

	for i < n1 && j < n2 {
		tracer.comps++
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{l + i, mid1 + 1 + j},
			Description: fmt.Sprintf("Comparing left %d with middle %d", left[i], mid[j]),
		})
		if left[i] <= mid[j] {
			tracer.Overwrite(dest, left[i], fmt.Sprintf("Overwriting arr[%d] with %d from left", dest, left[i]))
			i++
		} else {
			tracer.Overwrite(dest, mid[j], fmt.Sprintf("Overwriting arr[%d] with %d from middle", dest, mid[j]))
			j++
		}
		dest++
	}

	for j < n2 && k < n3 {
		tracer.comps++
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{mid1 + 1 + j, mid2 + 1 + k},
			Description: fmt.Sprintf("Comparing middle %d with right %d", mid[j], right[k]),
		})
		if mid[j] <= right[k] {
			tracer.Overwrite(dest, mid[j], fmt.Sprintf("Overwriting arr[%d] with %d from middle", dest, mid[j]))
			j++
		} else {
			tracer.Overwrite(dest, right[k], fmt.Sprintf("Overwriting arr[%d] with %d from right", dest, right[k]))
			k++
		}
		dest++
	}

	for i < n1 && k < n3 {
		tracer.comps++
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{l + i, mid2 + 1 + k},
			Description: fmt.Sprintf("Comparing left %d with right %d", left[i], right[k]),
		})
		if left[i] <= right[k] {
			tracer.Overwrite(dest, left[i], fmt.Sprintf("Overwriting arr[%d] with %d from left", dest, left[i]))
			i++
		} else {
			tracer.Overwrite(dest, right[k], fmt.Sprintf("Overwriting arr[%d] with %d from right", dest, right[k]))
			k++
		}
		dest++
	}

	for i < n1 {
		tracer.Overwrite(dest, left[i], fmt.Sprintf("Flushing remaining left element %d to arr[%d]", left[i], dest))
		i++
		dest++
	}
	for j < n2 {
		tracer.Overwrite(dest, mid[j], fmt.Sprintf("Flushing remaining middle element %d to arr[%d]", mid[j], dest))
		j++
		dest++
	}
	for k < n3 {
		tracer.Overwrite(dest, right[k], fmt.Sprintf("Flushing remaining right element %d to arr[%d]", right[k], dest))
		k++
		dest++
	}
}
