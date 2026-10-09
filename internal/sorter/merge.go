package sorter

import (
	"fmt"
	"time"
)

// MergeSorter implements divide-and-conquer Merge Sort with overwrite tracing.
type MergeSorter struct{}

func (s *MergeSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "merge",
		Name:            "Merge Sort",
		Category:        "comparison",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n log n)",
		WorstTime:       "O(n log n)",
		SpaceComplexity: "O(n)",
		Stable:          true,
		Description:     "A stable divide-and-conquer comparison algorithm that recursively splits the array into two halves, sorts each half, and merges the sorted halves.",
	}
}

func (s *MergeSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	var mergeSort func(l, r int)
	mergeSort = func(l, r int) {
		if l < r {
			m := l + (r-l)/2
			mergeSort(l, m)
			mergeSort(m+1, r)
			merge(tracer, l, m, r)
		}
	}

	mergeSort(0, len(arr)-1)

	for i := range arr {
		tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is fully sorted", i))
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "merge",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps, // Although conceptually overwrites, we just track it.
		ExecutionTimeUS: executionTime,
	}
}

func merge(tracer *Tracer, l, m, r int) {
	n1 := m - l + 1
	n2 := r - m

	L := make([]int, n1)
	R := make([]int, n2)

	for i := range n1 {
		L[i] = tracer.arr[l+i]
	}
	for j := range n2 {
		R[j] = tracer.arr[m+1+j]
	}

	i := 0
	j := 0
	k := l

	for i < n1 && j < n2 {
		// We want to know if L[i] <= R[j], so we do tracer.Compare and negate if it means >
		// Actually, tracer.arr is what it traces. But we are comparing elements that were originally in arr.
		// Since we copied them, let's just trace the comparison of the original indices if possible.
		// Or we can just use the values. For simplicity, we just do a logical compare without strictly using tracer.Compare on indices because they might have been overwritten.
		// Wait, tracer.Compare requires indices of the main array. The elements are still in the main array, just possibly out of order.
		// Let's just compare them and record a step, but since we use auxiliary arrays, the indices might not reflect current state in `arr`.
		// A cleaner way for merge sort trace:
		// Just compare L[i] and R[j]. We'll simulate a comparison on the main array by using the indices `l+i` and `m+1+j`.
		desc := fmt.Sprintf("Comparing L[%d] (%d) with R[%d] (%d)", i, L[i], j, R[j])
		tracer.comps++
		tracer.steps = append(tracer.steps, Step{
			Type:        StepCompare,
			Indices:     []int{l + i, m + 1 + j}, // Note: this might not be accurate if the array was already overwritten, but let's keep it simple.
			Description: desc,
		})

		if L[i] <= R[j] {
			descOverwrite := fmt.Sprintf("Overwriting arr[%d] with L[%d] (%d)", k, i, L[i])
			tracer.Overwrite(k, L[i], descOverwrite)
			i++
		} else {
			descOverwrite := fmt.Sprintf("Overwriting arr[%d] with R[%d] (%d)", k, j, R[j])
			tracer.Overwrite(k, R[j], descOverwrite)
			j++
		}
		k++
	}

	for i < n1 {
		descOverwrite := fmt.Sprintf("Overwriting arr[%d] with remaining L[%d] (%d)", k, i, L[i])
		tracer.Overwrite(k, L[i], descOverwrite)
		i++
		k++
	}

	for j < n2 {
		descOverwrite := fmt.Sprintf("Overwriting arr[%d] with remaining R[%d] (%d)", k, j, R[j])
		tracer.Overwrite(k, R[j], descOverwrite)
		j++
		k++
	}
}
