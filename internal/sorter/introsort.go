package sorter

import (
	"fmt"
	"math"
	"time"
)

// IntroSorter implements Introspective Sort (IntroSort), a hybrid of Quick Sort, Heap Sort, and Insertion Sort.
type IntroSorter struct{}

func (s *IntroSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "introsort",
		Name:            "IntroSort",
		Category:        "hybrid",
		BestTime:        "O(n log n)",
		AverageTime:     "O(n log n)",
		WorstTime:       "O(n log n)",
		SpaceComplexity: "O(log n)",
		Stable:          false,
		Description:     "A hybrid sorting algorithm (used in C++ std::sort) that starts with Quick Sort, switches to Heap Sort when recursion depth exceeds a threshold to avoid O(n²) worst-case, and uses Insertion Sort for small partitions.",
	}
}

func (s *IntroSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := &Tracer{
		arr:   arr,
		steps: []Step{},
	}

	n := len(arr)
	if n > 1 {
		maxDepth := 2 * int(math.Floor(math.Log2(float64(n))))

		var introsort func(low, high, depth int)
		introsort = func(low, high, depth int) {
			size := high - low + 1
			if size <= 0 {
				return
			}
			if size == 1 {
				tracer.MarkSorted(low, fmt.Sprintf("arr[%d] is sorted", low))
				return
			}
			if size <= 16 {
				insertionSortRange(tracer, low, high)
				for i := low; i <= high; i++ {
					tracer.MarkSorted(i, fmt.Sprintf("arr[%d] sorted by insertion sort", i))
				}
				return
			}
			if depth <= 0 {
				heapSortRange(tracer, low, high)
				for i := low; i <= high; i++ {
					tracer.MarkSorted(i, fmt.Sprintf("arr[%d] sorted by heapsort fallback", i))
				}
				return
			}

			p := partitionIntro(tracer, low, high)
			tracer.MarkSorted(p, fmt.Sprintf("Pivot arr[%d] is in its final sorted position", p))
			introsort(low, p-1, depth-1)
			introsort(p+1, high, depth-1)
		}

		introsort(0, n-1, maxDepth)
	} else if n == 1 {
		tracer.MarkSorted(0, "arr[0] is sorted")
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "introsort",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}

func partitionIntro(tracer *Tracer, low, high int) int {
	tracer.Pivot(high, fmt.Sprintf("IntroSort pivot chosen: arr[%d] (%d)", high, tracer.arr[high]))
	i := low - 1
	for j := low; j < high; j++ {
		desc := fmt.Sprintf("IntroSort: comparing arr[%d] (%d) with pivot arr[%d] (%d)", j, tracer.arr[j], high, tracer.arr[high])
		// Compare returns arr[j] > arr[high]. If not greater (<=), move to left side
		if !tracer.Compare(j, high, desc) {
			i++
			if i != j {
				tracer.Swap(i, j, fmt.Sprintf("IntroSort: swapping arr[%d] and arr[%d]", i, j))
			}
		}
	}
	tracer.Swap(i+1, high, fmt.Sprintf("IntroSort: placing pivot at index %d", i+1))
	return i + 1
}

func insertionSortRange(tracer *Tracer, low, high int) {
	for i := low + 1; i <= high; i++ {
		for j := i; j > low; j-- {
			desc := fmt.Sprintf("IntroSort (insertion): comparing arr[%d] and arr[%d]", j-1, j)
			if tracer.Compare(j-1, j, desc) {
				tracer.Swap(j-1, j, fmt.Sprintf("IntroSort (insertion): swapping arr[%d] and arr[%d]", j-1, j))
			} else {
				break
			}
		}
	}
}

func heapSortRange(tracer *Tracer, low, high int) {
	k := high - low + 1
	for i := k/2 - 1; i >= 0; i-- {
		heapifyRange(tracer, low, k, i)
	}
	for i := k - 1; i > 0; i-- {
		tracer.Swap(low, low+i, fmt.Sprintf("IntroSort (heap fallback): swapping root arr[%d] to arr[%d]", low, low+i))
		heapifyRange(tracer, low, i, 0)
	}
}

func heapifyRange(tracer *Tracer, low, k, i int) {
	largest := i
	l := 2*i + 1
	r := 2*i + 2

	if l < k {
		desc := fmt.Sprintf("IntroSort heapify: comparing arr[%d] with arr[%d]", low+l, low+largest)
		if tracer.Compare(low+l, low+largest, desc) {
			largest = l
		}
	}
	if r < k {
		desc := fmt.Sprintf("IntroSort heapify: comparing arr[%d] with arr[%d]", low+r, low+largest)
		if tracer.Compare(low+r, low+largest, desc) {
			largest = r
		}
	}
	if largest != i {
		tracer.Swap(low+i, low+largest, fmt.Sprintf("IntroSort heapify: swapping arr[%d] and arr[%d]", low+i, low+largest))
		heapifyRange(tracer, low, k, largest)
	}
}
